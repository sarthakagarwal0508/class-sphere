const sendOtpEmail = async (email, otp) => {
  const apiKey = process.env.SENDLIBERTY_API_KEY;
  const senderEmail = process.env.SENDLIBERTY_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("SENDLIBERTY_API_KEY is missing in .env");
  }

  if (!senderEmail) {
    throw new Error("SENDLIBERTY_FROM_EMAIL is missing in .env");
  }

  try {
    const response = await fetch(
      "https://sendliberty.com/api/send",
      {
        method: "POST",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `ClassSphere <${senderEmail}>`,
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
        }),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Sendliberty API error:", result);

      throw new Error(
        result.message || `Email API failed with status ${response.status}`
      );
    }

    console.log("OTP email accepted by Sendliberty:", result);
    return result;
  } catch (error) {
    console.error("OTP email sending failed:", error.message);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
};