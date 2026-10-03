const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { cosineSimilarity } = require("../services/chunkingService");
const {
    generateAIResponse,
    generateEmbedding
} = require("../services/geminiService");
const Note = require("../models/Note");

const router = express.Router();

router.get("/threshold-test", authMiddleware, async (req, res) => {
    try {
        const pairs = [
            {
                name: "Very Similar",
                a: "React is a JavaScript library used to build user interfaces.",
                b: "React is a JavaScript library for creating user interfaces."
            },
            {
                name: "Related",
                a: "React components can receive data through props.",
                b: "Props allow data to be passed from a parent component to a child component."
            },
            {
                name: "Different",
                a: "React is used to build web interfaces.",
                b: "MongoDB is a NoSQL database that stores documents."
            },
            {
                name: "Completely Different",
                a: "React components can manage application state.",
                b: "The weather forecast predicts heavy rainfall tomorrow."
            }
        ];

        const results = [];

        for (const pair of pairs) {
            const embeddingA = await generateEmbedding(pair.a);
            const embeddingB = await generateEmbedding(pair.b);

            const similarity = cosineSimilarity(
                embeddingA,
                embeddingB
            );

            results.push({
                name: pair.name,
                similarity
            });
        }

        res.json({
            message: "Threshold test completed",
            results
        });

    } catch (error) {
        console.error("Threshold test error:", error);

        res.status(500).json({
            message: "Threshold test failed"
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