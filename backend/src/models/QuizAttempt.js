
const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
      },
    ],

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index(
  { quiz: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
