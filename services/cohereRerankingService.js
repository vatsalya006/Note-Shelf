const { CohereClientV2 } = require("cohere-ai");

const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY,
});

async function cohereRerankResults(query, results, limit = 5) {
    if (!query || !results || results.length === 0) {
        return [];
    }

    try {
        const documents = results.map((result) => {
            return `Title: ${result.title || "Untitled"}\nContent: ${
                result.content || result.metadata?.text || ""
            }`;
        });

        const response = await cohere.rerank({
            model: "rerank-v3.5",
            query,
            documents,
            topN: Math.min(limit, results.length),
        });

        return response.results.map((item) => ({
            ...results[item.index],
            cohereRerankScore: item.relevanceScore,
        }));
    } catch (error) {
        console.error("Cohere reranking error:", error);
        throw new Error("Failed to rerank results with Cohere");
    }
}

module.exports = {
    cohereRerankResults,
};