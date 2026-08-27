require("dotenv").config();

const User = require("./models/User");
const Note = require("./models/Note");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const noteRoutes = require("./routes/noteRoutes");

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const hashedPassword = bcrypt.hashSync("mypassword123", 10);

console.log("Hashed password:", hashedPassword);

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

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
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/api/users", async (req, res) => {
    const users = await User.find();

    res.json(users);
});

app.get("/api/test-user", async (req, res) => {
    const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "test123"
    });

    res.json(user);
});

app.get("/api/user", async (req, res) => {
    const user = await User.findOne({
        email: "test@example.com"
    });

    res.json(user);
});

app.get("/api/update-user", async (req, res) => {
    const user = await User.findOneAndUpdate(
        { email: "test@example.com" },
        { name: "Updated User" },
        { new: true }
    );

    res.json(user);
});

app.get("/api/delete-user", async (req, res) => {
    const user = await User.findOneAndDelete({
        email: "test@example.com"
    });

    res.json({
        message: "User deleted",
        user: user
    });
});