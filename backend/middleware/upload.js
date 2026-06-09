const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("image")) {
      return {
        folder: "music-covers",
        resource_type: "image",
      };
    }

    return {
      folder: "music-audio",
      resource_type: "video",
    };
  },
});

module.exports = multer({ storage });