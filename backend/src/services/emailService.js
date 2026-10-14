const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Gmail SMTP connection successful!");
  } catch (error) {
    console.error("Gmail SMTP connection failed:", error.message);
    throw error;
  }
};


const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"ClassSphere" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your ClassSphere account",
    text: `Your ClassSphere verification OTP is ${otp}. It expires in 10 minutes. Do not share this OTP with anyone.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to ClassSphere!</h2>
        <p>Use the following OTP to verify your email address:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  transporter,
  verifyEmailConnection,
  sendOtpEmail,
};


module.exports = {
  transporter,
  verifyEmailConnection,
  sendOtpEmail,
};

