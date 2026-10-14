const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { hashValue } = require("../utils/otp");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createAccessToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), jti: crypto.randomUUID(), type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );

const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "Google ID token is required." });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ success: false, message: "Google authentication is not configured." });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google ID token.",
      });
    }

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({ success: false, message: "Google account could not be verified." });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email }] }).select("+googleId");

    if (user) {
      if (user.email.toLowerCase() !== email) {
        return res.status(409).json({ success: false, message: "This Google account is linked to a different email." });
      }
      if (user.googleId && user.googleId !== payload.sub) {
        return res.status(409).json({ success: false, message: "This email is linked to another Google account." });
      }
      if (!user.googleId) user.googleId = payload.sub;
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        isEmailVerified: true,
      });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshTokenHash = hashValue(refreshToken);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = { googleAuth };
