const express = require("express");
const Note = require("../models/Note");
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");
const logger = require("../services/logger");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const note = await Note.create({
            title,
            content,
            user: req.user
        });

        res.status(201).json({
            message: "Note created successfully",
            note
        });
    } catch (error) {
    logger.error("Note creation failed", {
        error: error.message,
        userId: req.user
    });

    res.status(500).json({
        message: "Failed to create note"
    });
}
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user });

        res.json({
            notes
        });
    } catch (error) {
    logger.error("Fetching notes failed", {
        error: error.message,
        userId: req.user
    });

    res.status(500).json({
        message: "Failed to fetch notes"
    });
}
});
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json({
            note
        });
    } catch (error) {
    logger.error("Fetching note by ID failed", {
        error: error.message,
        userId: req.user,
        noteId: req.params.id
    });

    res.status(500).json({
        message: "Failed to fetch note"
    });
}
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const contentHash = crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");

const note = await Note.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.user
    },
    {
        title,
        content,
        contentHash
    },
    {
        new: true
    }
);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json({
            message: "Note updated successfully",
            note
        });
    } catch (error) {
    logger.error("Note update failed", {
        error: error.message,
        userId: req.user,
        noteId: req.params.id
    });

    res.status(500).json({
        message: "Failed to update note"
    });
}
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json({
            message: "Note deleted successfully"
        });
    } catch (error) {
    logger.error("Note deletion failed", {
        error: error.message,
        userId: req.user,
        noteId: req.params.id
    });

    res.status(500).json({
        message: "Failed to delete note"
    });
}
});

module.exports = router;