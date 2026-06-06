const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Recommendation",
  recommendationSchema
);