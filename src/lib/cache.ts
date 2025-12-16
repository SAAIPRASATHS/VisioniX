import { QuestionsResponse } from './prompts';

interface CacheEntry {
    questions: QuestionsResponse;
    summary: string;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();

const CACHE_TTL = 60 * 60 * 1000;

export async function hashDocument(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

export function getCachedQuestions(hash: string): CacheEntry | null {
    const entry = cache.get(hash);

    if (!entry) {
        return null;
    }

    if (Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(hash);
        return null;
    }

    return entry;
}

export function setCachedQuestions(
    hash: string,
    questions: QuestionsResponse,
    summary: string
): void {
    cache.set(hash, {
        questions,
        summary,
        timestamp: Date.now(),
    });
}

export function clearExpiredCache(): void {
    const now = Date.now();

    for (const [hash, entry] of cache.entries()) {
        if (now - entry.timestamp > CACHE_TTL) {
            cache.delete(hash);
        }
    }
}

export function getCacheStats(): { size: number; entries: string[] } {
    return {
        size: cache.size,
        entries: Array.from(cache.keys()).map(h => h.substring(0, 8) + '...'),
    };
}
