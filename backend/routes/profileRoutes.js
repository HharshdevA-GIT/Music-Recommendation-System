const express = require("express");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const Playlist = require("../models/Playlist");
const RecentlyPlayed = require("../models/RecentlyPlayed");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get User Profile
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken -resetPasswordToken -verificationToken"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const favorites = await Favorite.countDocuments({
      userId: req.user.id,
    });

    const playlists = await Playlist.countDocuments({
      userId: req.user.id,
    });

    const recentlyPlayed = await RecentlyPlayed.countDocuments({
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      user,
      stats: {
        favorites,
        playlists,
        recentlyPlayed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;