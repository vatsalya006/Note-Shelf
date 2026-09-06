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

module.exports = {
    generateAIResponse,
};