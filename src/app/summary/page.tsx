'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, FileText, RefreshCw, Sparkles, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SummaryCard } from '@/components/SummaryCard';
import { DocumentUpload } from '@/components/DocumentUpload';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';

export default function SummaryPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [showSummary, setShowSummary] = useState(false);
    const {
        documentContent,
        summary,
        isLoadingSummary,
        summaryError,
        generateSummary,
    } = useLearning();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleGenerateSummary = async () => {
        setShowSummary(true);
        if (!summary && !isLoadingSummary) {
            await generateSummary();
        }
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-muted-foreground mt-4">Loading...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // If not authenticated, show message
    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="p-4 rounded-full bg-yellow-500/10">
                            <Lock className="w-12 h-12 text-yellow-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mt-6">
                            Authentication Required
                        </h2>
                        <p className="text-muted-foreground mt-2 text-center">
                            Please sign in to access the summarization feature.
                        </p>
                        <Button onClick={() => router.push('/login')} className="mt-6">
                            Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // No document state - show upload section
    if (!documentContent) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button onClick={() => router.push('/')} variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>

                {/* Feature Introduction */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-white/10 text-blue-600 dark:text-white text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Summarization
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Document Summary
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Upload your document and generate a comprehensive AI-powered summary with key insights.
                    </p>
                </div>

                {/* Upload Section */}
                <Card className="mb-8">
                    <CardContent className="py-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-white" />
                            Upload Your Document
                        </h2>
                        <DocumentUpload />
                    </CardContent>
                </Card>

                {/* Features List */}
                <Card>
                    <CardContent className="py-8">
                        <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                            What You'll Get
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Main Idea Extraction</p>
                                    <p className="text-sm text-muted-foreground">Identify the core message of your document</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Key Points Summary</p>
                                    <p className="text-sm text-muted-foreground">Important points organized in bullet format</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Concept Breakdown</p>
                                    <p className="text-sm text-muted-foreground">Complex ideas explained simply</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">AI Video Generation</p>
                                    <p className="text-sm text-muted-foreground">Create video presentations of your summary</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }


    // Feature introduction page (shown before generating summary)
    if (!showSummary && !summary) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button onClick={() => router.push('/')} variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>

                {/* Feature Introduction */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-white/10 text-blue-600 dark:text-white text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Summarization
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Document Summary
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Generate a comprehensive summary of your document with key insights and main ideas extracted by AI.
                    </p>
                </div>

                {/* Features List */}
                <Card className="mb-8">
                    <CardContent className="py-8">
                        <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                            What You'll Get
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Main Idea Extraction</p>
                                    <p className="text-sm text-muted-foreground">Identify the core message of your document</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Key Points Summary</p>
                                    <p className="text-sm text-muted-foreground">Important points organized in bullet format</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Concept Breakdown</p>
                                    <p className="text-sm text-muted-foreground">Complex ideas explained simply</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">AI Video Generation</p>
                                    <p className="text-sm text-muted-foreground">Create video presentations of your summary</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Generate Button */}
                <div className="text-center">
                    <Button size="lg" onClick={handleGenerateSummary}>
                        Generate Summary
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoadingSummary) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
                            <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mt-6">
                            Generating Summary...
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Analyzing your document and extracting key information
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (summaryError) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="p-4 rounded-full bg-red-500/10">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mt-6">
                            Failed to Generate Summary
                        </h2>
                        <p className="text-muted-foreground mt-2 text-center max-w-md">
                            {summaryError}
                        </p>
                        <div className="flex gap-3 mt-6">
                            <Button onClick={() => generateSummary()} variant="primary">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                            <Button onClick={() => router.push('/')} variant="secondary">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Summary display
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button onClick={() => router.push('/')} variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
                <Button onClick={() => generateSummary()} variant="secondary" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                </Button>
            </div>

            {/* Summary Card */}
            {summary && <SummaryCard summary={summary} />}

            {/* Video Generation Section */}
            {summary && (
                <div className="mt-8">
                    <VideoGenerator
                        content={documentContent || summary.mainIdea}
                        title={summary.title}
                    />
                </div>
            )}
        </div>
    );
}

function VideoGenerator({ content, title }: { content: string; title: string }) {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleGenerateVideo = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const response = await fetch('/api/video/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            // Try to parse JSON, handle empty responses
            let data;
            const text = await response.text();
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error('Server returned an invalid response. Video generation may not be available on this deployment.');
            }

            if (!response.ok) {
                throw new Error(data.error || data.hint || 'Failed to generate video');
            }

            setVideoUrl(data.videoUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-1">AI Video Summary</h3>
                        <p className="text-muted-foreground">
                            Generate a short video presentation of this summary.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 p-4 rounded-lg flex items-center gap-3 text-red-500 mb-4">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!videoUrl ? (
                    <Button
                        onClick={handleGenerateVideo}
                        disabled={isGenerating}
                        className="w-full sm:w-auto"
                        variant="primary"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating Video (this may take a minute)...
                            </>
                        ) : (
                            <>
                                <Loader2 className="w-4 h-4 mr-2" /> {/* Using generic icon as placeholder if Play not imported, adding Play import next */}
                                Generate Video
                            </>
                        )}
                    </Button>
                ) : (
                    <div className="space-y-4">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                            <video
                                src={videoUrl}
                                controls
                                className="w-full h-full"
                                poster="/video-placeholder.png"
                            />
                        </div>
                        <Button
                            onClick={handleGenerateVideo}
                            variant="secondary"
                            className="w-full sm:w-auto"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate Video
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
