import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { useLearning } from '../context/LearningContext';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Learn'>;

export default function LearnScreen() {
    const navigation = useNavigation<NavigationProp>();
    const {
        questions,
        isLoadingQuestions,
        answers,
        currentQuestionIndex,
        submitAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        completeSession,
        documentContent,
        generateQuestions,
    } = useLearning();

    const [currentAnswerText, setCurrentAnswerText] = useState('');

    useEffect(() => {
        if (!documentContent) {
            navigation.navigate('Home');
        } else if (questions.length === 0 && !isLoadingQuestions) {
            generateQuestions();
        }
    }, [documentContent, questions.length, isLoadingQuestions]);

    const answeredQuestions = useMemo(() => {
        const answered = new Set<number>();
        answers.forEach((_, questionId) => {
            answered.add(questionId);
        });
        return answered;
    }, [answers]);

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : undefined;
    const allAnswered = questions.length > 0 && answeredQuestions.size === questions.length;
    const progressValue = questions.length > 0
        ? (answeredQuestions.size / questions.length) * 100
        : 0;

    useEffect(() => {
        if (currentAnswer?.answer) {
            setCurrentAnswerText(currentAnswer.answer);
        } else {
            setCurrentAnswerText('');
        }
    }, [currentQuestionIndex, currentAnswer]);

    const handleSubmitAnswer = async () => {
        if (currentQuestion && currentAnswerText.trim().length >= 10) {
            await submitAnswer(currentQuestion.id, currentAnswerText);
        }
    };

    const handleComplete = () => {
        completeSession();
        navigation.navigate('Results');
    };

    if (isLoadingQuestions) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingTitle}>Analyzing Your Document</Text>
                <Text style={styles.loadingSubtitle}>Generating personalized questions...</Text>
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingSubtitle}>No questions available.</Text>
                <Button onPress={() => navigation.navigate('Home')}>Go Back</Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Progress */}
            <View style={styles.progressSection}>
                <Progress value={progressValue} max={100} showLabel />
                <Text style={styles.progressText}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                </Text>
            </View>

            {/* Question Card */}
            {currentQuestion && (
                <Card style={styles.questionCard}>
                    <CardContent>
                        <Text style={styles.questionNumber}>
                            Question {currentQuestionIndex + 1}
                        </Text>
                        <Text style={styles.questionText}>{currentQuestion.question}</Text>

                        <TextInput
                            style={styles.answerInput}
                            placeholder="Type your answer here..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            numberOfLines={4}
                            value={currentAnswerText}
                            onChangeText={setCurrentAnswerText}
                            textAlignVertical="top"
                            editable={!currentAnswer?.feedback}
                        />

                        {!currentAnswer?.feedback && (
                            <Button
                                onPress={handleSubmitAnswer}
                                disabled={currentAnswerText.trim().length < 10}
                                isLoading={currentAnswer?.isEvaluating}
                            >
                                {currentAnswer?.isEvaluating ? 'Evaluating...' : 'Submit Answer'}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Feedback */}
            {currentAnswer?.feedback && (
                <Card style={styles.feedbackCard}>
                    <CardContent>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreLabel}>Score</Text>
                            <Text style={styles.score}>{currentAnswer.feedback.score}</Text>
                        </View>

                        <View style={styles.feedbackSection}>
                            <Text style={styles.feedbackLabel}>Strengths</Text>
                            <Text style={styles.feedbackText}>{currentAnswer.feedback.strengths}</Text>
                        </View>

                        <View style={styles.feedbackSection}>
                            <Text style={styles.feedbackLabel}>Areas for Improvement</Text>
                            <Text style={styles.feedbackText}>{currentAnswer.feedback.gaps}</Text>
                        </View>

                        <View style={styles.feedbackSection}>
                            <Text style={styles.feedbackLabel}>Feedback</Text>
                            <Text style={styles.feedbackText}>{currentAnswer.feedback.personalized_feedback}</Text>
                        </View>

                        <View style={styles.tipContainer}>
                            <Text style={styles.tipLabel}>💡 Improvement Tip</Text>
                            <Text style={styles.tipText}>{currentAnswer.feedback.improvement_tip}</Text>
                        </View>
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <View style={styles.navigation}>
                <Button
                    variant="secondary"
                    onPress={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                {allAnswered ? (
                    <Button onPress={handleComplete}>
                        View Results
                    </Button>
                ) : currentQuestionIndex < questions.length - 1 ? (
                    <Button
                        onPress={goToNextQuestion}
                        disabled={!currentAnswer?.feedback}
                    >
                        Next
                    </Button>
                ) : (
                    <View />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 12,
    },
    loadingTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
    },
    loadingSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    progressSection: {
        marginBottom: 24,
    },
    progressText: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
        textAlign: 'center',
    },
    questionCard: {
        marginBottom: 16,
    },
    questionNumber: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366f1',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        lineHeight: 26,
        marginBottom: 20,
    },
    answerInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
        minHeight: 120,
        backgroundColor: '#f9fafb',
        marginBottom: 16,
    },
    feedbackCard: {
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#6366f1',
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    scoreLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    score: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6366f1',
    },
    feedbackSection: {
        marginBottom: 16,
    },
    feedbackLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    feedbackText: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 22,
    },
    tipContainer: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    tipLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6366f1',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 14,
        color: '#4f46e5',
        lineHeight: 20,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});
