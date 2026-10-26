const mongoose = require("mongoose");

const Classroom = require("../models/Classroom");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const StudentRiskProfile = require("../models/StudentRiskProfile");

const {
  predictBatch,
  ModelServiceError,
} = require("../services/mlPredictionService");

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

// These values match the accepted categories in the Python StudentData model.
const ALLOWED_CATEGORIES = {
  code_module: ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG"],

  code_presentation: ["2013B", "2013J", "2014B", "2014J"],

  gender: ["M", "F"],

  region: [
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
  ],

  highest_education: [
    "No Formal quals",
    "Lower Than A Level",
    "A Level or Equivalent",
    "HE Qualification",
    "Post Graduate Qualification",
  ],

  imd_band: [
    "0-10",
    "10-20",
    "20-30",
    "30-40",
    "40-50",
    "50-60",
    "60-70",
    "70-80",
    "80-90",
    "90-100",
    "unknown",
  ],

  age_band: ["0-35", "35-55", "55<="],

  disability: ["Y", "N"],
};

const INTEGER_FIELDS = [
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

// Keep the input feature names expected by the existing Python model.
const toModelInput = (profile, metrics) => ({
  num_of_prev_attempts: profile.numOfPrevAttempts ?? 0,
  studied_credits: profile.studiedCredits,
  date_registration: profile.dateRegistration,
  date_unregistration: profile.dateUnregistration ?? null,

  num_assessments_done: metrics.numAssessmentsDone,
  avg_score: metrics.averageScore ?? 0,
  min_score: metrics.minimumScore ?? 0,
  weighted_score: metrics.weightedScore ?? 0,
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

// Calculate metrics from existing assignments and submissions.
const calculateStudentMetrics = (
  assignments,
  studentSubmissions,
  now = new Date()
) => {
  const assignmentById = new Map(
    assignments.map((assignment) => [
      assignment._id.toString(),
      assignment,
    ])
  );

  const submittedAssignmentIds = new Set();
  const gradedPercentages = [];

  const recentCutoff7 = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000
  );

  const recentCutoff30 = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000
  );

  let weightedMarks = 0;
  let weightedMaximum = 0;
  let lateSubmissions = 0;
  let submissionsLast7Days = 0;
  let submissionsLast30Days = 0;
  let latestSubmissionAt = null;

  for (const submission of studentSubmissions) {
    const assignmentId = submission.assignment?._id
      ? submission.assignment._id.toString()
      : submission.assignment?.toString();

    const assignment = assignmentById.get(assignmentId);

    if (!assignment) continue;

    submittedAssignmentIds.add(assignmentId);

    const submittedAt = submission.submittedAt
      ? new Date(submission.submittedAt)
      : null;

    if (submittedAt && !Number.isNaN(submittedAt.getTime())) {
      if (!latestSubmissionAt || submittedAt > latestSubmissionAt) {
        latestSubmissionAt = submittedAt;
      }

      if (submittedAt >= recentCutoff7 && submittedAt <= now) {
        submissionsLast7Days += 1;
      }

      if (submittedAt >= recentCutoff30 && submittedAt <= now) {
        submissionsLast30Days += 1;
      }

      if (
        assignment.dueDate &&
        submittedAt > new Date(assignment.dueDate)
      ) {
        lateSubmissions += 1;
      }
    }

    // Only graded submissions are used to calculate scores.
    if (
      submission.status === "graded" &&
      Number(assignment.maxMarks) > 0
    ) {
      const marks = Number(submission.marksObtained ?? 0);
      const maxMarks = Number(assignment.maxMarks);

      if (
        !Number.isFinite(marks) ||
        !Number.isFinite(maxMarks) ||
        maxMarks <= 0
      ) {
        continue;
      }

      const percentage = Math.min(
        100,
        Math.max(0, (marks / maxMarks) * 100)
      );

      gradedPercentages.push(percentage);
      weightedMarks += marks;
      weightedMaximum += maxMarks;
    }
  }

  const averageScore = gradedPercentages.length
    ? gradedPercentages.reduce((sum, score) => sum + score, 0) /
      gradedPercentages.length
    : null;

  const minimumScore = gradedPercentages.length
    ? Math.min(...gradedPercentages)
    : null;

  const weightedScore =
    weightedMaximum > 0
      ? Math.min(
          100,
          Math.max(0, (weightedMarks / weightedMaximum) * 100)
        )
      : null;

  const overdueUnsubmittedAssignments = assignments.filter(
    (assignment) => {
      const dueDate = assignment.dueDate
        ? new Date(assignment.dueDate)
        : null;

      return (
        dueDate &&
        !Number.isNaN(dueDate.getTime()) &&
        dueDate < now &&
        !submittedAssignmentIds.has(assignment._id.toString())
      );
    }
  ).length;

  const submittedAssessments = submittedAssignmentIds.size;
  const gradedAssessments = gradedPercentages.length;

  return {
    // Preserved for compatibility with the current Python model.
    numAssessmentsDone: submittedAssessments,

    submittedAssessments,
    gradedAssessments,

    ungradedAssessments: Math.max(
      0,
      submittedAssessments - gradedAssessments
    ),

    pendingAssessments: Math.max(
      0,
      assignments.length - submittedAssessments
    ),

    overdueUnsubmittedAssignments,
    totalAssignments: assignments.length,

    averageScore:
      averageScore === null
        ? null
        : Number(averageScore.toFixed(2)),

    minimumScore:
      minimumScore === null
        ? null
        : Number(minimumScore.toFixed(2)),

    weightedScore:
      weightedScore === null
        ? null
        : Number(weightedScore.toFixed(2)),

    lateSubmissions,
    submissionsLast7Days,
    submissionsLast30Days,

    latestSubmissionAt: latestSubmissionAt
      ? latestSubmissionAt.toISOString()
      : null,

    scoreDataAvailable: gradedAssessments > 0,
  };
};

const isValidObjectId = (value) =>
  mongoose.isValidObjectId(value);

const getOwnedClassroom = async (classroomId, teacherId) => {
  if (!isValidObjectId(classroomId)) {
    return {
      error: "Invalid classroom ID.",
      status: 400,
    };
  }

  const classroom = await Classroom.findOne({
    _id: classroomId,
    teacher: teacherId,
  }).populate("students", "name email");

  if (!classroom) {
    return {
      error: "Classroom not found or you are not its teacher.",
      status: 404,
    };
  }

  return { classroom };
};

// PUT /api/analytics/teacher/classrooms/:id/students/:studentId/risk-profile
const upsertStudentRiskProfile = async (req, res) => {
  try {
    const { id: classroomId, studentId } = req.params;

    const ownership = await getOwnedClassroom(
      classroomId,
      req.user._id
    );

    if (ownership.error) {
      return res.status(ownership.status).json({
        success: false,
        message: ownership.error,
      });
    }

    if (!isValidObjectId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    const studentIsEnrolled = ownership.classroom.students.some(
      (student) => student._id.toString() === studentId
    );

    if (!studentIsEnrolled) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this classroom.",
      });
    }

    const body =
      req.body &&
      typeof req.body === "object" &&
      !Array.isArray(req.body)
        ? { ...req.body }
        : null;

    if (!body) {
      return res.status(400).json({
        success: false,
        message: "A JSON object is required.",
      });
    }

    const unexpectedFields = Object.keys(body).filter(
      (field) => !ALLOWED_PROFILE_FIELDS.has(field)
    );

    if (unexpectedFields.length) {
      return res.status(400).json({
        success: false,
        message:
          "Unexpected fields provided. Assessment metrics are derived from ClassSphere submissions.",
        fields: unexpectedFields,
      });
    }

    const missingFields = REQUIRED_PROFILE_FIELDS.filter(
      (field) =>
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
    );

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message:
          "Complete the required model context and activity fields before saving the risk profile.",
        missingFields,
      });
    }

    // Normalize the optional percent sign accepted by the Python API.
    if (typeof body.imd_band === "string") {
      body.imd_band = body.imd_band.replace(/%/g, "").trim();
    }

    for (const field of INTEGER_FIELDS) {
      if (
        body[field] !== undefined &&
        (!Number.isInteger(body[field]) || body[field] < 0)
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a non-negative integer.`,
        });
      }
    }

    if (!Number.isFinite(body.date_registration)) {
      return res.status(400).json({
        success: false,
        message: "date_registration must be a finite number.",
      });
    }

    if (
      body.date_unregistration !== undefined &&
      body.date_unregistration !== null &&
      !Number.isFinite(body.date_unregistration)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "date_unregistration must be a finite number or null.",
      });
    }

    if (
      body.date_unregistration !== undefined &&
      body.date_unregistration !== null &&
      body.date_unregistration < body.date_registration
    ) {
      return res.status(400).json({
        success: false,
        message:
          "date_unregistration cannot be earlier than date_registration.",
      });
    }

    for (const field of CATEGORY_FIELDS) {
      if (typeof body[field] !== "string") {
        return res.status(400).json({
          success: false,
          message: `Invalid value for ${field}.`,
          allowedValues: ALLOWED_CATEGORIES[field],
        });
      }

      const value = body[field].trim();

      if (!ALLOWED_CATEGORIES[field].includes(value)) {
        return res.status(400).json({
          success: false,
          message: `Invalid value for ${field}.`,
          allowedValues: ALLOWED_CATEGORIES[field],
        });
      }

      body[field] = value;
    }

    if (body.clicks_last_30_days > body.total_clicks) {
      return res.status(400).json({
        success: false,
        message:
          "clicks_last_30_days cannot exceed total_clicks.",
      });
    }

    if (body.active_days > 90) {
      return res.status(400).json({
        success: false,
        message:
          "active_days cannot exceed the model's 90-day activity window.",
      });
    }

    const profileValues = toProfileDocument(body);

    let profile = await StudentRiskProfile.findOne({
      student: studentId,
      classroom: classroomId,
    });

    if (!profile) {
      profile = new StudentRiskProfile({
        student: studentId,
        classroom: classroomId,
      });
    }

    Object.assign(profile, profileValues, {
      updatedBy: req.user._id,
    });

    try {
      await profile.save();
    } catch (error) {
      if (
        error.name === "ValidationError" ||
        error.name === "CastError"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "One or more risk profile fields use a value that the model does not accept.",
          details: Object.values(error.errors || {}).map(
            (item) => ({
              field: item.path,
              message: item.message,
            })
          ),
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
    console.error(
      "Save student risk profile error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// GET /api/analytics/teacher/classrooms/:id/risk-predictions
const getClassroomRiskPredictions = async (req, res) => {
  try {
    const { id: classroomId } = req.params;

    const ownership = await getOwnedClassroom(
      classroomId,
      req.user._id
    );

    if (ownership.error) {
      return res.status(ownership.status).json({
        success: false,
        message: ownership.error,
      });
    }

    const { classroom } = ownership;

    if (classroom.students.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          classroom: {
            id: classroom._id,
            name: classroom.name,
          },
          totalStudents: 0,
          predictedStudents: 0,
          students: [],
        },
      });
    }

    const assignments = await Assignment.find({
      classroom: classroomId,
    }).select("_id maxMarks dueDate");

    const assignmentIds = assignments.map(
      (assignment) => assignment._id
    );

    const studentIds = classroom.students.map(
      (student) => student._id
    );

    const submissions = assignmentIds.length
      ? await Submission.find({
          assignment: { $in: assignmentIds },
          student: { $in: studentIds },
        }).select(
          "student assignment status marksObtained submittedAt gradedAt"
        )
      : [];

    const profiles = await StudentRiskProfile.find({
      classroom: classroomId,
      student: { $in: studentIds },
    });

    const profileMap = new Map(
      profiles.map((profile) => [
        profile.student.toString(),
        profile,
      ])
    );

    const submissionsByStudent = new Map(
      studentIds.map((id) => [id.toString(), []])
    );

    for (const submission of submissions) {
      const list = submissionsByStudent.get(
        submission.student.toString()
      );

      if (list) {
        list.push(submission);
      }
    }

    const studentsWithProfiles = [];

    const studentResponses = classroom.students.map((student) => {
      const studentId = student._id.toString();
      const profile = profileMap.get(studentId);

      const metrics = calculateStudentMetrics(
        assignments,
        submissionsByStudent.get(studentId) || []
      );

      if (!profile) {
        return {
          student: {
            id: student._id,
            name: student.name,
            email: student.email,
          },
          status: "profile_required",
          message:
            "Configure the required ML model context and activity fields for this student before prediction.",
          profileEndpoint:
            `/api/analytics/teacher/classrooms/${classroomId}/students/${studentId}/risk-profile`,
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
        predictions = await predictBatch(
          studentsWithProfiles.map((item) => item.modelInput)
        );
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
      predictionByStudent.set(
        item.student._id.toString(),
        {
          student: {
            id: item.student._id,
            name: item.student.name,
            email: item.student.email,
          },
          status: "predicted",
          prediction: predictions[index],
          performanceMetrics: item.metrics,
          predictionCaveat: item.metrics.scoreDataAvailable
            ? null
            : "No graded assignments yet; score-based metrics are unavailable and returned as null.",
        }
      );
    });

    const students = classroom.students.map(
      (student, index) =>
        predictionByStudent.get(student._id.toString()) ||
        studentResponses[index]
    );

    const predictedStudents = students.filter(
      (student) => student.status === "predicted"
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        classroom: {
          id: classroom._id,
          name: classroom.name,
        },
        totalStudents: students.length,
        predictedStudents,
        students,

        disclaimer:
          "Risk scores are model estimates for decision support only, not a diagnosis or guarantee. Do not use them as the sole basis for decisions affecting a student.",

        modelWindowNote:
          "The supplied model was designed around course activity up to day 90. Ensure saved activity values use a compatible time window before interpreting predictions.",
      },
    });
  } catch (error) {
    console.error(
      "Classroom risk prediction error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  upsertStudentRiskProfile,
  getClassroomRiskPredictions,
};