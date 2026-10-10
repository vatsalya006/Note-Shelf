const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const authMiddleware = require("../middleware/authMiddleware");
const Note = require("../models/Note");
const {
    splitIntoParagraphs,
    createPdfAwareChunks
} = require("../services/chunkingService");

const {
    storeChunkEmbedding
} = require("../services/pineconeService");

const {
    generateEmbedding
} = require("../services/geminiService");

const router = express.Router();

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

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

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
            const pdfBuffer = fs.readFileSync(req.file.path);
            const parser = new PDFParse({ data: pdfBuffer });
            const pdfData = await parser.getText();

            const extractedText = pdfData.text.trim();
            const paragraphs = splitIntoParagraphs(extractedText);

            // Generate embedding for every paragraph
            const paragraphEmbeddings = await Promise.all(
                paragraphs.map(paragraph => generateEmbedding(paragraph))
            );

            // Create semantic PDF chunks
            const chunks = createPdfAwareChunks(
                paragraphs,
                paragraphEmbeddings
            ).map(chunk => ({
                text: chunk,
                startTime: null,
                endTime: null
            }));
            await parser.destroy();

            // Create a PDF knowledge item
            const note = await Note.create({
                title: req.file.originalname,
                content: extractedText,
                chunks,
                type: "pdf",

                fileName: req.file.filename,
                originalName: req.file.originalname,
                filePath: req.file.path,
                fileSize: req.file.size,

                user: req.user,
            });

            for (let i = 0; i < chunks.length; i++) {
                const chunkVector = await generateEmbedding(chunks[i].text);

                await storeChunkEmbedding(
                note._id,
                req.user,
                i,
                chunkVector,
                chunks[i]
               );
            }

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