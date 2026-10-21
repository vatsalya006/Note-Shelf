const { generateEmbedding } = require("./geminiService");
const { searchSimilar } = require("./pineconeService");
const { keywordSearch } = require("./keywordSearchService");
const {
    cohereRerankResults,
} = require("./cohereRerankingService");

async function hybridSearch(query, userId, limit = 10) {
    if (!query || !query.trim()) {
        return [];
    }

    const k = 60;

    // Generate the query embedding
    const queryVector = await generateEmbedding(query);

    // Run semantic and keyword searches in parallel
    const [semanticResults, keywordResults] = await Promise.all([
        searchSimilar(queryVector, userId, 20),
        keywordSearch(query, userId, 20),
    ]);

    const scores = new Map();
    const documents = new Map();

    // Deduplicate semantic results by noteId
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

    // Add keyword-search rankings using Reciprocal Rank Fusion
    keywordResults.forEach((result, index) => {
        const noteId = result._id.toString();
        const contribution = 1 / (k + index + 1);

        scores.set(
            noteId,
            (scores.get(noteId) || 0) + contribution
        );

        documents.set(noteId, {
            ...documents.get(noteId),
            noteId,
            title: result.title,
            content: result.content,
            type: result.type,
        });
    });

    // Fuse rankings and select candidates for reranking
    const fusedResults = Array.from(scores.entries())
        .map(([noteId, rrfScore]) => ({
            ...documents.get(noteId),
            noteId,
            rrfScore,
        }))
        .sort((a, b) => b.rrfScore - a.rrfScore)
        .slice(0, 20);

    // Rerank using Cohere
    const rerankedResults = await cohereRerankResults(
        query,
        fusedResults,
        limit
    );

    return rerankedResults;
}

module.exports = {
    hybridSearch,
};