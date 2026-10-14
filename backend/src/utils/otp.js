const crypto = require("crypto");

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

const generateOtp = () => {
  return crypto.randomInt(0, 1_000_000)
    .toString()
    .padStart(6, "0");
};

const hashOtp = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

module.exports = {
  generateOtp,
  hashOtp,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_OTP_ATTEMPTS,
};
