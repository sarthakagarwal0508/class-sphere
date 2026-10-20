
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../src/models/User");
const Classroom = require("../src/models/Classroom");
const Assignment = require("../src/models/Assignment");
const Submission = require("../src/models/Submission");

const DEMO_PASSWORD_PREFIX = "CS-Demo-";
const demoUsers = [
  { name: "Analytics Demo Teacher", email: "demo.teacher@classsphere.example", role: "teacher" },
  { name: "Demo Student 1", email: "demo.student1@classsphere.example", role: "student" },
  { name: "Demo Student 2", email: "demo.student2@classsphere.example", role: "student" },
  { name: "Demo Student 3", email: "demo.student3@classsphere.example", role: "student" },
  { name: "Demo Student 4", email: "demo.student4@classsphere.example", role: "student" },
  { name: "Demo Student 5", email: "demo.student5@classsphere.example", role: "student" },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to configured MongoDB.");

  const users = {};

  for (const details of demoUsers) {
    const email = details.email.toLowerCase();
    let user = await User.findOne({ email });

    // Never overwrite an unrelated account.
    if (user && user.role !== details.role) {
      throw new Error(`Role mismatch for ${email}. Stopping safely.`);
    }

    const password = `${DEMO_PASSWORD_PREFIX}${crypto.randomBytes(9).toString("hex")}`;
    const passwordHash = await bcrypt.hash(password, 10);

    if (!user) {
      user = await User.create({
        ...details,
        email,
        password: passwordHash,
        isEmailVerified: true,
      });
    } else {
      // Only rotate credentials for these explicitly named demo accounts.
      user.password = passwordHash;
      user.isEmailVerified = true;
      await user.save();
    }

    users[details.role === "teacher" ? "teacher" : email] = user;
    details.temporaryPassword = password;
  }

  const teacher = users.teacher;
  const students = demoUsers
    .filter((u) => u.role === "student")
    .map((u) => users[u.email]);

  let classroom = await Classroom.findOne({ classCode: "ANALYTICSDEMO" });

  if (classroom && !classroom.teacher.equals(teacher._id)) {
    throw new Error("Class code ANALYTICSDEMO belongs to another teacher. Stopping safely.");
  }

  if (!classroom) {
    classroom = await Classroom.create({
      name: "Analytics Demo Classroom",
      description: "Demo data for testing ClassSphere learning analytics.",
      classCode: "ANALYTICSDEMO",
      teacher: teacher._id,
      students: students.map((student) => student._id),
    });
  } else {
    classroom.students = [
      ...new Set([
        ...classroom.students.map((id) => id.toString()),
        ...students.map((student) => student._id.toString()),
      ]),
    ];
    await classroom.save();
  }

  const assignmentSpecs = [
    { title: "Demo Assignment 1", maxMarks: 100, daysAgo: 10 },
    { title: "Demo Assignment 2", maxMarks: 50, daysAgo: 7 },
    { title: "Demo Assignment 3", maxMarks: 100, daysAgo: 3 },
    { title: "Demo Assignment 4", maxMarks: 20, daysAgo: -7 },
  ];

  const assignments = [];

  for (const spec of assignmentSpecs) {
    let assignment = await Assignment.findOne({
      classroom: classroom._id,
      title: spec.title,
    });

    if (!assignment) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - spec.daysAgo);

      assignment = await Assignment.create({
        title: spec.title,
        description: "Seeded assignment for analytics testing.",
        classroom: classroom._id,
        teacher: teacher._id,
        dueDate,
        maxMarks: spec.maxMarks,
      });
    }

    assignments.push(assignment);
  }

  // null means no submission. "submitted" means awaiting grading.
  const results = [
    ["graded", "graded", "submitted", null],
    ["graded", "submitted", null, null],
    ["graded", "graded", "graded", null],
    ["submitted", "graded", null, null],
    ["graded", null, "submitted", null],
  ];

  const marks = [
    [85, 42, null, null],
    [60, null, null, null],
    [45, 38, 91, null],
    [null, 34, null, null],
    [72, null, null, null],
  ];

  let createdSubmissions = 0;
  let updatedSubmissions = 0;

  for (let s = 0; s < students.length; s++) {
    for (let a = 0; a < assignments.length; a++) {
      const status = results[s][a];
      if (!status) continue;

      const assignment = assignments[a];
      const student = students[s];

      let submission = await Submission.findOne({
        assignment: assignment._id,
        student: student._id,
      });

      const payload = {
        assignment: assignment._id,
        student: student._id,
        answerText: `Demo answer from ${student.name}.`,
        submittedAt: new Date(),
        status,
        marksObtained: status === "graded" ? marks[s][a] : null,
        feedback: status === "graded" ? "Demo feedback for analytics." : "",
        gradedAt: status === "graded" ? new Date() : null,
      };

      if (submission) {
        Object.assign(submission, payload);
        await submission.save();
        updatedSubmissions++;
      } else {
        await Submission.create(payload);
        createdSubmissions++;
      }
    }
  }

  console.log("\n=== DEMO DATA READY ===");
  console.log("Classroom code: ANALYTICSDEMO");
  console.log("Classroom ID:", classroom._id.toString());
  console.log("Teacher ID:", teacher._id.toString());
  console.log("Student IDs:", students.map((s) => s._id.toString()).join(", "));
  console.log(`Submissions created: ${createdSubmissions}`);
  console.log(`Submissions refreshed: ${updatedSubmissions}`);

  console.log("\n=== TEMPORARY LOGIN CREDENTIALS ===");
  for (const details of demoUsers) {
    console.log(`${details.role.toUpperCase()} | ${details.email} | ${details.temporaryPassword}`);
  }

  console.log("\nSave these credentials securely. They will rotate on the next run.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
