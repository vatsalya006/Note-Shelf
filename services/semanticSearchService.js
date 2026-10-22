const { generateEmbedding } = require("./geminiService");
const { searchSimilar } = require("./pineconeService");

async function semanticSearch(query, userId, limit = 5) {
if (!query || !query.trim()) {
return [];
}

// Generate an embedding for the query
const queryVector = await generateEmbedding(query.trim());

// Retrieve semantically similar chunks from Pinecone
const results = await searchSimilar(queryVector, userId, 20);

// Keep only the highest-ranked chunk for each note
const seenNoteIds = new Set();
const uniqueResults = [];

for (const result of results) {
    const noteId = result.metadata?.noteId?.toString();

    if (!noteId || seenNoteIds.has(noteId)) {
        continue;
    }

    seenNoteIds.add(noteId);

    uniqueResults.push({
        noteId,
        title: result.metadata.text?.slice(0, 100) || "Untitled",
        content: result.metadata.text || "",
        score: result.score ?? 0,
    });

    if (uniqueResults.length === limit) {
        break;
    }
}

return uniqueResults;

}

module.exports = {
semanticSearch,
};
