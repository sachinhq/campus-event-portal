const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const SECRET = "campusbuzz_secret"; // for minor project

// SIGNUP
router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        res.json({ message: "Signup successful" });
    } catch (err) {
        res.status(400).json({ message: "User already exists" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({
        token,
        role: user.role,
        name: user.name
    });
});

module.exports = router;
