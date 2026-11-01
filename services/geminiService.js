const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];

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
    try {
        const response = await retryWithBackoff(
            () =>
                ai.models.embedContent({
                    model: "gemini-embedding-001",
                    contents: text,
                    config: {
                        taskType: "SEMANTIC_SIMILARITY",
                        outputDimensionality: 768,
                    },
                }),
            "Gemini embedding generation"
        );

        return response.embeddings[0].values;
    } catch (error) {
        throw new Error("Failed to generate embedding");
    }
}

module.exports = {
    generateAIResponse,
    generateAIResponseStream,
    generateEmbedding,
};