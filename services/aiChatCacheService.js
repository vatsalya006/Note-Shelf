const chatCache = new Map();

const MAX_CHAT_CACHE_SIZE = 1000;
const CHAT_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function createChatCacheKey(userId, question, sources) {
    const normalizedQuestion = question.trim().toLowerCase();

    const sourceContext = sources
        .map(source => `${source.noteId}:${source.content}`)
        .join("|");

    return `${userId}:${normalizedQuestion}:${sourceContext}`;
}

function getCachedChat(userId, question, sources) {
    const key = createChatCacheKey(userId, question, sources);
    const cached = chatCache.get(key);

    if (!cached) {
        return null;
    }

    // Remove expired entries
    if (Date.now() > cached.expiresAt) {
        chatCache.delete(key);
        return null;
    }

    return cached.answer;
}

function cacheChat(userId, question, sources, answer) {
    const key = createChatCacheKey(userId, question, sources);

    // Remove the oldest entry if cache is full
    if (
        chatCache.size >= MAX_CHAT_CACHE_SIZE &&
        !chatCache.has(key)
    ) {
        const oldestKey = chatCache.keys().next().value;
        chatCache.delete(oldestKey);
    }

    chatCache.set(key, {
        answer,
        expiresAt: Date.now() + CHAT_CACHE_TTL
    });
}

function cleanupExpiredChats() {
    const now = Date.now();

    for (const [key, cached] of chatCache.entries()) {
        if (now > cached.expiresAt) {
            chatCache.delete(key);
        }
    }
}

// Clean expired chat entries every 5 minutes
setInterval(cleanupExpiredChats, 5 * 60 * 1000);


module.exports = {
    getCachedChat,
    cacheChat
};