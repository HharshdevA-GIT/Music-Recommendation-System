const express = require("express");
const User = require("../models/User");
const Song = require("../models/Song");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Personalized Recommendations
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let songs = await Song.find({
      $or: [
        {
          genre: {
            $in: user.favoriteGenres || [],
          },
        },
        {
          artist: {
            $in: user.favoriteArtists || [],
          },
        },
      ],
    });

    // Agar koi recommendation na mile
    if (songs.length === 0) {
      songs = await Song.find().limit(12);
    }

    res.status(200).json(songs);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;