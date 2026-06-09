const express = require("express");
const Song = require("../models/Song");
const Favorite = require("../models/Favorite");
const upload = require("../middleware/upload");

const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Add Song (Admin Only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {

      console.log(req.body);   // ✅ YAHAN

      const coverImage =
        req.files?.coverImage?.[0]?.path || "";

      const audioUrl =
        req.files?.audioFile?.[0]?.path || "";

      const song = await Song.create({
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        album: req.body.album,
        coverImage,
        audioUrl,
      });

      res.status(201).json(song);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
  
      

// Get All Songs + Pagination + Sorting
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const totalSongs = await Song.countDocuments();

    const songs = await Song.find()
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      totalSongs,
      currentPage: page,
      totalPages: Math.ceil(totalSongs / limit),
      songs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Search Songs
router.get("/search/:keyword", async (req, res) => {
  try {
    const songs = await Song.find({
      $or: [
        {
          title: {
            $regex: req.params.keyword,
            $options: "i",
          },
        },
        {
          artist: {
            $regex: req.params.keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Genre Filter
router.get("/genre/:genre", async (req, res) => {
  try {
    const songs = await Song.find({
      genre: req.params.genre,
    });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Song Details API
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    const relatedSongs = await Song.find({
      genre: song.genre,
      _id: { $ne: song._id },
    }).limit(5);

    const likes = await Favorite.countDocuments({
      songId: song._id,
    });

    res.status(200).json({
      song,
      likes,
      relatedSongs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Increase Play Count
router.put("/play/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          playCount: 1,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Bulk Insert Songs (Admin Only)
router.post(
  "/bulk",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const songs = await Song.insertMany(req.body);

      res.status(201).json(songs);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// Delete Song (Admin Only)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Song.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Song Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;