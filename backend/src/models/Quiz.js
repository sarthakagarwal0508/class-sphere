
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    topic: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
      index: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    questions: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
      validate: {
        validator: (questions) =>
          Array.isArray(questions) &&
          questions.length >= 1 &&
          questions.length <= 20,
        message: "A quiz must contain between 1 and 20 questions.",
      },
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      default: "mixed",
    },

    source: {
      type: String,
      enum: ["topic", "study_material", "pdf", "mixed"],
      default: "topic",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    totalMarks: {
      type: Number,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

quizSchema.index({ classroom: 1, createdAt: -1 });

module.exports = mongoose.model("Quiz", quizSchema);
