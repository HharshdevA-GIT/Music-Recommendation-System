const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      required: true,
      trim: true,
    },

    album: {
      type: String,
      default: "",
      trim: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    playCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

songSchema.index(
  { title: 1, artist: 1 },
  { unique: true }
);

module.exports = mongoose.model("Song", songSchema);