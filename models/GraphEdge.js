const mongoose = require("mongoose");

const graphEdgeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
            required: true,
        },

        target: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
            required: true,
        },

        similarity: {
            type: Number,
            required: true,
        },

        relationship: {
            type: String,
            enum: [
                "builds-on",
                "contradicts",
                "same-topic",
                "references",
            ],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

graphEdgeSchema.index(
    { user: 1, source: 1, target: 1 },
    { unique: true }
);

module.exports = mongoose.model("GraphEdge", graphEdgeSchema);