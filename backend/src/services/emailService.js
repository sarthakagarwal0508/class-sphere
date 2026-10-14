const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const verifyEmailConnection = async () => {
  await transporter.verify();
  console.log("Gmail SMTP connection successful!");
};

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"ClassSphere" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your ClassSphere account",
    text: `Your ClassSphere OTP is ${otp}. It expires in 10 minutes. Do not share it with anyone.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to ClassSphere!</h2>
        <p>Use this OTP to verify your email address:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
        <p>Never share your OTP with anyone.</p>
      </div>
    `,
  });
};

module.exports = {
  transporter,
  verifyEmailConnection,
  sendOtpEmail,
};
