const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Song = require("./models/Song");
const songs = require("./data/songs.json");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await Song.deleteMany();

    await Song.insertMany(songs);

    console.log("Songs Imported Successfully ✅");

    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });