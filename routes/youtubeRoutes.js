const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Note = require("../models/Note");
const { fetchTranscript } = require("youtube-transcript");
const {
    createYoutubeChunks
} = require("../services/chunkingService");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, youtubeUrl } = req.body;

        if (!title || !youtubeUrl) {
            return res.status(400).json({
                message: "Title and YouTube URL are required"
            });
        }

        const transcript = await fetchTranscript(youtubeUrl);

        if (!transcript || transcript.length === 0) {
            return res.status(400).json({
                message: "No transcript available for this video"
            });
        }

        const chunks = createYoutubeChunks(transcript);

        // Convert transcript segments into plain text
        const content = transcript
            .map(item => item.text)
            .join(" ");

        const note = await Note.create({
            title,
            content,
            chunks,
            type: "youtube",
            youtubeUrl,
            user: req.user
        });

        res.status(201).json({
            message: "YouTube video saved successfully",
            note
        });

    } catch (error) {
        console.error("YouTube transcript error:", error);

        res.status(500).json({
            message: "Failed to fetch YouTube transcript"
        });
    }
});

module.exports = router;