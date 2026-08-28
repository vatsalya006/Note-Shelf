const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, youtubeUrl } = req.body;

        if (!title || !youtubeUrl) {
            return res.status(400).json({
                message: "Title and YouTube URL are required"
            });
        }

        const note = await Note.create({
            title,
            content: "",
            type: "youtube",
            youtubeUrl,
            user: req.user
        });

        res.status(201).json({
            message: "YouTube video saved successfully",
            note
        });

    } catch (error) {
        console.error("YouTube save error:", error);

        res.status(500).json({
            message: "Failed to save YouTube video"
        });
    }
});

module.exports = router;