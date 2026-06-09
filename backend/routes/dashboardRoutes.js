const express = require("express");
const Favorite = require("../models/Favorite");
const Playlist = require("../models/Playlist");
const RecentlyPlayed = require("../models/RecentlyPlayed");
const Song = require("../models/Song");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const favorites = await Favorite.countDocuments({
      userId: req.user.id,
    });

    const playlists = await Playlist.countDocuments({
      userId: req.user.id,
    });

    const recentlyPlayed = await RecentlyPlayed.countDocuments({
      userId: req.user.id,
    });

    const totalSongs = await Song.countDocuments();

    res.status(200).json({
      favorites,
      playlists,
      recentlyPlayed,
      totalSongs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;