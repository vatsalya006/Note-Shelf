const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { generateAIResponse } = require("../services/geminiService");

const router = express.Router();

router.get("/test", authMiddleware, async (req, res) => {
    try {
        const response = await generateAIResponse(
            "Explain what an AI Second Brain is in 2 simple sentences."
        );

        res.json({
            message: "Gemini AI is working!",
            response: response
        });
    } catch (error) {
        console.error("AI test error:", error);

        res.status(500).json({
            message: "Gemini AI test failed"
        });
    }
});

module.exports = router;