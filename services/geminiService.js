const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateAIResponse(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to generate AI response");
    }
}
async function generateEmbedding(text) {
    try {
        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: text,
            config: {
                taskType: "SEMANTIC_SIMILARITY",
            },
        });

        return response.embeddings[0].values;
    } catch (error) {
        console.error("Embedding generation error:", error);
        throw new Error("Failed to generate embedding");
    }
}

module.exports = {
    generateAIResponse,
    generateEmbedding,
};