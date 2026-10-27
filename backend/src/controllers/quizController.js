
const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Classroom = require("../models/Classroom");

// Save an AI-generated quiz to MongoDB.
const saveQuiz = async (req, res) => {
  try {
    const {
      title,
      classroomId,
      topic,
      questions,
      difficulty = "mixed",
      source = "topic",
      status = "draft",
      totalMarks,
    } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must contain at least 3 characters.",
      });
    }

    if (!mongoose.isValidObjectId(classroomId)) {
      return res.status(400).json({
        success: false,
        message: "A valid classroomId is required.",
      });
    }

    if (
      !Array.isArray(questions) ||
      questions.length < 1 ||
      questions.length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Questions must contain between 1 and 20 items.",
      });
    }

    if (!["easy", "medium", "hard", "mixed"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty.",
      });
    }

    if (!["topic", "study_material", "pdf", "mixed"].includes(source)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz source.",
      });
    }

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be draft or published.",
      });
    }

    const classroom = await Classroom.findOne({
      _id: classroomId,
      teacher: req.user._id,
    });

    if (!classroom) {
      return res.status(403).json({
        success: false,
        message: "You can save quizzes only in your own classroom.",
      });
    }

    const marks = totalMarks === undefined ? questions.length : Number(totalMarks);

    if (!Number.isFinite(marks) || marks <= 0) {
      return res.status(400).json({
        success: false,
        message: "totalMarks must be greater than 0.",
      });
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      topic: typeof topic === "string" ? topic.trim() : "",
      classroom: classroom._id,
      teacher: req.user._id,
      questions,
      difficulty,
      source,
      status,
      totalMarks: marks,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz saved successfully.",
      data: {
        quiz,
      },
    });
  } catch (error) {
    console.error("Save quiz error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save quiz.",
    });
  }
};

// List quizzes belonging to a classroom owned by this teacher.
const getTeacherQuizzes = async (req, res) => {
  try {
    const { classroomId } = req.params;

    if (!mongoose.isValidObjectId(classroomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    const classroom = await Classroom.findOne({
      _id: classroomId,
      teacher: req.user._id,
    }).select("_id");

    if (!classroom) {
      return res.status(403).json({
        success: false,
        message: "You can view quizzes only in your own classroom.",
      });
    }

    const quizzes = await Quiz.find({
      classroom: classroom._id,
      teacher: req.user._id,
    })
      .select("-questions")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error("Get teacher quizzes error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes.",
    });
  }
};

module.exports = {
  saveQuiz,
  getTeacherQuizzes,
};
