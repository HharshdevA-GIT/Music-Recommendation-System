const express = require("express");
const Favorite = require("../models/Favorite");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Add Favorite
router.post("/:songId", authMiddleware, async (req, res) => {
  try {
    // Check duplicate
    const existingFavorite = await Favorite.findOne({
      userId: req.user.id,
      songId: req.params.songId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "Song already in favorites",
      });
    }

    const favorite = await Favorite.create({
      userId: req.user.id,
      songId: req.params.songId,
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Favorites
router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.find({
      userId: req.user.id,
    }).populate("songId");

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Remove Favorite
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;