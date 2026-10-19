
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 5000,
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
  },
  { timestamps: true }
);

announcementSchema.index({ classroom: 1, createdAt: -1 });
announcementSchema.index({ teacher: 1 });

module.exports = mongoose.model("Announcement", announcementSchema);
