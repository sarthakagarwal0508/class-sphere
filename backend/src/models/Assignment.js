const mongoose = require("mongoose");

const assignmentAttachmentSchema = new mongoose.Schema(
  {
    cloudinaryPublicId: { type: String, required: true },
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },
    mimeType: {
      type: String,
      enum: ["application/pdf"],
      default: "application/pdf",
    },
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    // Optional teacher-provided PDF.
    // Existing assignments without attachments remain valid.
    attachment: {
      type: assignmentAttachmentSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ classroom: 1, dueDate: 1 });
assignmentSchema.index({ teacher: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);