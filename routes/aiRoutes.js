const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { splitIntoSentences } = require("../services/chunkingService");
const {
    generateAIResponse,
    generateEmbedding
} = require("../services/geminiService");
const Note = require("../models/Note");

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

router.post("/summary/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        if (!note.content || !note.content.trim()) {
            return res.status(400).json({
                message: "This note has no content to summarize"
            });
        }

        const prompt = `
You are an AI assistant inside a personal knowledge management app called Note Shelf.

Summarize the following note clearly and concisely.

Rules:
- Keep the important ideas.
- Remove unnecessary repetition.
- Use simple language.
- Do not add information that is not present in the note.
- Format the summary using short paragraphs or bullet points when appropriate.

Note title:
${note.title}

Note content:
${note.content}
`;

        const summary = await generateAIResponse(prompt);

        res.json({
            message: "Summary generated successfully",
            summary: summary
        });

    } catch (error) {
        console.error("AI summary error:", error);

        res.status(500).json({
            message: "Failed to generate summary"
        });
    }
});


module.exports = router;