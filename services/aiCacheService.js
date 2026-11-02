const summaryCache = new Map();

const MAX_SUMMARY_CACHE_SIZE = 200;

function getSummaryCacheKey(userId, noteId, contentHash) {
    return `${userId}:${noteId}:${contentHash}`;
}

function getCachedSummary(userId, noteId, contentHash) {
    const key = getSummaryCacheKey(userId, noteId, contentHash);

    return summaryCache.get(key) || null;
}

function cacheSummary(userId, noteId, contentHash, summary) {
    const key = getSummaryCacheKey(userId, noteId, contentHash);

    // Keep the cache size bounded
    if (
        summaryCache.size >= MAX_SUMMARY_CACHE_SIZE &&
        !summaryCache.has(key)
    ) {
        const oldestKey = summaryCache.keys().next().value;
        summaryCache.delete(oldestKey);
    }

    summaryCache.set(key, summary);
}

module.exports = {
    getCachedSummary,
    cacheSummary
};