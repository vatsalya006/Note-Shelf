const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }
    res.json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

module.exports = router;