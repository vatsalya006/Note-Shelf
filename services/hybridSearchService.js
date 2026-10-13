const { generateEmbedding } = require("./geminiService");
const { searchSimilar } = require("./pineconeService");
const { keywordSearch } = require("./keywordSearchService");

async function hybridSearch(query, userId, limit = 10) {
    if (!query || !query.trim()) {
        return [];
    }

    const k = 60;

    // Run semantic and keyword searches in parallel
    const queryVector = await generateEmbedding(query);

    const [semanticResults, keywordResults] = await Promise.all([
        searchSimilar(queryVector, userId, limit),
        keywordSearch(query, userId, limit),
    ]);

    const scores = new Map();
    const documents = new Map();

    // Process semantic results, keeping only the highest-ranked chunk per note
    const seenSemanticNoteIds = new Set();

    for (const result of semanticResults) {
        const noteId = result.metadata?.noteId?.toString();

        if (!noteId || seenSemanticNoteIds.has(noteId)) {
            continue;
        }

        seenSemanticNoteIds.add(noteId);

        scores.set(noteId, 1 / (k + seenSemanticNoteIds.size));

        documents.set(noteId, {
            noteId,
            title: result.metadata.text?.slice(0, 100) || "Untitled",
            content: result.metadata.text || "",
            type: "semantic",
            metadata: result.metadata,
        });
    }

    // Process keyword results
    keywordResults.forEach((result, index) => {
        const noteId = result._id.toString();
        const rrfContribution = 1 / (k + index + 1);

        scores.set(
            noteId,
            (scores.get(noteId) || 0) + rrfContribution
        );

        documents.set(noteId, {
            ...documents.get(noteId),
            noteId,
            title: result.title,
            content: result.content,
            type: result.type,
        });
    });

    // Sort by combined RRF score
    return Array.from(scores.entries())
        .map(([noteId, rrfScore]) => ({
            ...documents.get(noteId),
            noteId,
            rrfScore,
        }))
        .sort((a, b) => b.rrfScore - a.rrfScore)
        .slice(0, limit);
}

module.exports = {
    hybridSearch,
};