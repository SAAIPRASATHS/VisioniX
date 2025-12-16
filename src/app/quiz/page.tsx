'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2, FileText, Trophy, RefreshCw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';

// Helper function to parse score string like "7/10" to a number 0-100
const parseScore = (scoreStr: string): number => {
    if (!scoreStr) return 0;
    const match = scoreStr.match(/(\d+)\/(\d+)/);
    if (match) {
        const [, numerator, denominator] = match;
        return Math.round((parseInt(numerator) / parseInt(denominator)) * 100);
    }
    // If it's already a number
    const num = parseInt(scoreStr);
    return isNaN(num) ? 0 : num * 10; // Assume it's out of 10
};

export default function QuizPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        documentContent,
        questions,
        isLoadingQuestions,
        questionsError,
        generateQuestions,
        answers,
        currentQuestionIndex,
        submitAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        isSessionComplete,
        completeSession,
    } = useLearning();

    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Generate questions when page loads if we have content but no questions
    useEffect(() => {
        if (documentContent && questions.length === 0 && !isLoadingQuestions) {
            generateQuestions();
        }
    }, [documentContent, questions.length, isLoadingQuestions, generateQuestions]);

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswerData = currentQuestion ? answers.get(currentQuestion.id) : null;

    const handleSubmitAnswer = async () => {
        if (!currentQuestion || !currentAnswer.trim()) return;

        setIsSubmitting(true);
        await submitAnswer(currentQuestion.id, currentAnswer);
        setIsSubmitting(false);
    };

    const handleNextQuestion = () => {
        setCurrentAnswer('');
        if (currentQuestionIndex === questions.length - 1) {
            completeSession();
        } else {
            goToNextQuestion();
        }
    };

    const calculateTotalScore = (): number => {
        let total = 0;
        let count = 0;
        answers.forEach((answer) => {
            if (answer.feedback) {
                total += parseScore(answer.feedback.score);
                count++;
            }
        });
        return count > 0 ? Math.round(total / count) : 0;
    };

    const getScoreColor = (scoreStr: string): string => {
        const score = parseScore(scoreStr);
        if (score >= 70) return 'bg-green-500/10 text-green-500';
        if (score >= 40) return 'bg-yellow-500/10 text-yellow-500';
        return 'bg-red-500/10 text-red-500';
    };

    const getScoreBorderColor = (scoreStr: string): string => {
        const score = parseScore(scoreStr);
        if (score >= 70) return 'bg-green-500/10 border border-green-500/20';
        if (score >= 40) return 'bg-yellow-500/10 border border-yellow-500/20';
        return 'bg-red-500/10 border border-red-500/20';
    };

    // Auth loading state
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

    // Not authenticated
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
                            Please sign in to access the quiz.
                        </p>
                        <Button onClick={() => router.push('/login')} className="mt-6">
                            Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // No document uploaded
    if (!documentContent) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="p-4 rounded-full bg-muted">
                            <FileText className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mt-6">
                            No Document Found
                        </h2>
                        <p className="text-muted-foreground mt-2 text-center">
                            Upload a document first to start the quiz.
                        </p>
                        <Button onClick={() => router.push('/summary')} className="mt-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Upload Document
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Loading questions
    if (isLoadingQuestions) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 animate-pulse" />
                            <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mt-6">
                            Generating Quiz Questions...
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            AI is analyzing your document and creating questions
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (questionsError) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="p-4 rounded-full bg-red-500/10">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mt-6">
                            Failed to Generate Questions
                        </h2>
                        <p className="text-muted-foreground mt-2 text-center max-w-md">
                            {questionsError}
                        </p>
                        <div className="flex gap-3 mt-6">
                            <Button onClick={() => generateQuestions()} variant="primary">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                            <Button onClick={() => router.push('/summary')} variant="secondary">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Session complete - show results
    if (isSessionComplete) {
        const totalScore = calculateTotalScore();
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 mb-6">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Quiz Complete!
                            </h1>
                            <p className="text-muted-foreground mb-8">
                                You&apos;ve answered all {questions.length} questions
                            </p>

                            {/* Score */}
                            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 mb-8">
                                <span className="text-lg text-muted-foreground">Average Score:</span>
                                <span className="text-4xl font-bold text-green-500">{totalScore}%</span>
                            </div>

                            {/* Question summaries */}
                            <div className="space-y-4 mt-8 text-left">
                                <h3 className="text-lg font-semibold text-foreground">Question Summary</h3>
                                {questions.map((q, index) => {
                                    const ans = answers.get(q.id);
                                    return (
                                        <div key={q.id} className="p-4 rounded-xl bg-muted border border-border">
                                            <div className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-medium">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-foreground font-medium mb-2">{q.question}</p>
                                                    {ans?.feedback && (
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(ans.feedback.score)}`}>
                                                                Score: {ans.feedback.score}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-center gap-4 mt-8">
                                <Button onClick={() => router.push('/summary')} variant="secondary">
                                    Back to Summary
                                </Button>
                                <Button onClick={() => router.push('/')}>
                                    Home
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Quiz interface
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button onClick={() => router.push('/summary')} variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            {currentQuestion && (
                <Card className="mb-6">
                    <CardContent className="py-8">
                        {/* Question number badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                                Question {currentQuestionIndex + 1}
                            </span>
                        </div>

                        {/* Question */}
                        <h2 className="text-xl font-semibold text-foreground mb-6">
                            {currentQuestion.question}
                        </h2>

                        {/* Answer input or feedback */}
                        {currentAnswerData?.feedback ? (
                            // Show feedback
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-muted">
                                    <p className="text-sm text-muted-foreground mb-1">Your Answer:</p>
                                    <p className="text-foreground">{currentAnswerData.answer}</p>
                                </div>

                                <div className={`p-4 rounded-xl ${getScoreBorderColor(currentAnswerData.feedback.score)}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        {parseScore(currentAnswerData.feedback.score) >= 70 ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-yellow-500" />
                                        )}
                                        <span className="font-semibold text-foreground">
                                            Score: {currentAnswerData.feedback.score}
                                        </span>
                                    </div>
                                    <p className="text-foreground">
                                        {currentAnswerData.feedback.personalized_feedback}
                                    </p>
                                    {currentAnswerData.feedback.improvement_tip && (
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            💡 Tip: {currentAnswerData.feedback.improvement_tip}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Show answer input
                            <div className="space-y-4">
                                <textarea
                                    value={currentAnswer}
                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    rows={4}
                                    className="w-full p-4 rounded-xl bg-muted border border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground placeholder:text-muted-foreground resize-none"
                                />
                                <Button
                                    onClick={handleSubmitAnswer}
                                    disabled={!currentAnswer.trim() || isSubmitting || currentAnswerData?.isEvaluating}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isSubmitting || currentAnswerData?.isEvaluating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Evaluating...
                                        </>
                                    ) : (
                                        'Submit Answer'
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="secondary"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>
                <Button
                    onClick={handleNextQuestion}
                    disabled={!currentAnswerData?.feedback}
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
