const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];

const embeddingCache = new Map();
const MAX_CACHE_SIZE = 500;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatusCode(error) {
    return error.status || error.code || error.response?.status;
}

function isRetryableError(error) {
    const statusCode = getStatusCode(error);

    return RETRYABLE_STATUS_CODES.includes(Number(statusCode));
}

async function retryWithBackoff(operation, operationName) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await operation();
        } catch (error) {
            const isLastAttempt = attempt === MAX_RETRIES;

            if (isLastAttempt || !isRetryableError(error)) {
                console.error(`${operationName} failed:`, error);
                throw error;
            }

            const delay = INITIAL_DELAY_MS * Math.pow(2, attempt);

            console.warn(
                `${operationName} failed with status ${getStatusCode(error)}. ` +
                `Retrying in ${delay}ms... (attempt ${attempt + 1}/${MAX_RETRIES})`
            );

            await sleep(delay);
        }
    }
}

async function generateAIResponse(prompt) {
    try {
        const response = await retryWithBackoff(
            () =>
                ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: prompt,
                }),
            "Gemini text generation"
        );

        return response.text;
    } catch (error) {
        throw new Error("Failed to generate AI response");
    }
}

async function generateAIResponseStream(prompt) {
    try {
        const stream = await retryWithBackoff(
            () =>
                ai.models.generateContentStream({
                    model: "gemini-3.8-flash",
                    contents: prompt,
                }),
            "Gemini streaming text generation"
        );

        return stream;
    } catch (error) {
        console.error("Gemini streaming error:", error);
        throw new Error("Failed to generate streaming AI response");
    }
}

async function generateEmbedding(text) {
    const normalizedText = text.trim();

    if (!normalizedText) {
        throw new Error("Cannot generate embedding for empty text");
    }

    // Return cached embedding if available
    if (embeddingCache.has(normalizedText)) {
        console.log("Embedding cache hit");
        return embeddingCache.get(normalizedText);
    }

    try {
        const response = await retryWithBackoff(
            () =>
                ai.models.embedContent({
                    model: "gemini-embedding-001",
                    contents: normalizedText,
                    config: {
                        taskType: "SEMANTIC_SIMILARITY",
                        outputDimensionality: 768,
                    },
                }),
            "Gemini embedding generation"
        );

        const embedding = response.embeddings[0].values;

        // Keep cache size bounded
        if (embeddingCache.size >= MAX_CACHE_SIZE) {
            const oldestKey = embeddingCache.keys().next().value;
            embeddingCache.delete(oldestKey);
        }

        embeddingCache.set(normalizedText, embedding);

        console.log("Embedding cached");

        return embedding;
    } catch (error) {
        throw new Error("Failed to generate embedding");
    }
}

module.exports = {
    generateAIResponse,
    generateAIResponseStream,
    generateEmbedding,
};