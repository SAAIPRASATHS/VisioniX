const API_URL = 'http://localhost:3000';

interface Question {
    id: number;
    question: string;
}

interface EvaluationResponse {
    score: string;
    strengths: string;
    gaps: string;
    personalized_feedback: string;
    improvement_tip: string;
}

interface QuestionsResponse {
    questions: Question[];
    summary: string;
}

interface SummaryResponse {
    title: string;
    mainIdea: string;
    keyPoints: string[];
    sections: { heading: string; content: string }[];
    conclusion: string;
    wordCount: number;
}

interface TutorialResponse {
    title: string;
    overview: string;
    concepts: { title: string; content: string; keyPoints?: string[] }[];
    learningPath: { title: string; content: string }[];
    exercises: { question: string; hint: string }[];
    summary: string;
}

export async function generateQuestions(content: string): Promise<QuestionsResponse> {
    const response = await fetch(`${API_URL}/api/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate questions');
    }

    return response.json();
}

export async function evaluateAnswer(
    question: string,
    answer: string,
    context: string
): Promise<EvaluationResponse> {
    const response = await fetch(`${API_URL}/api/evaluate-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, context }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to evaluate answer');
    }

    return response.json();
}

export async function generateSummary(content: string): Promise<SummaryResponse> {
    const response = await fetch(`${API_URL}/api/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate summary');
    }

    const data = await response.json();
    return data.summary;
}

export async function generateTutorial(content: string): Promise<TutorialResponse> {
    const response = await fetch(`${API_URL}/api/generate-tutorial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate tutorial');
    }

    const data = await response.json();
    return data.tutorial;
}

export { API_URL };
export type { Question, EvaluationResponse, QuestionsResponse, SummaryResponse, TutorialResponse };
