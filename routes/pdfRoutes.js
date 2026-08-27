const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const Note = require("../models/Note");

const router = express.Router();

// =========================
// MULTER STORAGE
// =========================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

// =========================
// PDF FILE FILTER
// =========================

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

// =========================
// MULTER CONFIG
// =========================

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

// =========================
// UPLOAD PDF
// =========================

router.post(
    "/",
    authMiddleware,
    upload.single("pdf"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload a PDF file",
                });
            }

            // Create a PDF knowledge item
            const note = await Note.create({
                title: req.file.originalname,
                content: "",
                type: "pdf",

                fileName: req.file.filename,
                originalName: req.file.originalname,
                filePath: req.file.path,
                fileSize: req.file.size,

                user: req.user,
            });

            res.status(201).json({
                message: "PDF uploaded successfully",

                note,
            });
        } catch (error) {
            console.error("PDF upload error:", error);

            res.status(500).json({
                message: "Failed to upload PDF",
            });
        }
    }
);

module.exports = router;