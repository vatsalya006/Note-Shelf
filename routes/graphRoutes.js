const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Note = require("../models/Note");
const { classifyRelationship } = require("../services/graphService");
const { generateEmbedding } = require("../services/geminiService");
const GraphEdge = require("../models/GraphEdge");

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

            let embedding = note.graphEmbedding;

if (!embedding || embedding.length === 0) {
    embedding = await generateEmbedding(text);

    await Note.updateOne(
        { _id: note._id, user: req.user },
        { $set: { graphEmbedding: embedding } }
    );
}

embeddings.push(embedding);
        }

        // Calculate similarity and reuse cached relationships
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

        if (similarity < 0.75) continue;

        const source = notes[i]._id;
        const target = notes[j]._id;

        // Check MongoDB cache
        let cachedEdge = await GraphEdge.findOne({
            user: req.user,
            source,
            target,
        }).lean();

        if (!cachedEdge) {
            const relationship = await classifyRelationship(
                notes[i],
                notes[j]
            );

            cachedEdge = await GraphEdge.findOneAndUpdate(
                {
                    user: req.user,
                    source,
                    target,
                },
                {
                    $set: {
                        similarity,
                        relationship,
                    },
                },
                {
                    upsert: true,
                    returnDocument: "after",
                    setDefaultsOnInsert: true,
                }
            ).lean();
        }

        edges.push({
            source: source.toString(),
            target: target.toString(),
            similarity: Number(similarity.toFixed(3)),
            relationship: cachedEdge.relationship,
        });
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