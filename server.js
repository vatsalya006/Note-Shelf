require("dotenv").config();

// ---- Startup checks: fail early with a clear message instead of a cryptic crash ----
const REQUIRED_ENV = [
    "MONGO_URI",
    "JWT_SECRET",
    "GEMINI_API_KEY",
    "GROQ_API_KEY",
    "PINECONE_API_KEY",
    "PINECONE_INDEX_NAME",
    "COHERE_API_KEY",
];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
    console.error("\n[Note Shelf] Cannot start: missing values in your .env file:");
    missingEnv.forEach((name) => console.error("   - " + name));
    console.error("\nCreate a file named .env in the project root (next to server.js).");
    console.error("Copy .env.example to .env and fill in the values.\n");
    process.exit(1);
}

// multer needs this folder to exist (it is git-ignored, so a fresh copy won't have it)
require("fs").mkdirSync("uploads", { recursive: true });

const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const noteRoutes = require("./routes/noteRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const logger = require("./services/logger");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const graphRoutes = require("./routes/graphRoutes");

app.use(cors({
    // allow the Vite dev server on any local port (5173, 5174, ...)
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/graph", graphRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/upload/pdf", pdfRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        userId: req.user
    });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

app.get("/", (req, res) => {
    res.json({
    message: "AI Second Brain Backend is running!"
    });
});
app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working!"
    });
});
app.post("/api/test", (req, res) => {
    console.log(req.body);

    res.json({
        message: "Data received successfully",
        data: req.body
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info("Note Shelf backend started", {
        port: PORT,
        environment: process.env.NODE_ENV || "development"
    });
});