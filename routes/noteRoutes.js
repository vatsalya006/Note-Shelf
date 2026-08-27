const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

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
        console.error("Failed to fetch note:", error);

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

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user
            },
            {
                title,
                content
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
        res.status(500).json({
            message: "Failed to delete note"
        });
    }
});

module.exports = router;