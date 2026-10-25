const mongoose = require("mongoose");

const CODE_MODULES = ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG"];
const CODE_PRESENTATIONS = ["2013B", "2013J", "2014B", "2014J"];
const REGIONS = [
  "East Anglian Region",
  "East Midlands Region",
  "Ireland",
  "London Region",
  "North Region",
  "North Western Region",
  "Scotland",
  "South East Region",
  "South Region",
  "South West Region",
  "Wales",
  "West Midlands Region",
  "Yorkshire Region",
];
const EDUCATION_LEVELS = [
  "No Formal quals",
  "Lower Than A Level",
  "A Level or Equivalent",
  "HE Qualification",
  "Post Graduate Qualification",
];
const IMD_BANDS = [
  "0-10", "10-20", "20-30", "30-40", "40-50", "50-60",
  "60-70", "70-80", "80-90", "90-100", "unknown",
];
const AGE_BANDS = ["0-35", "35-55", "55<="];

const studentRiskProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
      index: true,
    },
    // Fields not available in the existing ClassSphere schemas.
    numOfPrevAttempts: { type: Number, min: 0, default: 0 },
    studiedCredits: { type: Number, min: 0, required: true },
    dateRegistration: { type: Number, required: true },
    dateUnregistration: { type: Number, default: null },
    totalClicks: { type: Number, min: 0, required: true },
    activeDays: { type: Number, min: 0, required: true },
    resourcesVisited: { type: Number, min: 0, required: true },
    clicksLast30Days: { type: Number, min: 0, required: true },

    // Exact category labels accepted by the supplied trained model.
    codeModule: { type: String, enum: CODE_MODULES, required: true },
    codePresentation: { type: String, enum: CODE_PRESENTATIONS, required: true },
    gender: { type: String, enum: ["M", "F"], required: true },
    region: { type: String, enum: REGIONS, required: true },
    highestEducation: { type: String, enum: EDUCATION_LEVELS, required: true },
    imdBand: { type: String, enum: IMD_BANDS, required: true },
    ageBand: { type: String, enum: AGE_BANDS, required: true },
    disability: { type: String, enum: ["Y", "N"], required: true },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

studentRiskProfileSchema.index({ student: 1, classroom: 1 }, { unique: true });

module.exports = mongoose.model("StudentRiskProfile", studentRiskProfileSchema);
