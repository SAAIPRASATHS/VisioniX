import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Brain, Target, Zap, FileText, ChevronRight } from 'lucide-react-native';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { DocumentUpload } from '../components/DocumentUpload';
import { useLearning } from '../context/LearningContext';
import { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const {
        documentContent,
        generateQuestions,
        isLoadingQuestions,
        questionsError,
        questions,
    } = useLearning();

    const handleStartLearning = async () => {
        if (!documentContent) return;

        if (questions.length === 0) {
            await generateQuestions();
        }

        navigation.navigate('Learn');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Hero Section */}
            <View style={styles.hero}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Powered by Gemini AI</Text>
                </View>

                <Text style={styles.title}>
                    Transform Your Learning
                </Text>
                <Text style={styles.titleAccent}>With AI Intelligence</Text>

                <Text style={styles.subtitle}>
                    Upload documents and receive personalized questions with instant, detailed feedback
                </Text>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresContainer}>
                <Text style={styles.sectionLabel}>FEATURES</Text>
                <View style={styles.features}>
                    <Card style={styles.featureCard}>
                        <CardContent style={styles.featureContent}>
                            <View style={[styles.featureIcon, styles.featureIconPurple]}>
                                <Brain size={22} color="#6366f1" />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>Deep Analysis</Text>
                                <Text style={styles.featureDesc}>
                                    Higher-order thinking questions
                                </Text>
                            </View>
                        </CardContent>
                    </Card>

                    <Card style={styles.featureCard}>
                        <CardContent style={styles.featureContent}>
                            <View style={[styles.featureIcon, styles.featureIconPink]}>
                                <Target size={22} color="#ec4899" />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>Smart Feedback</Text>
                                <Text style={styles.featureDesc}>
                                    Personalized improvement tips
                                </Text>
                            </View>
                        </CardContent>
                    </Card>

                    <Card style={styles.featureCard}>
                        <CardContent style={styles.featureContent}>
                            <View style={[styles.featureIcon, styles.featureIconGreen]}>
                                <Zap size={22} color="#10b981" />
                            </View>
                            <View style={styles.featureTextContainer}>
                                <Text style={styles.featureTitle}>Lightning Fast</Text>
                                <Text style={styles.featureDesc}>
                                    Optimized for quick results
                                </Text>
                            </View>
                        </CardContent>
                    </Card>
                </View>
            </View>

            {/* Upload Section */}
            <View style={styles.uploadContainer}>
                <Text style={styles.sectionLabel}>GET STARTED</Text>
                <Card style={styles.uploadCard}>
                    <CardContent style={styles.uploadCardContent}>
                        <View style={styles.uploadHeader}>
                            <View style={styles.uploadIconContainer}>
                                <FileText size={18} color="#6366f1" />
                            </View>
                            <View style={styles.uploadHeaderText}>
                                <Text style={styles.uploadTitle}>Upload Document</Text>
                                <Text style={styles.uploadSubtitle}>PDF, TXT, or paste text</Text>
                            </View>
                        </View>

                        <View style={styles.uploadArea}>
                            <DocumentUpload />
                        </View>

                        {questionsError && (
                            <View style={styles.error}>
                                <Text style={styles.errorText}>{questionsError}</Text>
                            </View>
                        )}

                        {documentContent && (
                            <View style={styles.actions}>
                                <Button
                                    size="lg"
                                    onPress={handleStartLearning}
                                    isLoading={isLoadingQuestions}
                                    disabled={isLoadingQuestions}
                                >
                                    <View style={styles.buttonContent}>
                                        <Text style={styles.buttonText}>
                                            {isLoadingQuestions ? 'Generating Questions...' : 'Start Learning'}
                                        </Text>
                                        {!isLoadingQuestions && <ChevronRight size={18} color="#ffffff" />}
                                    </View>
                                </Button>
                            </View>
                        )}
                    </CardContent>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        padding: 24,
        paddingBottom: 48,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 8,
    },
    badge: {
        backgroundColor: '#ede9fe',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 20,
    },
    badgeText: {
        fontSize: 12,
        color: '#7c3aed',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    titleAccent: {
        fontSize: 32,
        fontWeight: '800',
        color: '#6366f1',
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 24,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    featuresContainer: {
        marginBottom: 28,
    },
    features: {
        gap: 10,
    },
    featureCard: {
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    featureContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 14,
    },
    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureIconPurple: {
        backgroundColor: '#ede9fe',
    },
    featureIconPink: {
        backgroundColor: '#fce7f3',
    },
    featureIconGreen: {
        backgroundColor: '#d1fae5',
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 13,
        color: '#64748b',
    },
    uploadContainer: {
        marginBottom: 16,
    },
    uploadCard: {
        borderRadius: 16,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    uploadCardContent: {
        padding: 20,
    },
    uploadHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    uploadIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#ede9fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadHeaderText: {
        flex: 1,
    },
    uploadTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1e293b',
    },
    uploadSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
        marginTop: 2,
    },
    uploadArea: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    error: {
        backgroundColor: '#fef2f2',
        borderRadius: 10,
        padding: 14,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 13,
        fontWeight: '500',
    },
    actions: {
        marginTop: 20,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
