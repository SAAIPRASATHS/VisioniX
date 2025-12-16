'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, FileText, BookOpen, Sparkles, Cpu, Video, Brain, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            router.push('/summary');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-12 sm:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 text-white text-sm font-medium mb-6 shadow-lg shadow-cyan-500/25">
                            <Sparkles className="w-4 h-4" />
                            Powered by Gemini 2.5 Flash
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                            Learn Smart with VisioniX
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Transform your documents into comprehensive summaries, interactive tutorials, and AI-generated video content.
                        </p>

                        {/* Welcome message for logged in users */}
                        {isAuthenticated && user && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-4 border border-cyan-500/20">
                                Welcome back, {user.name}! 👋
                            </div>
                        )}
                    </div>

                    {/* Features Section */}
                    <div className="max-w-3xl mx-auto">
                        <Card className="p-6">
                            <CardContent>
                                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                                    Our AI-Powered Features
                                </h2>

                                <p className="text-muted-foreground text-center mb-8">
                                    VisioniX uses cutting-edge AI technology to help you learn faster and more effectively.
                                    Upload any document and unlock powerful learning tools powered by Google&apos;s Gemini 2.5 Flash model.
                                </p>

                                {/* Feature Grid - All using cyan color */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                        <Brain className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">Smart Summarization</h3>
                                            <p className="text-sm text-muted-foreground">Extract key insights and main ideas from any document</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                        <BookOpen className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">Interactive Tutorials</h3>
                                            <p className="text-sm text-muted-foreground">Generate step-by-step learning guides</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                        <Video className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">AI Video Generation</h3>
                                            <p className="text-sm text-muted-foreground">Create video presentations of your content</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                        <Cpu className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-foreground">Advanced AI Quiz</h3>
                                            <p className="text-sm text-muted-foreground">Test your knowledge with AI-generated questions</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button - Single cyan color */}
                                <div className="text-center">
                                    <Button
                                        size="lg"
                                        onClick={handleGetStarted}
                                        className="min-w-[200px] bg-cyan-500 hover:bg-cyan-600"
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <FileText className="w-5 h-5 mr-2" />
                                                Go to Summarize
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-5 h-5 mr-2" />
                                                Sign In to Get Started
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
