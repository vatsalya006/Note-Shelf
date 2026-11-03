const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { PDFParse } = require("pdf-parse");
const logger = require("../services/logger");

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
        let parser;

        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please upload a PDF file",
                });
            }

            // Read and extract PDF text
            const pdfBuffer = fs.readFileSync(req.file.path);

            parser = new PDFParse({
                data: pdfBuffer
            });

            const pdfData = await parser.getText();
            const extractedText = pdfData.text.trim();

            if (!extractedText) {
                await parser.destroy();
                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    message: "No readable text found in this PDF",
                });
            }

            // Generate a hash from the extracted text
            const contentHash = crypto
                .createHash("sha256")
                .update(extractedText)
                .digest("hex");

            // Check whether this user already uploaded this PDF content
            const existingNote = await Note.findOne({
                user: req.user,
                type: "pdf",
                contentHash,
            });

            if (existingNote) {
                await parser.destroy();
                parser = null;

                // Remove the duplicate file that Multer just saved
                fs.unlinkSync(req.file.path);

                return res.status(200).json({
                    message: "This PDF has already been uploaded",
                    duplicate: true,
                    note: existingNote,
                });
            }

            // Split extracted text into paragraphs
            const paragraphs = splitIntoParagraphs(extractedText);

            // Generate paragraph embeddings for semantic chunking
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
                endTime: null,
            }));

            await parser.destroy();
            parser = null;

            // Save the PDF knowledge item, including its content hash
            const note = await Note.create({
                title: req.file.originalname,
                content: extractedText,
                contentHash,
                chunks,
                type: "pdf",

                fileName: req.file.filename,
                originalName: req.file.originalname,
                filePath: req.file.path,
                fileSize: req.file.size,

                user: req.user,
            });

            // Generate and store embeddings for each final chunk
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

            return res.status(201).json({
                message: "PDF uploaded successfully",
                duplicate: false,
                note,
            });

        } catch (error) {
            logger.error("PDF upload failed", {
    error: error.message,
    userId: req.user,
    fileName: req.file?.originalname
});

            if (parser) {
                try {
                    await parser.destroy();
                } catch (parserError) {
                    logger.error("PDF parser cleanup failed", {
    error: parserError.message,
    userId: req.user,
    fileName: req.file?.originalname
});
                }
            }

            return res.status(500).json({
                message: "Failed to upload PDF",
            });
        }
    }
);

module.exports = router;