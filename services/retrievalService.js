const { hybridSearch } = require("./hybridSearchService");

async function retrieveRelevantNotes(query, userId, limit = 5) {
    if (!query || !query.trim()) {
        return [];
    }

    const results = await hybridSearch(
        query.trim(),
        userId,
        limit
    );

    return results.map((result) => ({
        noteId: result.noteId,
        title: result.title || "Untitled",
        content: result.content || result.metadata?.text || "",
        score: result.cohereRerankScore ?? result.rrfScore ?? 0
    }));
}

module.exports = {
    retrieveRelevantNotes
};