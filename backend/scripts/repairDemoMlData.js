
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Classroom = require("../src/models/Classroom");
const Assignment = require("../src/models/Assignment");
const Submission = require("../src/models/Submission");
const ActivityEvent = require("../src/models/ActivityEvent");

const DAY = 24 * 60 * 60 * 1000;
const EXPECTED_DB_NAME = (
  process.env.REPAIR_DEMO_DB_NAME || "test"
).trim();

// Exact classroom codes used by the ClassSphere demo seed.
const DEMO_CLASS_CODES = [
  "CSDS2601",
  "CSDB2602",
  "CSWD2603",
  "CSOS2604",
  "CSAI2605",
  "CSCN2606",
  "CSSE2607",
];

// Same assignment templates as seedDemo.js.
const ASSIGNMENT_TEMPLATES = [
  {
    title: "Concept Check",
    description: "Answer core concept questions and explain your reasoning.",
    maxMarks: 20,
    dueInCourseDays: 20,
    weight: 20,
  },
  {
    title: "Practical Exercise",
    description: "Complete practical tasks and submit your solution.",
    maxMarks: 30,
    dueInCourseDays: 45,
    weight: 30,
  },
  {
    title: "Mini Project",
    description: "Build a small project demonstrating the topics covered.",
    maxMarks: 50,
    dueInCourseDays: 70,
    weight: 50,
  },
];

// All event types are allowed by the ActivityEvent schema.
const ACTIVITY_TYPES = [
  "classroom_view",
  "assignment_list_view",
  "quiz_list_view",
  "announcement_list_view",
  "doubt_list_view",
  "resource_list_view",
  "resource_download",
];

const SCORE_PERCENTAGES = [42, 52, 61, 68, 75, 84, 93];

function makeSubmission(
  studentId,
  assignment,
  classIndex,
  studentIndex,
  assignmentIndex
) {
  // Deterministic values make repeated runs update the same records.
  const pattern =
    classIndex * 13 + studentIndex * 3 + assignmentIndex;

  const graded = pattern % 4 !== 1;

  const scorePercent =
    SCORE_PERCENTAGES[
      (classIndex + studentIndex * 2 + assignmentIndex) %
        SCORE_PERCENTAGES.length
    ];

  const marksObtained = Math.min(
    assignment.maxMarks,
    Math.round((assignment.maxMarks * scorePercent) / 100)
  );

  // Some submissions are late, some early and some on time.
  const dayOffset =
    pattern % 5 === 2 ? 2 : pattern % 3 === 0 ? -1 : 0;

  const submittedAt = new Date(
    assignment.dueDate.getTime() +
      dayOffset * DAY +
      (studentIndex + 1) * 60 * 1000
  );

  return {
    assignment: assignment._id,
    student: studentId,
    answerText: `Demo response for ${assignment.title}. I completed the required concepts and included examples.`,
    submittedAt,
    status: graded ? "graded" : "submitted",
    marksObtained: graded ? marksObtained : null,
    feedback: graded
      ? scorePercent >= 80
        ? "Excellent work. Clear explanation and good application."
        : "Good attempt. Review the feedback and strengthen your explanation."
      : "",
    gradedAt: graded
      ? new Date(submittedAt.getTime() + DAY)
      : null,
  };
}

function makeActivityDate(
  courseStartDate,
  courseDay,
  minuteOffset
) {
  return new Date(
    courseStartDate.getTime() +
      courseDay * DAY +
      minuteOffset * 60 * 1000
  );
}

async function repairDemoMlData() {
  let connectionOpened = false;

  try {
    // Explicit permission required before modifying demo data.
    if (process.env.REPAIR_DEMO_ML_DATA !== "true") {
      throw new Error(
        'Repair blocked. In PowerShell run: $env:REPAIR_DEMO_ML_DATA="true" before executing this script.'
      );
    }

    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from backend/.env."
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);
    connectionOpened = true;

    const actualDbName =
      mongoose.connection.db.databaseName;

    // Safety check: do not modify another database.
    if (actualDbName !== EXPECTED_DB_NAME) {
      throw new Error(
        `Database mismatch: connected to "${actualDbName}", expected "${EXPECTED_DB_NAME}". Nothing was changed.`
      );
    }

    console.log(`Connected to database: ${actualDbName}`);

    // Find only official ClassSphere demo accounts.
    const demoUsers = await User.find({
      email: /@demo\.classsphere\.test$/i,
    })
      .select("_id email role")
      .lean();

    const demoUsersById = new Map(
      demoUsers.map((user) => [
        String(user._id),
        user,
      ])
    );

    const demoTeachers = demoUsers.filter(
      (user) => user.role === "teacher"
    );

    const demoStudents = demoUsers.filter(
      (user) => user.role === "student"
    );

    if (
      demoTeachers.length === 0 ||
      demoStudents.length === 0
    ) {
      throw new Error(
        "Expected ClassSphere demo teacher and student accounts ending in @demo.classsphere.test. Nothing was changed."
      );
    }

    // Find all seven known demo classrooms.
    const foundClassrooms = await Classroom.find({
      classCode: {
        $in: DEMO_CLASS_CODES,
      },
    });

    const classroomsByCode = new Map(
      foundClassrooms.map((classroom) => [
        classroom.classCode,
        classroom,
      ])
    );

    const missingCodes = DEMO_CLASS_CODES.filter(
      (code) => !classroomsByCode.has(code)
    );

    if (missingCodes.length > 0) {
      throw new Error(
        `Missing expected demo classrooms: ${missingCodes.join(", ")}. Nothing was changed.`
      );
    }

    // Keep a predictable classroom order.
    const classrooms = DEMO_CLASS_CODES.map(
      (code) => classroomsByCode.get(code)
    );

    // Validate all classrooms BEFORE making any changes.
    // Keep only demo student IDs in a separate map.
    // Real/non-demo students are automatically skipped.
    const demoStudentIdsByClassroom = new Map();

    for (const classroom of classrooms) {
      const teacher = demoUsersById.get(
        String(classroom.teacher)
      );

      if (!teacher || teacher.role !== "teacher") {
        throw new Error(
          `Classroom ${classroom.classCode} is not owned by a known demo teacher. Nothing was changed.`
        );
      }

      if (
        !Array.isArray(classroom.students) ||
        classroom.students.length === 0
      ) {
        throw new Error(
          `Classroom ${classroom.classCode} has no students. Nothing was changed.`
        );
      }

      const demoStudentIds = classroom.students.filter(
        (studentId) => {
          const student = demoUsersById.get(
            String(studentId)
          );

          return Boolean(
            student && student.role === "student"
          );
        }
      );

      if (demoStudentIds.length === 0) {
        throw new Error(
          `No official demo students found in ${classroom.classCode}. Nothing was changed.`
        );
      }

      demoStudentIdsByClassroom.set(
        String(classroom._id),
        demoStudentIds
      );

      const skippedMembers =
        classroom.students.length -
        demoStudentIds.length;

      if (skippedMembers > 0) {
        console.log(
          `Will skip ${skippedMembers} non-demo member(s) in ${classroom.classCode}.`
        );
      }
    }

    console.log(
      `Validated ${classrooms.length} demo classrooms.`
    );

    console.log(
      "Only official demo students will receive generated submissions and activity events."
    );

    console.log(
      "No users, classrooms, non-demo student records, Cloudinary files, or unrelated collections will be deleted."
    );

    const now = new Date();

    let classroomsUpdated = 0;
    let assignmentsCreatedOrUpdated = 0;
    let submissionsCreatedOrUpdated = 0;
    let activityEventsInserted = 0;

    // Repair each classroom.
    for (
      let classIndex = 0;
      classIndex < classrooms.length;
      classIndex += 1
    ) {
      const classroom = classrooms[classIndex];

      // IMPORTANT: use only official demo student IDs.
      const studentIds =
        demoStudentIdsByClassroom.get(
          String(classroom._id)
        ) || [];

      // Ensure the course has enough historical days
      // for the full 90-day observation window.
      const existingStart = classroom.courseStartDate
        ? new Date(classroom.courseStartDate)
        : null;

      const existingIsUsable =
        existingStart &&
        !Number.isNaN(existingStart.getTime()) &&
        now.getTime() - existingStart.getTime() >=
          91 * DAY;

      const courseStartDate = existingIsUsable
        ? existingStart
        : new Date(
            now.getTime() -
              (120 + classIndex) * DAY
          );

      // This is a shared classroom timeline.
      classroom.courseStartDate = courseStartDate;

      await classroom.save();
      classroomsUpdated += 1;

      // Create or update the three known demo assignments.
      const assignments = [];

      for (const template of ASSIGNMENT_TEMPLATES) {
        const title =
          `${classroom.name} - ${template.title}`;

        const dueDate = new Date(
          courseStartDate.getTime() +
            (template.dueInCourseDays +
              (classIndex % 3)) *
              DAY
        );

        const assignment =
          await Assignment.findOneAndUpdate(
            {
              classroom: classroom._id,
              title,
            },
            {
              $set: {
                title,
                description: template.description,
                classroom: classroom._id,
                teacher: classroom.teacher,
                dueDate,
                maxMarks: template.maxMarks,
                weight: template.weight,
              },
            },
            {
              new: true,
              upsert: true,
              runValidators: true,
              setDefaultsOnInsert: true,
            }
          );

        assignments.push(assignment);
        assignmentsCreatedOrUpdated += 1;
      }

      // Upsert submissions only for demo students.
      // Existing attachment metadata is not overwritten.
      for (
        let assignmentIndex = 0;
        assignmentIndex < assignments.length;
        assignmentIndex += 1
      ) {
        const assignment = assignments[assignmentIndex];

        for (
          let studentIndex = 0;
          studentIndex < studentIds.length;
          studentIndex += 1
        ) {
          const studentId = studentIds[studentIndex];

          const submission = makeSubmission(
            studentId,
            assignment,
            classIndex,
            studentIndex,
            assignmentIndex
          );

          await Submission.updateOne(
            {
              assignment: assignment._id,
              student: studentId,
            },
            {
              $set: submission,
            },
            {
              upsert: true,
              runValidators: true,
            }
          );

          submissionsCreatedOrUpdated += 1;
        }
      }

      // Generate activity events on seven different course days.
      // These exact timestamps make reruns idempotent.
      const activityOperations = [];

      studentIds.forEach(
        (studentId, studentIndex) => {
          const activityDays = [
            3 + (studentIndex % 3),
            11 + (studentIndex % 4),
            22 + (classIndex % 5),
            36 + (studentIndex % 6),
            51 + (classIndex % 7),
            68 + (studentIndex % 5),
            84 - (classIndex % 4),
          ];

          activityDays.forEach(
            (courseDay, eventIndex) => {
              const occurredAt = makeActivityDate(
                courseStartDate,
                courseDay,
                eventIndex + 1
              );

              const eventType =
                ACTIVITY_TYPES[eventIndex];

              activityOperations.push({
                updateOne: {
                  filter: {
                    student: studentId,
                    classroom: classroom._id,
                    eventType,
                    sourceId: null,
                    occurredAt,
                  },
                  update: {
                    $setOnInsert: {
                      student: studentId,
                      classroom: classroom._id,
                      eventType,
                      sourceId: null,
                      occurredAt,
                    },
                  },
                  upsert: true,
                },
              });
            }
          );
        }
      );

      // Also record generated assignment submissions as activity.
      for (
        let assignmentIndex = 0;
        assignmentIndex < assignments.length;
        assignmentIndex += 1
      ) {
        const assignment = assignments[assignmentIndex];

        for (
          let studentIndex = 0;
          studentIndex < studentIds.length;
          studentIndex += 1
        ) {
          const studentId = studentIds[studentIndex];

          const submission = makeSubmission(
            studentId,
            assignment,
            classIndex,
            studentIndex,
            assignmentIndex
          );

          activityOperations.push({
            updateOne: {
              filter: {
                student: studentId,
                classroom: classroom._id,
                eventType: "assignment_submission",
                sourceId: assignment._id,
                occurredAt: submission.submittedAt,
              },
              update: {
                $setOnInsert: {
                  student: studentId,
                  classroom: classroom._id,
                  eventType: "assignment_submission",
                  sourceId: assignment._id,
                  occurredAt: submission.submittedAt,
                },
              },
              upsert: true,
            },
          });
        }
      }

      // Insert only missing activity events.
      if (activityOperations.length > 0) {
        const result = await ActivityEvent.bulkWrite(
          activityOperations,
          {
            ordered: false,
          }
        );

        activityEventsInserted +=
          result.upsertedCount || 0;
      }

      console.log(
        `Repaired ${classroom.classCode}: ${classroom.name} (${studentIds.length} demo students)`
      );
    }

    console.log("\nDEMO ML DATA REPAIR COMPLETE");
    console.log(`Database: ${actualDbName}`);
    console.log(`Classrooms updated: ${classroomsUpdated}`);

    console.log(
      `Assignments created/updated: ${assignmentsCreatedOrUpdated}`
    );

    console.log(
      `Submissions created/updated: ${submissionsCreatedOrUpdated}`
    );

    console.log(
      `New activity events inserted: ${activityEventsInserted}`
    );

    console.log("No documents were deleted.");

    console.log(
      "Run the teacher risk-predictions endpoint again to verify all six input features."
    );
  } catch (error) {
    console.error(
      "Demo ML data repair failed:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    if (
      connectionOpened &&
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.disconnect();
    }
  }
}

repairDemoMlData();
