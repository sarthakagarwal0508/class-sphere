
const User = require("../models/User");

const {
  hashPassword,
} = require("../utils/password");

const {
  generateOtp,
  hashOtp,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
} = require("../utils/otp");

const {
  sendOtpEmail,
} = require("../services/emailService");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Validate basic input constraints
    if (name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 80 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 characters.",
      });
    }

    // 3. Check whether the email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // 4. Hash the password and generate OTP
    const hashedPassword = await hashPassword(password);
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const otpExpiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    const resendAvailableAt = new Date(
      Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000
    );

    // 5. Create an unverified user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      isEmailVerified: false,
      emailVerificationOtpHash: otpHash,
      emailVerificationOtpExpires: otpExpiresAt,
      emailVerificationAttempts: 0,
      otpResendAvailableAt: resendAvailableAt,
    });

    // 6. Send OTP email
    try {
      await sendOtpEmail(user.email, otp);
    } catch (emailError) {
      await User.deleteOne({ _id: user._id });

      console.error("Registration email failed:", emailError.message);

      return res.status(502).json({
        success: false,
        message: "Unable to send verification email. Please try again.",
      });
    }

    // 7. Respond without exposing password or OTP
    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email using the OTP sent to you.",
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    // Handle concurrent duplicate registration attempts
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  register,
};
