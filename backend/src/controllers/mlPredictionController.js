const mongoose = require("mongoose");
const Classroom = require("../models/Classroom");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const StudentRiskProfile = require("../models/StudentRiskProfile");
const { predictBatch, ModelServiceError } = require("../services/mlPredictionService");

const REQUIRED_PROFILE_FIELDS = [
  "studied_credits",
  "date_registration",
  "total_clicks",
  "active_days",
  "resources_visited",
  "clicks_last_30_days",
  "code_module",
  "code_presentation",
  "gender",
  "region",
  "highest_education",
  "imd_band",
  "age_band",
  "disability",
];

const ALLOWED_PROFILE_FIELDS = new Set([
  ...REQUIRED_PROFILE_FIELDS,
  "num_of_prev_attempts",
  "date_unregistration",
]);

const CATEGORY_FIELDS = [
  "code_module",
  "code_presentation",
  "gender",
  "region",
  "highest_education",
  "imd_band",
  "age_band",
  "disability",
];

const integerFields = [
  "num_of_prev_attempts",
  "studied_credits",
  "total_clicks",
  "active_days",
  "resources_visited",
  "clicks_last_30_days",
];

const toProfileDocument = (body) => ({
  numOfPrevAttempts: body.num_of_prev_attempts ?? 0,
  studiedCredits: body.studied_credits,
  dateRegistration: body.date_registration,
  dateUnregistration: body.date_unregistration ?? null,
  totalClicks: body.total_clicks,
  activeDays: body.active_days,
  resourcesVisited: body.resources_visited,
  clicksLast30Days: body.clicks_last_30_days,
  codeModule: body.code_module,
  codePresentation: body.code_presentation,
  gender: body.gender,
  region: body.region,
  highestEducation: body.highest_education,
  imdBand: body.imd_band,
  ageBand: body.age_band,
  disability: body.disability,
});

const toModelInput = (profile, metrics) => ({
  num_of_prev_attempts: profile.numOfPrevAttempts ?? 0,
  studied_credits: profile.studiedCredits,
  date_registration: profile.dateRegistration,
  date_unregistration: profile.dateUnregistration ?? null,
  num_assessments_done: metrics.numAssessmentsDone,
  avg_score: metrics.averageScore,
  min_score: metrics.minimumScore,
  weighted_score: metrics.weightedScore,
  late_submissions: metrics.lateSubmissions,
  total_clicks: profile.totalClicks,
  active_days: profile.activeDays,
  resources_visited: profile.resourcesVisited,
  clicks_last_30_days: profile.clicksLast30Days,
  code_module: profile.codeModule,
  code_presentation: profile.codePresentation,
  gender: profile.gender,
  region: profile.region,
  highest_education: profile.highestEducation,
  imd_band: profile.imdBand,
  age_band: profile.ageBand,
  disability: profile.disability,
});

const calculateStudentMetrics = (assignments, studentSubmissions) => {
  const assignmentById = new Map(assignments.map((item) => [item._id.toString(), item]));
  const gradedPercentages = [];
  let weightedMarks = 0;
  let weightedMaximum = 0;
  let lateSubmissions = 0;

  for (const submission of studentSubmissions) {
    const assignment = assignmentById.get(submission.assignment.toString());
    if (!assignment) continue;

    if (submission.submittedAt && assignment.dueDate && submission.submittedAt > assignment.dueDate) {
      lateSubmissions += 1;
    }

    if (submission.status === "graded" && assignment.maxMarks > 0) {
      const percentage = Math.min(
        100,
        Math.max(0, ((submission.marksObtained ?? 0) / assignment.maxMarks) * 100)
      );
      gradedPercentages.push(percentage);
      weightedMarks += submission.marksObtained ?? 0;
      weightedMaximum += assignment.maxMarks;
    }
  }

  const averageScore = gradedPercentages.length
    ? gradedPercentages.reduce((sum, score) => sum + score, 0) / gradedPercentages.length
    : 0;
  const minimumScore = gradedPercentages.length ? Math.min(...gradedPercentages) : 0;
  const weightedScore = weightedMaximum > 0 ? (weightedMarks / weightedMaximum) * 100 : 0;

  return {
    numAssessmentsDone: studentSubmissions.length,
    gradedAssessments: gradedPercentages.length,
    pendingAssessments: Math.max(0, assignments.length - studentSubmissions.length),
    averageScore: Number(averageScore.toFixed(2)),
    minimumScore: Number(minimumScore.toFixed(2)),
    weightedScore: Number(weightedScore.toFixed(2)),
    lateSubmissions,
  };
};

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const getOwnedClassroom = async (classroomId, teacherId) => {
  if (!isValidObjectId(classroomId)) return { error: "Invalid classroom ID.", status: 400 };
  const classroom = await Classroom.findOne({ _id: classroomId, teacher: teacherId })
    .populate("students", "name email");
  if (!classroom) return { error: "Classroom not found or you are not its teacher.", status: 404 };
  return { classroom };
};

// PUT /api/analytics/teacher/classrooms/:id/students/:studentId/risk-profile
const upsertStudentRiskProfile = async (req, res) => {
  try {
    const { id: classroomId, studentId } = req.params;
    const ownership = await getOwnedClassroom(classroomId, req.user._id);
    if (ownership.error) {
      return res.status(ownership.status).json({ success: false, message: ownership.error });
    }

    if (!isValidObjectId(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid student ID." });
    }

    const studentIsEnrolled = ownership.classroom.students.some(
      (student) => student._id.toString() === studentId
    );
    if (!studentIsEnrolled) {
      return res.status(404).json({ success: false, message: "Student is not enrolled in this classroom." });
    }

    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? { ...req.body } : null;
    if (!body) return res.status(400).json({ success: false, message: "A JSON object is required." });

    const unexpectedFields = Object.keys(body).filter((field) => !ALLOWED_PROFILE_FIELDS.has(field));
    if (unexpectedFields.length) {
      return res.status(400).json({
        success: false,
        message: "Unexpected fields provided. Assessment score fields are derived from ClassSphere submissions.",
        fields: unexpectedFields,
      });
    }

    const missingFields = REQUIRED_PROFILE_FIELDS.filter(
      (field) => body[field] === undefined || body[field] === null || body[field] === ""
    );
    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: "Complete the required model context and activity fields before saving the risk profile.",
        missingFields,
      });
    }

    if (body.imd_band !== undefined && typeof body.imd_band === "string") {
      body.imd_band = body.imd_band.replace(/%/g, "").trim();
    }

    for (const field of integerFields) {
      if (body[field] !== undefined && (!Number.isInteger(body[field]) || body[field] < 0)) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a non-negative integer.`,
        });
      }
    }

    if (!Number.isFinite(body.date_registration)) {
      return res.status(400).json({ success: false, message: "date_registration must be a finite number." });
    }
    if (body.date_unregistration !== undefined && body.date_unregistration !== null && !Number.isFinite(body.date_unregistration)) {
      return res.status(400).json({ success: false, message: "date_unregistration must be a finite number or null." });
    }

    for (const field of CATEGORY_FIELDS) {
      if (typeof body[field] !== "string") {
        return res.status(400).json({ success: false, message: `${field} must be a string using one of the model's accepted values.` });
      }
    }

    const profileValues = toProfileDocument(body);
    let profile = await StudentRiskProfile.findOne({ student: studentId, classroom: classroomId });
    if (!profile) {
      profile = new StudentRiskProfile({ student: studentId, classroom: classroomId });
    }
    Object.assign(profile, profileValues, { updatedBy: req.user._id });

    try {
      await profile.save();
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "One or more risk profile fields use a value that the model does not accept.",
          details: Object.values(error.errors || {}).map((item) => ({ field: item.path, message: item.message })),
        });
      }
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "Student risk profile saved.",
      data: {
        studentId,
        classroomId,
        profileConfigured: true,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    console.error("Save student risk profile error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// GET /api/analytics/teacher/classrooms/:id/risk-predictions
const getClassroomRiskPredictions = async (req, res) => {
  try {
    const { id: classroomId } = req.params;
    const ownership = await getOwnedClassroom(classroomId, req.user._id);
    if (ownership.error) {
      return res.status(ownership.status).json({ success: false, message: ownership.error });
    }

    const { classroom } = ownership;
    if (classroom.students.length === 0) {
      return res.status(200).json({
        success: true,
        data: { classroom: { id: classroom._id, name: classroom.name }, totalStudents: 0, predictedStudents: 0, students: [] },
      });
    }

    const assignments = await Assignment.find({ classroom: classroomId })
      .select("_id maxMarks dueDate");
    const assignmentIds = assignments.map((assignment) => assignment._id);
    const studentIds = classroom.students.map((student) => student._id);

    const submissions = assignmentIds.length
      ? await Submission.find({ assignment: { $in: assignmentIds }, student: { $in: studentIds } })
          .select("student assignment status marksObtained submittedAt")
      : [];

    const profiles = await StudentRiskProfile.find({ classroom: classroomId, student: { $in: studentIds } });
    const profileMap = new Map(profiles.map((profile) => [profile.student.toString(), profile]));
    const submissionsByStudent = new Map(studentIds.map((id) => [id.toString(), []]));
    for (const submission of submissions) {
      const list = submissionsByStudent.get(submission.student.toString());
      if (list) list.push(submission);
    }

    const studentsWithProfiles = [];
    const studentResponses = classroom.students.map((student) => {
      const studentId = student._id.toString();
      const profile = profileMap.get(studentId);
      const metrics = calculateStudentMetrics(assignments, submissionsByStudent.get(studentId) || []);

      if (!profile) {
        return {
          student: { id: student._id, name: student.name, email: student.email },
          status: "profile_required",
          message: "Configure the required ML model context and activity fields for this student before prediction.",
          profileEndpoint: `/api/analytics/teacher/classrooms/${classroomId}/students/${studentId}/risk-profile`,
          performanceMetrics: metrics,
        };
      }

      studentsWithProfiles.push({
        student,
        profile,
        metrics,
        modelInput: toModelInput(profile, metrics),
      });
      return null;
    });

    let predictions = [];
    if (studentsWithProfiles.length > 0) {
      try {
        predictions = await predictBatch(studentsWithProfiles.map((item) => item.modelInput));
      } catch (error) {
        if (error instanceof ModelServiceError) {
          return res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
          });
        }
        throw error;
      }
    }

    const predictionByStudent = new Map();
    studentsWithProfiles.forEach((item, index) => {
      predictionByStudent.set(item.student._id.toString(), {
        student: { id: item.student._id, name: item.student.name, email: item.student.email },
        status: "predicted",
        prediction: predictions[index],
        performanceMetrics: item.metrics,
      });
    });

    const students = classroom.students.map((student, index) =>
      predictionByStudent.get(student._id.toString()) || studentResponses[index]
    );
    const predictedStudents = students.filter((student) => student.status === "predicted").length;

    return res.status(200).json({
      success: true,
      data: {
        classroom: { id: classroom._id, name: classroom.name },
        totalStudents: students.length,
        predictedStudents,
        students,
        disclaimer: "Risk scores are model estimates for decision support only, not a diagnosis or guarantee. Do not use them as the sole basis for decisions affecting a student.",
        modelWindowNote: "The supplied model was designed around course activity up to day 90. Make sure the saved activity values use a compatible time window before interpreting predictions.",
      },
    });
  } catch (error) {
    console.error("Classroom risk prediction error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { upsertStudentRiskProfile, getClassroomRiskPredictions };
