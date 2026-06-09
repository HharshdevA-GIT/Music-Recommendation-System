const express = require("express");
const Playlist = require("../models/Playlist");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Playlist
router.post("/", authMiddleware, async (req, res) => {
  try {
    const playlist = await Playlist.create({
      userId: req.user.id,
      name: req.body.name,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get All Playlists
router.get("/", authMiddleware, async (req, res) => {
  try {
    const playlists = await Playlist.find({
      userId: req.user.id,
    }).populate("songs");

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Add Song To Playlist
router.post("/:playlistId/:songId", authMiddleware, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    const songExists = playlist.songs.some(
      (song) => song.toString() === req.params.songId
    );

    if (!songExists) {
      playlist.songs.push(req.params.songId);
      await playlist.save();
    }

    res.status(200).json({
      message: "Song added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// REMOVE SONG FROM PLAYLIST
router.delete(
  "/:playlistId/song/:songId",
  authMiddleware,
  async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.playlistId);

      if (!playlist) {
        return res.status(404).json({
          message: "Playlist not found",
        });
      }

      playlist.songs = playlist.songs.filter(
        (song) => song.toString() !== req.params.songId
      );

      await playlist.save();

      res.status(200).json({
        message: "Song removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Delete Playlist
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Playlist deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;