const express = require("express");
const crypto = require("crypto");

const authMiddleware = require("../middleware/authMiddleware");
const Note = require("../models/Note");
const { fetchTranscript } = require("youtube-transcript");
const logger = require("../services/logger");

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

        // Convert transcript segments into plain text
        const content = transcript
            .map(item => item.text)
            .join(" ")
            .trim();

        // Generate a hash from the transcript content
        const contentHash = crypto
            .createHash("sha256")
            .update(content)
            .digest("hex");

        // Check whether this user already saved this transcript
        const existingNote = await Note.findOne({
            user: req.user,
            type: "youtube",
            contentHash
        });

        if (existingNote) {
            return res.status(200).json({
                message: "This YouTube transcript has already been saved",
                duplicate: true,
                note: existingNote
            });
        }

        const chunks = createYoutubeChunks(transcript);

        const note = await Note.create({
            title,
            content,
            contentHash,
            chunks,
            type: "youtube",
            youtubeUrl,
            user: req.user
        });

        return res.status(201).json({
            message: "YouTube video saved successfully",
            duplicate: false,
            note
        });

    } catch (error) {
        logger.error("YouTube transcript processing failed", {
    error: error.message,
    userId: req.user,
    youtubeUrl: req.body.youtubeUrl
});

        return res.status(500).json({
            message: "Failed to fetch YouTube transcript"
        });
    }
});

module.exports = router;