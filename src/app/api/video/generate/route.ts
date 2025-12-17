import { NextRequest, NextResponse } from 'next/server';
import { generateVideoScript } from '@/lib/video/script-generator';
import { generateSlideImages } from '@/lib/video/slide-generator';
import { generateAudio } from '@/lib/video/audio-generator';
import { renderVideo, SceneAsset, getDuration } from '@/lib/video/video-renderer';

export async function POST(req: NextRequest) {
    try {
        // Video generation requires FFmpeg and Chrome which may not work on all cloud platforms
        const isVercel = process.env.VERCEL === '1';
        const isRender = process.env.RENDER === 'true';
        const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

        if (isVercel || isLambda) {
            return NextResponse.json(
                {
                    error: 'Video generation is not available on serverless platforms (Vercel/Lambda). This feature requires FFmpeg and Chrome.',
                    hint: 'Use local development server or deploy with Docker on Render/Railway for video generation.'
                },
                { status: 501 }
            );
        }

        // On Render, video generation may work but with limitations
        if (isRender) {
            console.log('Running on Render - attempting video generation with Docker setup');
        }

        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        console.log('1. Generating Script...');
        const script = await generateVideoScript(content);
        console.log('Script generated:', script.scenes.length, 'scenes');

        console.log('2. Generating Slides...');
        const imagePaths = await generateSlideImages(script);

        console.log('3. Generating Audio...');
        const sceneAssets: SceneAsset[] = [];

        for (let i = 0; i < script.scenes.length; i++) {
            const scene = script.scenes[i];
            const imagePath = imagePaths[i];

            // Generate audio
            const audioPath = await generateAudio(scene.narration);

            // Get exact duration from audio file
            let duration = await getDuration(audioPath);

            // Add a small buffer or ensure it matches at least the visual duration if specified?
            // Usually we want the visual to last as long as the audio
            // Optional: Add pauses? 

            sceneAssets.push({
                imagePath,
                audioPath,
                duration
            });
        }

        console.log('4. Rendering Video...');
        const videoUrl = await renderVideo(sceneAssets);
        console.log('Video generated:', videoUrl);

        return NextResponse.json({ videoUrl });
    } catch (error) {
        console.error('Video generation failed:', error);
        console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack');
        console.error('Environment:', {
            NODE_ENV: process.env.NODE_ENV,
            RENDER: process.env.RENDER,
            PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH
        });

        let errorMessage = 'Failed to generate video';
        if (error instanceof Error) {
            errorMessage = error.message;
            // Provide more helpful messages for common errors
            if (error.message.includes('ENOENT') || error.message.includes('spawn')) {
                errorMessage = 'Video generation requires FFmpeg and Chrome. Please ensure they are installed in the deployment environment.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Video generation timed out. The server may be under heavy load.';
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
