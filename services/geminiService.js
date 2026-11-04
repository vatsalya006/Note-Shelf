const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");
const logger = require("./logger");

// Gemini remains responsible for embeddings
const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Groq handles text generation and streaming
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "openai/gpt-oss-120b";

const embeddingCache = new Map();
const MAX_CACHE_SIZE = 500;

function logGroqUsage(feature, usage = null) {
    logger.info("Groq API usage", {
        feature,
        model: GROQ_MODEL,
        inputTokens: usage?.prompt_tokens ?? 0,
        outputTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStatusCode(error) {
    return Number(error.status || error.code || error.response?.status);
}

function isRetryableError(error) {
    return [429, 500, 502, 503, 504].includes(getStatusCode(error));
}

async function retryWithBackoff(operation, operationName) {
    const maxRetries = 2;
    const initialDelayMs = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries;

            if (isLastAttempt || !isRetryableError(error)) {
                logger.error(`${operationName} failed`, {
                    statusCode: getStatusCode(error),
                    error: error.message,
                });
                throw error;
            }

            const delay = initialDelayMs * Math.pow(2, attempt);

            logger.warn(`${operationName} failed; retrying`, {
                statusCode: getStatusCode(error),
                retryDelayMs: delay,
                attempt: attempt + 1,
                maxRetries,
            });

            await sleep(delay);
        }
    }
}

async function generateAIResponse(prompt) {
    try {
        const response = await retryWithBackoff(
            () =>
                groq.chat.completions.create({
                    model: GROQ_MODEL,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                }),
            "Groq text generation"
        );

        logGroqUsage("text_generation", response.usage);

        return response.choices[0]?.message?.content || "";
    } catch (error) {
        logger.error("Groq text generation error", {
            statusCode: getStatusCode(error),
            error: error.message,
        });

        throw new Error("Failed to generate AI response");
    }
}

async function generateAIResponseStream(prompt) {
    try {
        const stream = await retryWithBackoff(
            () =>
                groq.chat.completions.create({
                    model: GROQ_MODEL,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                    stream: true,
                }),
            "Groq streaming text generation"
        );

        return stream;
    } catch (error) {
        logger.error("Groq streaming error", {
            statusCode: getStatusCode(error),
            error: error.message,
        });

        throw new Error("Failed to generate streaming AI response");
    }
}

async function generateEmbedding(text) {
    const normalizedText = text.trim();

    if (!normalizedText) {
        throw new Error("Cannot generate embedding for empty text");
    }

    if (embeddingCache.has(normalizedText)) {
        logger.info("Embedding cache hit");
        return embeddingCache.get(normalizedText);
    }

    try {
        const response = await retryWithBackoff(
            () =>
                gemini.models.embedContent({
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

        if (embeddingCache.size >= MAX_CACHE_SIZE) {
            const oldestKey = embeddingCache.keys().next().value;
            embeddingCache.delete(oldestKey);
        }

        embeddingCache.set(normalizedText, embedding);

        logger.info("Embedding cached");

        return embedding;
    } catch (error) {
        logger.error("Gemini embedding error", {
            statusCode: getStatusCode(error),
            error: error.message,
        });

        throw new Error("Failed to generate embedding");
    }
}

module.exports = {
    generateAIResponse,
    generateAIResponseStream,
    generateEmbedding,
};