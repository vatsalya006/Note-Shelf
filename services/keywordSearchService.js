const Note = require("../models/Note");

async function keywordSearch(query, userId, limit = 10) {
    if (!query || !query.trim()) {
        return [];
    }

    const results = await Note.find(
        {
            user: userId,
            $text: {
                $search: query,
            },
        },
        {
            score: {
                $meta: "textScore",
            },
        }
    )
        .sort({
            score: {
                $meta: "textScore",
            },
        })
        .limit(limit)
        .select("title content chunks type createdAt score");

    return results;
}

module.exports = {
    keywordSearch,
};