const { generateAIResponse } = require("./geminiService");

async function rerankResults(query, results, limit = 5) {
    if (!query || !results || results.length === 0) {
        return [];
    }

    const candidates = results.map((result, index) => ({
        index,
        title: result.title || "Untitled",
        content: result.content || result.metadata?.text || "",
    }));

    const prompt = `
You are a search result reranking system.

User query:
${query}

Evaluate the relevance of each result to the user's query.
Assign a relevance score from 1 to 10.

Rules:
- Score based on relevance to the query, not keyword overlap alone.
- Return every result exactly once.
- Do not invent or modify result IDs.
- Return ONLY valid JSON in this format:
{
  "results": [
    { "index": 0, "score": 9 },
    { "index": 1, "score": 4 }
  ]
}

Search results:
${JSON.stringify(candidates)}
`;

    try {
        const response = await generateAIResponse(prompt);

        const cleanedResponse = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsedResponse = JSON.parse(cleanedResponse);

        if (!Array.isArray(parsedResponse.results)) {
            throw new Error("Invalid reranking response format");
        }

        const scoreMap = new Map();

        for (const item of parsedResponse.results) {
            if (
                Number.isInteger(item.index) &&
                item.index >= 0 &&
                item.index < results.length &&
                Number.isFinite(item.score)
            ) {
                scoreMap.set(
                    item.index,
                    Math.max(1, Math.min(10, item.score))
                );
            }
        }

        return results
            .map((result, index) => ({
                ...result,
                rerankScore: scoreMap.get(index) ?? 0,
            }))
            .sort((a, b) => b.rerankScore - a.rerankScore)
            .slice(0, limit);
    } catch (error) {
        console.error("Reranking error:", error);
        throw new Error("Failed to rerank search results");
    }
}

module.exports = {
    rerankResults,
};