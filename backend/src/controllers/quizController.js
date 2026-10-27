
const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Classroom = require("../models/Classroom");
const QuizAttempt = require("../models/QuizAttempt");

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


const getStudentQuizzes = async (req, res) => {
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
      students: req.user._id,
    }).select("_id");

    if (!classroom) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this classroom.",
      });
    }

    const quizzes = await Quiz.find({
      classroom: classroom._id,
      status: "published",
    }).sort({ createdAt: -1 });

    const safeQuizzes = quizzes.map((quiz) => {
      const data = quiz.toObject();

      data.questions = data.questions.map((question) => {
        const {
          correctAnswer,
          correct_answer,
          answer,
          correctOption,
          correct_option,
          ...safeQuestion
        } = question;

        return safeQuestion;
      });

      return data;
    });

    return res.status(200).json({
      success: true,
      count: safeQuizzes.length,
      data: safeQuizzes,
    });
  } catch (error) {
    console.error("Get student quizzes error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes.",
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID.",
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Submit at least one answer.",
      });
    }

    const quiz = await Quiz.findOne({
      _id: quizId,
      status: "published",
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Published quiz not found.",
      });
    }

    const classroom = await Classroom.findOne({
      _id: quiz.classroom,
      students: req.user._id,
    }).select("_id");

    if (!classroom) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this classroom.",
      });
    }

    const existingAttempt = await QuizAttempt.findOne({
      quiz: quiz._id,
      student: req.user._id,
    });

    if (existingAttempt) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this quiz.",
      });
    }

    const seen = new Set();

    for (const answer of answers) {
      if (
        !Number.isInteger(answer.questionIndex) ||
        answer.questionIndex < 0 ||
        answer.questionIndex >= quiz.questions.length ||
        typeof answer.selectedAnswer !== "string" ||
        !answer.selectedAnswer.trim() ||
        seen.has(answer.questionIndex)
      ) {
        return res.status(400).json({
          success: false,
          message: "Answers contain an invalid or duplicate question index.",
        });
      }

      seen.add(answer.questionIndex);
    }

    let correctCount = 0;

    for (const answer of answers) {
      const question = quiz.questions[answer.questionIndex].toObject
        ? quiz.questions[answer.questionIndex].toObject()
        : quiz.questions[answer.questionIndex];

      const correctAnswer =
        question.correctAnswer ??
        question.correct_answer ??
        question.answer ??
        question.correctOption ??
        question.correct_option;

      if (correctAnswer === undefined || correctAnswer === null) {
        return res.status(422).json({
          success: false,
          message:
            "This quiz has a question without a recognized correct-answer field.",
          questionIndex: answer.questionIndex,
        });
      }

      const selected = answer.selectedAnswer.trim().toLowerCase();
      const correct = String(correctAnswer).trim().toLowerCase();

      if (selected === correct) {
        correctCount++;
      }
    }

    const totalQuestions = quiz.questions.length;
    const score = Number(
      ((correctCount / totalQuestions) * quiz.totalMarks).toFixed(2)
    );

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user._id,
      answers,
      score,
      totalMarks: quiz.totalMarks,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted and graded successfully.",
      data: {
        attemptId: attempt._id,
        score,
        totalMarks: quiz.totalMarks,
        correctAnswers: correctCount,
        totalQuestions,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this quiz.",
      });
    }

    console.error("Submit quiz error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
    });
  }
};

const getMyQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user._id,
    })
      .populate("quiz", "title topic classroom totalMarks")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    console.error("Get quiz attempts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz history.",
    });
  }
};

module.exports = {
  saveQuiz,
  getTeacherQuizzes,
  getStudentQuizzes,
  submitQuiz,
  getMyQuizAttempts,
};
