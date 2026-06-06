const express = require("express");
const Song = require("../models/Song");

const router = express.Router();

// Add Song
router.post("/", async (req, res) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get All Songs
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;