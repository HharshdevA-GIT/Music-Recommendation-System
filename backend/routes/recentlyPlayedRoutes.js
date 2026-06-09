const express = require("express");
const RecentlyPlayed = require("../models/RecentlyPlayed");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Add Recently Played Song
router.post("/:songId", authMiddleware, async (req, res) => {
  try {
    const recent = await RecentlyPlayed.create({
      userId: req.user.id,
      songId: req.params.songId,
    });

    res.status(201).json(recent);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Recently Played Songs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const songs = await RecentlyPlayed.find({
      userId: req.user.id,
    })
      .populate("songId")
      .sort({ createdAt: -1 });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;