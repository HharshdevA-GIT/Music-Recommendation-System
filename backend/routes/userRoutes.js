const express = require("express");
console.log("userRoutes loaded");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");
const loginLimiter = require("../middleware/rateLimiter");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, favoriteGenres, favoriteArtists } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      favoriteGenres,
      favoriteArtists,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update Preferences
router.put("/preferences", authMiddleware, async (req, res) => {
  try {
    const { favoriteGenres, favoriteArtists } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        favoriteGenres,
        favoriteArtists,
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;