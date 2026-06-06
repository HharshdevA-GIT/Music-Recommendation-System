const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Check JWT_SECRET
console.log("JWT_SECRET =", process.env.JWT_SECRET);
console.log("MONGO_URI =", process.env.MONGO_URI);

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Music Recommendation API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});