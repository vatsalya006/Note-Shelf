const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            default: ""
        },

        type: {
            type: String,
            enum: ["note", "pdf", "youtube"],
            default: "note"
        },

        fileName: {
            type: String,
            default: null
        },

        originalName: {
            type: String,
            default: null
        },

        filePath: {
            type: String,
            default: null
        },

        fileSize: {
            type: Number,
            default: null
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Note", noteSchema);