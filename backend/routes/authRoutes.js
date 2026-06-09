const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("../config/email");
const User = require("../models/User");

const {
  authMiddleware,
  adminMiddleware,
  userMiddleware,
} = require("../middleware/authMiddleware");

const loginLimiter = require("../middleware/rateLimiter");

const router = express.Router();



// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      favoriteGenres,
      favoriteArtists,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",

      isVerified: false,
      verificationToken,
      verificationTokenExpire:
        Date.now() + 24 * 60 * 60 * 1000,

      favoriteGenres: favoriteGenres || [],
      favoriteArtists: favoriteArtists || [],
      refreshToken: null,
    });

    const verifyUrl =
      `http://localhost:5173/verify-email/${verificationToken}`;

    await nodemailer.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyUrl}">
          Verify Email
        </a>
      `,
    });

    res.status(201).json({
      message:
        "Registration successful. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// VERIFY EMAIL
router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;

    await user.save();

    res.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// RESEND VERIFICATION EMAIL
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    user.verificationToken = verificationToken;
    user.verificationTokenExpire =
      Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const verifyUrl =
      `http://localhost:5173/verify-email/${verificationToken}`;

    await nodemailer.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click below to verify your account:</p>
        <a href="${verifyUrl}">
          Verify Email
        </a>
      `,
    });

    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// LOGIN
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken =
      crypto.randomBytes(64).toString("hex");

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// UPDATE PREFERENCES
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



// REFRESH TOKEN
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const user = await User.findOne({
      refreshToken,
    });

    if (!user) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Token refreshed",
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `http://localhost:5173/reset-password/${resetToken}`;

    await nodemailer.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// LOGOUT
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      );
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



// USER DASHBOARD
router.get(
  "/user-dashboard",
  authMiddleware,
  userMiddleware,
  async (req, res) => {
    res.json({
      message: "Welcome User Dashboard",
      user: req.user,
    });
  }
);



// ADMIN DASHBOARD
router.get(
  "/admin-dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    res.json({
      message: "Welcome Admin Dashboard",
      user: req.user,
    });
  }
);

module.exports = router;