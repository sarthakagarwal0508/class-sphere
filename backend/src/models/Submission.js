
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

    // Student's written answer
    answerText: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    // Optional external link to submitted work
    submissionUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    // Optional PDF uploaded by the student to Cloudinary
    attachment: {
      cloudinaryPublicId: {
        type: String,
        default: null,
      },

      originalName: {
        type: String,
        default: null,
      },

      fileSize: {
        type: Number,
        default: null,
      },

      mimeType: {
        type: String,
        default: null,
      },
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

// One submission record per student per assignment
submissionSchema.index(
  { assignment: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
