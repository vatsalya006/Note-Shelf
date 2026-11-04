const mongoose = require("mongoose");

const aiUsageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        date: {
            type: String,
            required: true
        },

        feature: {
            type: String,
            enum: ["chat", "summary", "search", "embedding"],
            required: true
        },

        requestCount: {
            type: Number,
            default: 0
        },

        inputTokens: {
            type: Number,
            default: 0
        },

        outputTokens: {
            type: Number,
            default: 0
        },

        totalTokens: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

// One usage record per user, per day, per feature
aiUsageSchema.index(
    { user: 1, date: 1, feature: 1 },
    { unique: true }
);

module.exports = mongoose.model("AIUsage", aiUsageSchema);