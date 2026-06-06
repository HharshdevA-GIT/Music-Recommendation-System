const express = require("express");
const Recommendation = require("../models/Recommendation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add Recommendation
router.post("/", authMiddleware, async (req, res) => {
  try {
    const recommendation = await Recommendation.create(req.body);

    res.status(201).json(recommendation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Personalized Recommendations
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const songs = await Song.find({
      genre: {
        $in: user.favoriteGenres,
      },
    });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;