require("dotenv").config();

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
    origin: "http://localhost:5173",
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