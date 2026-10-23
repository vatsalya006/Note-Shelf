const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Note = require("../models/Note");
const { classifyRelationship } = require("../services/graphService");
const { generateEmbedding } = require("../services/geminiService");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user })
            .select("_id title content type createdAt")
            .lean();

        const nodes = notes.map((note) => ({
            id: note._id.toString(),
            title: note.title,
            type: note.type,
            createdAt: note.createdAt,
        }));

        const edges = [];
        const embeddings = [];

        // Generate one embedding per note
        for (const note of notes) {
            const text = `${note.title}\n${note.content || ""}`.slice(0, 8000);

            if (!text.trim()) {
                embeddings.push(null);
                continue;
            }

            embeddings.push(await generateEmbedding(text));
        }

        // Calculate cosine similarity between notes
        for (let i = 0; i < notes.length; i++) {
            if (!embeddings[i]) continue;

            for (let j = i + 1; j < notes.length; j++) {
                if (!embeddings[j]) continue;

                const a = embeddings[i];
                const b = embeddings[j];

                let dot = 0;
                let normA = 0;
                let normB = 0;

                for (let k = 0; k < a.length; k++) {
                    dot += a[k] * b[k];
                    normA += a[k] * a[k];
                    normB += b[k] * b[k];
                }

                const similarity =
                    dot / (Math.sqrt(normA) * Math.sqrt(normB));

if (similarity >= 0.75) {
    const relationship = await classifyRelationship(
        notes[i],
        notes[j]
    );

    edges.push({
        source: notes[i]._id.toString(),
        target: notes[j]._id.toString(),
        similarity: Number(similarity.toFixed(3)),
        relationship,
    });
}

            }
        }

        res.status(200).json({ nodes, edges });
    } catch (error) {
        console.error("Knowledge graph error:", error);

        res.status(500).json({
            message: "Failed to generate knowledge graph",
        });
    }
});

module.exports = router;