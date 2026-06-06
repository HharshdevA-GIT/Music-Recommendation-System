const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Trying to connect to MongoDB...");

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected URI:", process.env.MONGO_URI);
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
