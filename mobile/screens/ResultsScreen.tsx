import React, { useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Trophy, RotateCcw, Home, TrendingUp, CheckCircle, XCircle } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useLearning } from '../context/LearningContext';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { questions, answers, resetSession, isSessionComplete } = useLearning();

    useEffect(() => {
        if (!isSessionComplete || questions.length === 0) {
            navigation.navigate('Home');
        }
    }, [isSessionComplete, questions.length]);

    const stats = useMemo(() => {
        let totalScore = 0;
        let answeredCount = 0;

        answers.forEach((answer) => {
            if (answer.feedback) {
                const scoreMatch = answer.feedback.score.match(/(\d+)/);
                if (scoreMatch) {
                    totalScore += parseInt(scoreMatch[1], 10);
                    answeredCount++;
                }
            }
        });

        const averageScore = answeredCount > 0 ? totalScore / answeredCount : 0;
        const maxPossible = answeredCount * 10;

        return {
            totalScore,
            answeredCount,
            averageScore,
            maxPossible,
            percentage: maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0,
        };
    }, [answers]);

    const getPerformanceLevel = (percentage: number) => {
        if (percentage >= 80) return { label: 'Excellent!', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)' };
        if (percentage >= 60) return { label: 'Good Job!', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' };
        if (percentage >= 40) return { label: 'Keep Practicing', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.1)' };
        return { label: 'Needs Improvement', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' };
    };

    const performance = getPerformanceLevel(stats.percentage);

    const handleRestart = () => {
        resetSession();
        navigation.navigate('Home');
    };

    if (!isSessionComplete || questions.length === 0) {
        return null;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.trophyContainer}>
                    <Trophy size={40} color="#ffffff" />
                </View>
                <Text style={styles.title}>Session Complete!</Text>
                <Text style={styles.subtitle}>Here's a summary of your learning session</Text>
            </View>

            {/* Score Card */}
            <Card style={styles.scoreCard}>
                <CardContent style={styles.scoreContent}>
                    <View style={styles.scoreCircle}>
                        <Text style={styles.scorePercentage}>{Math.round(stats.percentage)}%</Text>
                        <Text style={styles.scoreLabel}>Score</Text>
                    </View>

                    <View style={[styles.performanceBadge, { backgroundColor: performance.bgColor }]}>
                        <TrendingUp size={16} color={performance.color} />
                        <Text style={[styles.performanceText, { color: performance.color }]}>
                            {performance.label}
                        </Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{stats.totalScore}/{stats.maxPossible}</Text>
                            <Text style={styles.statLabel}>Total Points</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{stats.averageScore.toFixed(1)}/10</Text>
                            <Text style={styles.statLabel}>Avg Score</Text>
                        </View>
                    </View>
                </CardContent>
            </Card>

            {/* Question Review */}
            <Card style={styles.reviewCard}>
                <CardHeader>
                    <View style={styles.reviewHeader}>
                        <CheckCircle size={20} color="#6366f1" />
                        <CardTitle>Detailed Review</CardTitle>
                    </View>
                </CardHeader>
                <CardContent>
                    {questions.map((question, index) => {
                        const answer = answers.get(question.id);
                        const scoreMatch = answer?.feedback?.score.match(/(\d+)/);
                        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
                        const isGood = score >= 7;

                        return (
                            <View key={question.id} style={styles.reviewItem}>
                                <View style={styles.reviewItemHeader}>
                                    <View style={[
                                        styles.reviewIcon,
                                        { backgroundColor: isGood ? 'rgba(34, 197, 94, 0.1)' : 'rgba(249, 115, 22, 0.1)' }
                                    ]}>
                                        {isGood
                                            ? <CheckCircle size={16} color="#22c55e" />
                                            : <XCircle size={16} color="#f97316" />
                                        }
                                    </View>
                                    <View style={styles.reviewItemContent}>
                                        <View style={styles.reviewItemTitleRow}>
                                            <Text style={styles.reviewItemNumber}>Question {index + 1}</Text>
                                            <View style={[
                                                styles.reviewScoreBadge,
                                                { backgroundColor: isGood ? 'rgba(34, 197, 94, 0.1)' : 'rgba(249, 115, 22, 0.1)' }
                                            ]}>
                                                <Text style={[
                                                    styles.reviewScoreText,
                                                    { color: isGood ? '#22c55e' : '#f97316' }
                                                ]}>
                                                    {answer?.feedback?.score}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.reviewQuestion} numberOfLines={2}>
                                            {question.question}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Actions */}
            <View style={styles.actions}>
                <Button variant="secondary" onPress={handleRestart}>
                    Start New Session
                </Button>
                <Button onPress={() => navigation.navigate('Home')}>
                    Go Home
                </Button>
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
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    trophyContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#6366f1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
    scoreCard: {
        marginBottom: 16,
    },
    scoreContent: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    scoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        borderColor: '#6366f1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    scorePercentage: {
        fontSize: 32,
        fontWeight: '700',
        color: '#111827',
    },
    scoreLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    performanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
    },
    performanceText: {
        fontSize: 14,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
    },
    stat: {
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    reviewCard: {
        marginBottom: 24,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reviewItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingVertical: 12,
    },
    reviewItemHeader: {
        flexDirection: 'row',
        gap: 12,
    },
    reviewIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewItemContent: {
        flex: 1,
    },
    reviewItemTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    reviewItemNumber: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },
    reviewScoreBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    reviewScoreText: {
        fontSize: 12,
        fontWeight: '600',
    },
    reviewQuestion: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
});
