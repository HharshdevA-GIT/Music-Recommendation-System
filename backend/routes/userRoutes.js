const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

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