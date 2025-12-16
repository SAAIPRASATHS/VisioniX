import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    getQuestionGenerationPrompt,
    getAnswerEvaluationPrompt,
    getDocumentSummaryPrompt,
    getSummaryGenerationPrompt,
    QuestionsResponse,
    EvaluationResponse,
    TutorialResponse,
    SummaryResponse,
} from './prompts';

const USE_MOCK_DATA = true;

const MOCK_EVALUATION: EvaluationResponse = {
    score: "7/10",
    strengths: "Good understanding of core concepts. Clear articulation of ideas.",
    gaps: "Could provide more specific examples. Missing some key details from the source material.",
    personalized_feedback: "You've demonstrated a solid grasp of the material. To improve, try incorporating more specific examples from the document to support your points.",
    improvement_tip: "When answering questions, always tie your response back to specific evidence from the source material."
};

function extractSentences(text: string): string[] {
    let sentences = text
        .replace(/\r\n/g, '\n')
        .split(/(?<=[.!?])\s+|(?<=\n)\s*(?=[A-Z])/);

    sentences = sentences
        .map(s => s.trim().replace(/\s+/g, ' '))
        .filter(s => s.length > 10);

    if (sentences.length < 3 && text.length > 100) {
        return text.match(/.{1,200}(\s|$)/g)?.map(s => s.trim()) || [text];
    }

    return sentences;
}

function getSnippet(text: string, length: number = 200): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= length) return clean;
    return clean.substring(0, length).replace(/\s+\S*$/, '') + '...';
}

function splitIntoSections(text: string): string[] {
    let sections = text.split(/\n\s*\n/);

    if (sections.length < 2) {
        sections = text.split(/\n(?=[A-Z][a-z]+:?)/);
    }

    return sections.filter(s => s.trim().length > 50).map(s => s.replace(/\s+/g, ' ').trim());
}

function extractTitle(text: string): string {
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return 'Document Summary';

    const firstLine = lines[0].trim();
    if (firstLine.length < 100 && !firstLine.match(/[.!?]$/)) {
        return firstLine.replace(/^#+\s*/, '');
    }

    const firstSentence = extractSentences(text)[0];
    if (firstSentence) {
        const words = firstSentence.split(' ').slice(0, 6).join(' ');
        return words.length > 10 ? words + '...' : 'Document Summary';
    }

    return 'Document Summary';
}

function generateSmartMockQuestions(documentContent: string): QuestionsResponse {
    const sentences = extractSentences(documentContent);
    const firstFew = sentences.slice(0, 5).join(' ');

    return {
        questions: [
            { id: 1, question: `Based on the document content, what is the main concept being discussed and how does it relate to: "${getSnippet(firstFew, 80)}"?` },
            { id: 2, question: "Analyze the key arguments presented in this document. What are the strengths and potential weaknesses of the author's position?" },
            { id: 3, question: "How could you apply the principles discussed in this document to solve a practical problem in your field?" },
            { id: 4, question: "Compare and contrast the different perspectives or approaches mentioned in the document. Which do you find most compelling and why?" },
            { id: 5, question: "Based on the information provided, what conclusions can you draw? What implications might these have for future developments?" }
        ]
    };
}

function generateSmartMockSummary(documentContent: string): SummaryResponse {
    const sentences = extractSentences(documentContent);
    const sections = splitIntoSections(documentContent);
    const wordCount = documentContent.split(/\s+/).length;

    const mainIdea = sentences.slice(0, 2).join(' ') ||
        "This document presents key information on the topic at hand.";

    const keyPoints: string[] = [];
    const step = Math.max(1, Math.floor(sentences.length / 5));
    for (let i = 0; i < 5 && i * step < sentences.length; i++) {
        const sentence = sentences[i * step];
        if (sentence) {
            keyPoints.push(sentence.length > 150 ? sentence.substring(0, 147) + '...' : sentence);
        }
    }

    while (keyPoints.length < 3) {
        keyPoints.push(`Key point ${keyPoints.length + 1} from the document content.`);
    }

    const docSections = sections.slice(0, 3).map((section, index) => ({
        heading: `Section ${index + 1}: ${extractTitle(section).substring(0, 50)}`,
        content: getSnippet(section, 200)
    }));

    while (docSections.length < 2) {
        docSections.push({
            heading: `Additional Content ${docSections.length + 1}`,
            content: getSnippet(documentContent.substring(docSections.length * 500), 200)
        });
    }

    const conclusion = sentences.slice(-2).join(' ') ||
        "The document provides valuable insights on the discussed topics.";

    return {
        title: extractTitle(documentContent),
        mainIdea,
        keyPoints,
        sections: docSections,
        conclusion,
        wordCount
    };
}

function generateSmartMockTutorial(documentContent: string): TutorialResponse {
    const sentences = extractSentences(documentContent);
    const sections = splitIntoSections(documentContent);
    const title = extractTitle(documentContent);

    const concepts = sections.slice(0, 3).map((section, index) => {
        const sectionSentences = extractSentences(section);
        return {
            title: `Concept ${index + 1}: ${extractTitle(section).substring(0, 40)}`,
            content: sectionSentences[0] || getSnippet(section, 150),
            keyPoints: sectionSentences.slice(1, 4).map(s => s.length > 100 ? s.substring(0, 97) + '...' : s)
        };
    });

    while (concepts.length < 2) {
        concepts.push({
            title: `Core Concept ${concepts.length + 1}`,
            content: getSnippet(documentContent.substring(concepts.length * 300), 150),
            keyPoints: ["Key understanding from the material"]
        });
    }

    return {
        title: `Tutorial: ${title}`,
        overview: sentences.slice(0, 2).join(' ') ||
            "This tutorial covers the key concepts from your uploaded document.",
        concepts,
        learningPath: [
            { title: "Step 1: Foundation", content: "Begin by understanding the core concepts introduced at the start of the document." },
            { title: "Step 2: Deep Dive", content: "Explore the detailed explanations and examples provided throughout the material." },
            { title: "Step 3: Application", content: "Apply what you've learned to the practical scenarios mentioned in the document." },
            { title: "Step 4: Review", content: "Test your understanding with the quiz questions and review any unclear sections." }
        ],
        exercises: [
            { question: "Explain the main concept in your own words.", hint: "Focus on the key ideas from the first section." },
            { question: "How would you apply this knowledge in practice?", hint: "Think about real-world applications discussed in the document." }
        ],
        summary: sentences.slice(-2).join(' ') ||
            "This tutorial has covered the essential concepts from your document."
    };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
    },
});

function parseJsonResponse<T>(text: string): T {
    let cleanText = text.trim();

    if (cleanText.startsWith('```json')) {
        cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.slice(3);
    }

    if (cleanText.endsWith('```')) {
        cleanText = cleanText.slice(0, -3);
    }

    cleanText = cleanText.trim();

    return JSON.parse(cleanText) as T;
}

export async function generateQuestions(
    documentContent: string
): Promise<QuestionsResponse> {
    if (USE_MOCK_DATA) {
        console.log('[MOCK MODE] Returning smart mock questions based on document');
        return generateSmartMockQuestions(documentContent);
    }

    try {
        const prompt = getQuestionGenerationPrompt(documentContent);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const parsed = parseJsonResponse<QuestionsResponse>(text);

        if (!parsed.questions || !Array.isArray(parsed.questions)) {
            throw new Error('Invalid response structure: missing questions array');
        }

        if (parsed.questions.length !== 5) {
            console.warn(`Expected 5 questions, got ${parsed.questions.length}`);
        }

        return parsed;
    } catch (error) {
        console.error('Error generating questions:', error);
        throw new Error(
            error instanceof Error
                ? `Failed to generate questions: ${error.message}`
                : 'Failed to generate questions'
        );
    }
}

export async function generateDocumentSummary(
    documentContent: string
): Promise<string> {
    if (USE_MOCK_DATA) {
        console.log('[MOCK MODE] Returning mock summary');
        return 'This is a mock document summary for demonstration purposes. ' + documentContent.substring(0, 500) + '...';
    }

    try {
        const prompt = getDocumentSummaryPrompt(documentContent);
        const result = await model.generateContent(prompt);
        const response = result.response;

        return response.text().trim();
    } catch (error) {
        console.error('Error generating summary:', error);
        return documentContent.substring(0, 2000) + '...';
    }
}

export async function evaluateAnswer(
    question: string,
    userAnswer: string,
    documentSummary: string
): Promise<EvaluationResponse> {
    if (USE_MOCK_DATA) {
        console.log('[MOCK MODE] Returning mock evaluation');
        return MOCK_EVALUATION;
    }

    try {
        const prompt = getAnswerEvaluationPrompt(question, userAnswer, documentSummary);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const parsed = parseJsonResponse<EvaluationResponse>(text);

        const requiredFields = ['score', 'strengths', 'gaps', 'personalized_feedback', 'improvement_tip'];
        for (const field of requiredFields) {
            if (!(field in parsed)) {
                throw new Error(`Invalid response structure: missing ${field}`);
            }
        }

        return parsed;
    } catch (error) {
        console.error('Error evaluating answer:', error);
        throw new Error(
            error instanceof Error
                ? `Failed to evaluate answer: ${error.message}`
                : 'Failed to evaluate answer'
        );
    }
}

export function isGeminiConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY;
}

export async function generateTutorial(
    documentContent: string
): Promise<TutorialResponse> {
    if (USE_MOCK_DATA) {
        console.log('[MOCK MODE] Returning smart mock tutorial based on document');
        return generateSmartMockTutorial(documentContent);
    }

    const { getTutorialGenerationPrompt } = await import('./prompts');

    try {
        const tutorialModel = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 4096,
            },
        });

        const prompt = getTutorialGenerationPrompt(documentContent);
        const result = await tutorialModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const parsed = parseJsonResponse<TutorialResponse>(text);

        if (!parsed.title || !parsed.overview || !parsed.concepts || !parsed.learningPath) {
            throw new Error('Invalid response structure: missing required fields');
        }

        return parsed;
    } catch (error) {
        console.error('Error generating tutorial:', error);
        throw new Error(
            error instanceof Error
                ? `Failed to generate tutorial: ${error.message}`
                : 'Failed to generate tutorial'
        );
    }
}

export async function generateSummary(
    documentContent: string
): Promise<SummaryResponse> {
    if (USE_MOCK_DATA) {
        console.log('[MOCK MODE] Returning smart mock summary based on document');
        return generateSmartMockSummary(documentContent);
    }

    try {
        const prompt = getSummaryGenerationPrompt(documentContent);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const parsed = parseJsonResponse<SummaryResponse>(text);

        if (!parsed.title || !parsed.mainIdea || !parsed.keyPoints || !parsed.sections) {
            throw new Error('Invalid response structure: missing required fields');
        }

        return parsed;
    } catch (error) {
        console.error('Error generating summary:', error);
        throw new Error(
            error instanceof Error
                ? `Failed to generate summary: ${error.message}`
                : 'Failed to generate summary'
        );
    }
}
