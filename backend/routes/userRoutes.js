const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!!!" });
    }

    const user = await User.create({ name, email, password });

    const payload = {
      user: { id: user._id, role: user.role },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid Credentials!" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials!" });

    const payload = {
      user: { id: user._id, role: user.role },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ================= PROFILE ================= */
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
