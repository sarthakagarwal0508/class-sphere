const mongoose = require("mongoose");
const Classroom = require("../models/Classroom");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const ActivityEvent = require("../models/ActivityEvent");
const {
  predictBatch,
  ModelServiceError,
} = require("../services/mlPredictionService");

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MODEL_WINDOW_DAYS = 90;

/**
 * Calculate the six features expected by the FastAPI/XGBoost service.
 * Day 0 is courseStartDate. Metrics include data up to the current request time,
 * capped at the end of course day 90. The optional end argument makes the
 * observation cutoff explicit and keeps feature calculation aligned with DB queries.
 */
const calculateStudentMetrics = (
  assignments,
  studentSubmissions,
  activityEvents,
  courseStartDate,
  observationEndExclusive
) => {
  const courseStart = new Date(courseStartDate);
  if (Number.isNaN(courseStart.getTime())) {
    throw new TypeError("A valid courseStartDate is required.");
  }

  const windowStart = courseStart.getTime();
  const maxWindowEndExclusive =
    windowStart + (MODEL_WINDOW_DAYS + 1) * DAY_IN_MS;
  const requestedWindowEnd =
    observationEndExclusive === undefined
      ? maxWindowEndExclusive
      : new Date(observationEndExclusive).getTime();

  if (!Number.isFinite(requestedWindowEnd)) {
    throw new TypeError("A valid observationEndExclusive is required.");
  }

  // Never include data before the course starts or after course day 90.
  const windowEndExclusive = Math.max(
    windowStart,
    Math.min(requestedWindowEnd, maxWindowEndExclusive)
  );

  const assignmentMap = new Map(
    assignments.map((assignment) => [String(assignment._id), assignment])
  );

  const activeDayBuckets = new Set();
  const scoredPercentages = [];
  let lateSubmissions = 0;
  let weightedScore = 0;

  // Count distinct course-relative activity days, not just submission days.
  for (const event of activityEvents || []) {
    const occurredAt = new Date(event.occurredAt).getTime();
    if (
      !Number.isFinite(occurredAt) ||
      occurredAt < windowStart ||
      occurredAt >= windowEndExclusive
    ) {
      continue;
    }

    const courseDay = Math.floor((occurredAt - windowStart) / DAY_IN_MS);
    activeDayBuckets.add(courseDay);
  }

  for (const submission of studentSubmissions || []) {
    const submittedAt = new Date(submission.submittedAt).getTime();
    if (
      !Number.isFinite(submittedAt) ||
      submittedAt < windowStart ||
      submittedAt >= windowEndExclusive
    ) {
      continue;
    }

    // Legacy and newly recorded assignment submissions are also activity.
    // This keeps assignment engagement visible even for pre-event-log records.
    const courseDay = Math.floor((submittedAt - windowStart) / DAY_IN_MS);
    activeDayBuckets.add(courseDay);

    const assignment = assignmentMap.get(String(submission.assignment));
    if (!assignment) continue;

    if (
      submission.status !== "graded" ||
      submission.marksObtained === null ||
      submission.marksObtained === undefined
    ) {
      continue;
    }

    const marks = Number(submission.marksObtained);
    const maxMarks = Number(assignment.maxMarks);
    const weight = Number(assignment.weight ?? 100);

    if (
      !Number.isFinite(marks) ||
      !Number.isFinite(maxMarks) ||
      maxMarks <= 0 ||
      marks < 0 ||
      marks > maxMarks ||
      !Number.isFinite(weight) ||
      weight < 0
    ) {
      continue;
    }

    const score = (marks / maxMarks) * 100;
    scoredPercentages.push(score);
    weightedScore += (score * weight) / 100;

    if (
      assignment.dueDate &&
      submittedAt > new Date(assignment.dueDate).getTime()
    ) {
      lateSubmissions += 1;
    }
  }

  const numAssessmentsDone = scoredPercentages.length;

  if (numAssessmentsDone === 0) {
    return {
      num_assessments_done: 0,
      avg_score: 0,
      min_score: 0,
      weighted_score: 0,
      late_submissions: 0,
      active_days: activeDayBuckets.size,
    };
  }

  const avgScore =
    scoredPercentages.reduce((sum, score) => sum + score, 0) /
    numAssessmentsDone;

  return {
    num_assessments_done: numAssessmentsDone,
    // Keep full calculated precision; the model guide does not specify
    // rounding these input features before inference.
    avg_score: avgScore,
    min_score: Math.min(...scoredPercentages),
    weighted_score: weightedScore,
    late_submissions: lateSubmissions,
    active_days: activeDayBuckets.size,
  };
};

const getClassroomRiskPredictions = async (req, res) => {
  try {
    const { id: classroomId } = req.params;

    if (!mongoose.isValidObjectId(classroomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    const classroom = await Classroom.findOne({
      _id: classroomId,
      teacher: req.user._id,
    }).populate("students", "name email");

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found or you are not its teacher.",
      });
    }

    // Backward-compatible fallback for classrooms created before migration.
    const courseStartDate = new Date(
      classroom.courseStartDate || classroom.createdAt
    );
    if (Number.isNaN(courseStartDate.getTime())) {
      return res.status(422).json({
        success: false,
        code: "COURSE_START_DATE_INVALID",
        message: "The classroom has no valid course start date.",
      });
    }

    // Send a prediction request on any course day. Use data available up to
    // this request time, while retaining the maximum day-90 observation cap.
    const maxWindowEndExclusive =
      courseStartDate.getTime() + (MODEL_WINDOW_DAYS + 1) * DAY_IN_MS;
    const observationEndExclusive = new Date(
      Math.max(
        courseStartDate.getTime(),
        Math.min(Date.now(), maxWindowEndExclusive)
      )
    );

    if (classroom.students.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          classroom: { id: classroom._id, name: classroom.name },
          totalStudents: 0,
          predictedStudents: 0,
          atRiskStudents: 0,
          highRiskStudents: 0,
          students: [],
        },
      });
    }

    const assignments = await Assignment.find({ classroom: classroomId })
      .select("_id maxMarks weight dueDate")
      .lean();

    const studentIds = classroom.students.map((student) => student._id);
    const assignmentIds = assignments.map((assignment) => assignment._id);
    const windowEndExclusive = observationEndExclusive;

    const [submissions, activityEvents] = await Promise.all([
      assignmentIds.length
        ? Submission.find({
            assignment: { $in: assignmentIds },
            student: { $in: studentIds },
            submittedAt: { $gte: courseStartDate, $lt: windowEndExclusive },
          })
            .select("student assignment status marksObtained submittedAt")
            .lean()
        : [],
      ActivityEvent.find({
        classroom: classroomId,
        student: { $in: studentIds },
        occurredAt: { $gte: courseStartDate, $lt: windowEndExclusive },
      })
        .select("student eventType occurredAt")
        .lean(),
    ]);

    const submissionsByStudent = new Map(
      studentIds.map((studentId) => [String(studentId), []])
    );
    const activityByStudent = new Map(
      studentIds.map((studentId) => [String(studentId), []])
    );

    for (const submission of submissions) {
      submissionsByStudent.get(String(submission.student))?.push(submission);
    }
    for (const event of activityEvents) {
      activityByStudent.get(String(event.student))?.push(event);
    }

    const studentsWithMetrics = classroom.students.map((student) => {
      const key = String(student._id);
      const metrics = calculateStudentMetrics(
        assignments,
        submissionsByStudent.get(key) || [],
        activityByStudent.get(key) || [],
        courseStartDate,
        observationEndExclusive
      );
      return { student, metrics };
    });

    let predictions;
    try {
      predictions = await predictBatch(
        studentsWithMetrics.map((item) => item.metrics)
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

    const students = studentsWithMetrics.map((item, index) => ({
      student: {
        id: item.student._id,
        name: item.student.name,
        email: item.student.email,
      },
      inputFeatures: item.metrics,
      prediction: predictions[index],
    }));

    return res.status(200).json({
      success: true,
      data: {
        classroom: { id: classroom._id, name: classroom.name },
        model: {
          name: "XGBoost",
          target: "Fail or Withdrawn",
          observationWindowDays: MODEL_WINDOW_DAYS,
          day90Included:
            observationEndExclusive.getTime() >
            courseStartDate.getTime() + MODEL_WINDOW_DAYS * DAY_IN_MS,
          threshold: 0.35,
        },
        courseStartDate,
        observationWindowEnd: observationEndExclusive,
        totalStudents: students.length,
        predictedStudents: predictions.length,
        atRiskStudents: students.filter((item) => item.prediction.at_risk).length,
        highRiskStudents: students.filter(
          (item) => item.prediction.risk_level === "High"
        ).length,
        students,
        disclaimer:
          "Risk scores are model estimates for teacher support, not diagnoses or guarantees. Do not use them as the sole basis for decisions affecting a student.",
        activityDataNote:
          "active_days counts distinct course-relative days with recorded student activity (assignment list/submission, quiz list/attempt, study-material list/download, or doubt creation/reply). Events from course day 0 through the prediction request time are included, capped at course day 90.",
      },
    });
  } catch (error) {
    console.error("Classroom risk prediction error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  calculateStudentMetrics,
  getClassroomRiskPredictions,
};  