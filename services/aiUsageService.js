const AIUsage = require("../models/AIUsage");

const DAILY_LIMITS = {
    chat: 10,
    summary: 10,
    search: 20,
    embedding: 100
};

// Use India time so daily limits reset at midnight IST.
function getTodayDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

async function getDailyUsage(userId, feature) {
    const usage = await AIUsage.findOne({
        user: userId,
        date: getTodayDate(),
        feature
    });

    return usage?.requestCount || 0;
}

// Atomically increments usage only if the user is still below the limit.
async function checkAndRecordUsage(userId, feature) {
    const limit = DAILY_LIMITS[feature];

    if (!limit) {
        throw new Error(`Unknown AI feature: ${feature}`);
    }

    const date = getTodayDate();

    try {
        const usage = await AIUsage.findOneAndUpdate(
            {
                user: userId,
                date,
                feature,
                requestCount: { $lt: limit }
            },
            {
                $inc: { requestCount: 1 }
            },
            {
                new: true
            }
        );

        if (usage) {
            return {
                allowed: true,
                currentUsage: usage.requestCount,
                limit,
                remaining: Math.max(0, limit - usage.requestCount)
            };
        }

        // No matching record may mean either the limit was reached
        // or this is the user's first request today.
        const existingUsage = await AIUsage.findOne({
            user: userId,
            date,
            feature
        });

        if (existingUsage) {
            return {
                allowed: false,
                currentUsage: existingUsage.requestCount,
                limit,
                remaining: 0
            };
        }

        // First request: create the daily usage record.
        const createdUsage = await AIUsage.findOneAndUpdate(
            {
                user: userId,
                date,
                feature,
                requestCount: { $exists: false }
            },
            {
                $set: { requestCount: 1 }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        return {
            allowed: true,
            currentUsage: createdUsage.requestCount,
            limit,
            remaining: Math.max(0, limit - createdUsage.requestCount)
        };
    } catch (error) {
        // Concurrent first requests can race to create the unique record.
        if (error.code === 11000) {
            return checkAndRecordUsage(userId, feature);
        }

        throw error;
    }
}

module.exports = {
    DAILY_LIMITS,
    getDailyUsage,
    checkAndRecordUsage
};