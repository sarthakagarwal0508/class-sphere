const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const studyMaterialRoutes = require("./routes/studyMaterialRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use(helmet());

app.use(cors({origin: process.env.FRONTEND_URL,}));

app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", studyMaterialRoutes);
app.use("/api", announcementRoutes);
app.use("/api", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "OK",
      service: "ClassSphere API",
    },
  });
});
module.exports = app;
