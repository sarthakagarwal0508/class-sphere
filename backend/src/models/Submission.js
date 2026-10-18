
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answerText: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    submissionUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },

    marksObtained: {
      type: Number,
      min: 0,
      default: null,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    gradedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One submission record per student per assignment.
submissionSchema.index(
  { assignment: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
