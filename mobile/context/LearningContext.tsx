import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
    generateQuestions as apiGenerateQuestions,
    evaluateAnswer as apiEvaluateAnswer,
    generateSummary as apiGenerateSummary,
    generateTutorial as apiGenerateTutorial,
    Question,
    EvaluationResponse,
    SummaryResponse,
    TutorialResponse,
} from '../lib/api';

interface AnswerWithFeedback {
    questionId: number;
    answer: string;
    feedback: EvaluationResponse | null;
    isEvaluating: boolean;
}

interface LearningState {
    documentContent: string | null;
    documentSummary: string | null;
    questions: Question[];
    isLoadingQuestions: boolean;
    questionsError: string | null;
    answers: Map<number, AnswerWithFeedback>;
    currentQuestionIndex: number;
    tutorial: TutorialResponse | null;
    isLoadingTutorial: boolean;
    tutorialError: string | null;
    summary: SummaryResponse | null;
    isLoadingSummary: boolean;
    summaryError: string | null;
    isSessionComplete: boolean;
}

interface LearningActions {
    setDocument: (content: string) => void;
    clearDocument: () => void;
    generateQuestions: () => Promise<void>;
    generateTutorial: () => Promise<void>;
    generateSummary: () => Promise<void>;
    submitAnswer: (questionId: number, answer: string) => Promise<void>;
    goToNextQuestion: () => void;
    goToPreviousQuestion: () => void;
    resetSession: () => void;
    completeSession: () => void;
}

type LearningContextType = LearningState & LearningActions;

const LearningContext = createContext<LearningContextType | null>(null);

const initialState: LearningState = {
    documentContent: null,
    documentSummary: null,
    questions: [],
    isLoadingQuestions: false,
    questionsError: null,
    answers: new Map(),
    currentQuestionIndex: 0,
    tutorial: null,
    isLoadingTutorial: false,
    tutorialError: null,
    summary: null,
    isLoadingSummary: false,
    summaryError: null,
    isSessionComplete: false,
};

export function LearningProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<LearningState>(initialState);

    const setDocument = useCallback((content: string) => {
        setState(prev => ({
            ...prev,
            documentContent: content,
            documentSummary: null,
            questions: [],
            questionsError: null,
            answers: new Map(),
            currentQuestionIndex: 0,
            isSessionComplete: false,
        }));
    }, []);

    const clearDocument = useCallback(() => {
        setState(initialState);
    }, []);

    const generateQuestions = useCallback(async () => {
        if (!state.documentContent) {
            setState(prev => ({ ...prev, questionsError: 'No document uploaded' }));
            return;
        }

        setState(prev => ({ ...prev, isLoadingQuestions: true, questionsError: null }));

        try {
            const data = await apiGenerateQuestions(state.documentContent);
            setState(prev => ({
                ...prev,
                questions: data.questions,
                documentSummary: data.summary,
                isLoadingQuestions: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoadingQuestions: false,
                questionsError: error instanceof Error ? error.message : 'Failed to generate questions',
            }));
        }
    }, [state.documentContent]);

    const submitAnswer = useCallback(async (questionId: number, answer: string) => {
        if (!state.documentSummary) return;

        const question = state.questions.find(q => q.id === questionId);
        if (!question) return;

        setState(prev => {
            const newAnswers = new Map(prev.answers);
            newAnswers.set(questionId, {
                questionId,
                answer,
                feedback: null,
                isEvaluating: true,
            });
            return { ...prev, answers: newAnswers };
        });

        try {
            const evaluation = await apiEvaluateAnswer(question.question, answer, state.documentSummary);
            setState(prev => {
                const newAnswers = new Map(prev.answers);
                newAnswers.set(questionId, {
                    questionId,
                    answer,
                    feedback: evaluation,
                    isEvaluating: false,
                });
                return { ...prev, answers: newAnswers };
            });
        } catch (error) {
            setState(prev => {
                const newAnswers = new Map(prev.answers);
                newAnswers.set(questionId, {
                    questionId,
                    answer,
                    feedback: null,
                    isEvaluating: false,
                });
                return { ...prev, answers: newAnswers };
            });
            console.error('Error evaluating answer:', error);
        }
    }, [state.documentSummary, state.questions]);

    const goToNextQuestion = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1),
        }));
    }, []);

    const goToPreviousQuestion = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
        }));
    }, []);

    const resetSession = useCallback(() => {
        setState(initialState);
    }, []);

    const completeSession = useCallback(() => {
        setState(prev => ({ ...prev, isSessionComplete: true }));
    }, []);

    const generateTutorial = useCallback(async () => {
        if (!state.documentContent) {
            setState(prev => ({ ...prev, tutorialError: 'No document uploaded' }));
            return;
        }

        setState(prev => ({ ...prev, isLoadingTutorial: true, tutorialError: null }));

        try {
            const tutorial = await apiGenerateTutorial(state.documentContent);
            setState(prev => ({
                ...prev,
                tutorial,
                isLoadingTutorial: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoadingTutorial: false,
                tutorialError: error instanceof Error ? error.message : 'Failed to generate tutorial',
            }));
        }
    }, [state.documentContent]);

    const generateSummary = useCallback(async () => {
        if (!state.documentContent) {
            setState(prev => ({ ...prev, summaryError: 'No document uploaded' }));
            return;
        }

        setState(prev => ({ ...prev, isLoadingSummary: true, summaryError: null }));

        try {
            const summary = await apiGenerateSummary(state.documentContent);
            setState(prev => ({
                ...prev,
                summary,
                isLoadingSummary: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoadingSummary: false,
                summaryError: error instanceof Error ? error.message : 'Failed to generate summary',
            }));
        }
    }, [state.documentContent]);

    const value: LearningContextType = {
        ...state,
        setDocument,
        clearDocument,
        generateQuestions,
        generateTutorial,
        generateSummary,
        submitAnswer,
        goToNextQuestion,
        goToPreviousQuestion,
        resetSession,
        completeSession,
    };

    return (
        <LearningContext.Provider value={value}>
            {children}
        </LearningContext.Provider>
    );
}

export function useLearning() {
    const context = useContext(LearningContext);
    if (!context) {
        throw new Error('useLearning must be used within a LearningProvider');
    }
    return context;
}
