
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../src/models/User");
const Classroom = require("../src/models/Classroom");
const Assignment = require("../src/models/Assignment");
const Submission = require("../src/models/Submission");
const Announcement = require("../src/models/Announcement");
const Notification = require("../src/models/Notification");
const StudyMaterial = require("../src/models/StudyMaterial");
const StudentRiskProfile = require("../src/models/StudentRiskProfile");

const DEMO_PASSWORD = "Demo@12345";
const DAY = 24 * 60 * 60 * 1000;

async function seedDemo() {
  try {
    if (process.env.ALLOW_DATABASE_RESET !== "true") {
      throw new Error("Reset blocked. Set ALLOW_DATABASE_RESET=true only when ready.");
    }

    if (!process.env.MONGODB_URI || !process.env.RESET_DB_NAME) {
      throw new Error("MONGODB_URI and RESET_DB_NAME are required.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const actualDbName = mongoose.connection.db.databaseName;
    const expectedDbName = process.env.RESET_DB_NAME.trim();

    if (actualDbName !== expectedDbName) {
      throw new Error(
        `Database mismatch: connected to "${actualDbName}", expected "${expectedDbName}". Nothing was deleted.`
      );
    }

    console.log(`Connected to existing database: ${actualDbName}`);

    // Clear dependent records first.
    const modelsToClear = [
      Notification,
      Submission,
      Announcement,
      Assignment,
      StudyMaterial,
      StudentRiskProfile,
      Classroom,
      User,
    ];

    for (const Model of modelsToClear) {
      const result = await Model.deleteMany({});
      console.log(`${Model.modelName}: deleted ${result.deletedCount}`);
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const teacherSeed = [
      ["Aarav Sharma", "aarav.sharma"],
      ["Priya Verma", "priya.verma"],
      ["Rahul Mehta", "rahul.mehta"],
      ["Neha Kapoor", "neha.kapoor"],
    ];

    const studentSeed = [
      ["Ananya Gupta", "ananya.gupta"],
      ["Rohan Singh", "rohan.singh"],
      ["Ishita Patel", "ishita.patel"],
      ["Kabir Jain", "kabir.jain"],
      ["Meera Joshi", "meera.joshi"],
      ["Arjun Kumar", "arjun.kumar"],
      ["Diya Agarwal", "diya.agarwal"],
      ["Vivaan Shah", "vivaan.shah"],
      ["Sara Khan", "sara.khan"],
      ["Aditya Verma", "aditya.verma"],
      ["Aditi Mishra", "aditi.mishra"],
      ["Kunal Bansal", "kunal.bansal"],
      ["Tanya Roy", "tanya.roy"],
      ["Dev Malhotra", "dev.malhotra"],
      ["Nisha Yadav", "nisha.yadav"],
    ];

    const teachers = await User.insertMany(
      teacherSeed.map(([name, handle]) => ({
        name,
        email: `teacher.${handle}@demo.classsphere.test`,
        password: passwordHash,
        role: "teacher",
        isEmailVerified: true,
      }))
    );

    const students = await User.insertMany(
      studentSeed.map(([name, handle]) => ({
        name,
        email: `student.${handle}@demo.classsphere.test`,
        password: passwordHash,
        role: "student",
        isEmailVerified: true,
      }))
    );

    const classroomSpecs = [
      { name: "Data Structures & Algorithms", subject: "Computer Science", section: "Semester 3 - A", teacher: 0, students: [0, 1, 2, 3, 4, 5, 6], code: "CSDS2601" },
      { name: "Database Management Systems", subject: "DBMS", section: "Semester 3 - A", teacher: 1, students: [2, 3, 4, 5, 7, 8, 9], code: "CSDB2602" },
      { name: "Full Stack Web Development", subject: "Web Development", section: "Semester 3 - B", teacher: 2, students: [0, 5, 6, 7, 8, 10, 11], code: "CSWD2603" },
      { name: "Operating Systems", subject: "Computer Science", section: "Semester 3 - A", teacher: 0, students: [1, 3, 6, 9, 10, 12, 13], code: "CSOS2604" },
      { name: "Artificial Intelligence Fundamentals", subject: "Artificial Intelligence", section: "Semester 3 - B", teacher: 3, students: [2, 4, 7, 8, 11, 12, 14], code: "CSAI2605" },
      { name: "Computer Networks", subject: "Networking", section: "Semester 4 - A", teacher: 1, students: [0, 1, 5, 9, 10, 13, 14], code: "CSCN2606" },
      { name: "Software Engineering", subject: "Software Engineering", section: "Semester 4 - B", teacher: 2, students: [2, 3, 6, 7, 11, 12, 14], code: "CSSE2607" },
    ];

    const classrooms = await Classroom.insertMany(
      classroomSpecs.map((spec) => ({
        name: spec.name,
        description: `ClassSphere demo classroom for ${spec.name}. Explore announcements, assignments, submissions, and learning progress.`,
        subject: spec.subject,
        semesterSection: spec.section,
        classCode: spec.code,
        teacher: teachers[spec.teacher]._id,
        students: spec.students.map((i) => students[i]._id),
      }))
    );

    const now = new Date();
    const assignmentTemplates = [
      { title: "Concept Check", description: "Answer core concept questions and explain your reasoning.", maxMarks: 20, dueInDays: 5 },
      { title: "Practical Exercise", description: "Complete practical tasks and submit your solution.", maxMarks: 30, dueInDays: 9 },
      { title: "Mini Project", description: "Build a small project demonstrating the topics covered.", maxMarks: 50, dueInDays: 14 },
    ];

    const assignmentsToCreate = [];

    classrooms.forEach((classroom, i) => {
      assignmentTemplates.forEach((template, j) => {
        assignmentsToCreate.push({
          title: `${classroom.name} - ${template.title}`,
          description: template.description,
          classroom: classroom._id,
          teacher: teachers[classroomSpecs[i].teacher]._id,
          dueDate: new Date(now.getTime() + (template.dueInDays + i % 3) * DAY),
          maxMarks: template.maxMarks,
        });
      });
    });

    const assignments = await Assignment.insertMany(assignmentsToCreate);

    const submissionsToCreate = [];

    assignments.forEach((assignment, assignmentIndex) => {
      const classroom = classrooms.find((c) => c._id.equals(assignment.classroom));

      classroom.students.forEach((studentId, studentIndex) => {
        if ((studentIndex + assignmentIndex) % 4 === 0) return;

        const graded = (studentIndex + assignmentIndex) % 3 !== 0;
        const marks = Math.min(
          assignment.maxMarks,
          Math.round(assignment.maxMarks * (0.55 + ((studentIndex + assignmentIndex) % 5) * 0.09))
        );

        submissionsToCreate.push({
          assignment: assignment._id,
          student: studentId,
          answerText: `Demo response for ${assignment.title}. I completed the required concepts and included examples.`,
          submittedAt: new Date(now.getTime() - ((studentIndex % 6) + 1) * DAY),
          status: graded ? "graded" : "submitted",
          marksObtained: graded ? marks : null,
          feedback: graded
            ? marks / assignment.maxMarks >= 0.8
              ? "Excellent work. Clear explanation and good application."
              : "Good attempt. Review the feedback and strengthen your explanation."
            : "",
          gradedAt: graded ? new Date(now.getTime() - (studentIndex % 3) * DAY) : null,
        });
      });
    });

    await Submission.insertMany(submissionsToCreate);

    const announcementTemplates = [
      {
        title: "Welcome to your classroom",
        content: "Welcome to ClassSphere! Check this classroom regularly for resources, assignments, and important updates.",
      },
      {
        title: "Weekly learning plan",
        content: "Focus on core concepts, complete the practical exercise, and raise questions during class discussion.",
      },
    ];

    const announcementsToCreate = [];

    classrooms.forEach((classroom, i) => {
      announcementTemplates.forEach((announcement) => {
        announcementsToCreate.push({
          ...announcement,
          classroom: classroom._id,
          teacher: teachers[classroomSpecs[i].teacher]._id,
        });
      });
    });

    const announcements = await Announcement.insertMany(announcementsToCreate);
    const notificationsToCreate = [];

    announcements.forEach((announcement) => {
      const classroom = classrooms.find((c) => c._id.equals(announcement.classroom));

      classroom.students.forEach((studentId, i) => {
        notificationsToCreate.push({
          recipient: studentId,
          classroom: classroom._id,
          announcement: announcement._id,
          title: announcement.title,
          message: `New update posted in ${classroom.name}.`,
          isRead: i % 4 === 0,
        });
      });
    });

    await Notification.insertMany(notificationsToCreate);

    // Synthetic ML profiles for feature demonstration only.
    const codeModules = ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG"];
    const codePresentations = ["2013B", "2013J", "2014B", "2014J"];
    const regions = [
      "East Anglian Region", "East Midlands Region", "Ireland",
      "London Region", "North Region", "North Western Region",
      "Scotland", "South East Region", "South Region",
      "South West Region", "Wales", "West Midlands Region",
      "Yorkshire Region",
    ];
    const educationLevels = [
      "No Formal quals", "Lower Than A Level",
      "A Level or Equivalent", "HE Qualification",
      "Post Graduate Qualification",
    ];
    const imdBands = [
      "0-10", "10-20", "20-30", "30-40", "40-50",
      "50-60", "60-70", "70-80", "80-90", "90-100", "unknown",
    ];
    const ageBands = ["0-35", "35-55", "55<="];
    const riskProfiles = [];

    classrooms.forEach((classroom, classIndex) => {
      classroom.students.forEach((studentId, studentIndex) => {
        riskProfiles.push({
          student: studentId,
          classroom: classroom._id,
          numOfPrevAttempts: (studentIndex + classIndex) % 3,
          studiedCredits: 30 + ((studentIndex + classIndex) % 5) * 10,
          dateRegistration: 202510 + ((studentIndex + classIndex) % 8),
          dateUnregistration: null,
          totalClicks: 80 + studentIndex * 17 + classIndex * 9,
          activeDays: 8 + ((studentIndex + classIndex) % 18),
          resourcesVisited: 4 + ((studentIndex * 2 + classIndex) % 12),
          clicksLast30Days: 15 + ((studentIndex * 7 + classIndex * 3) % 60),
          codeModule: codeModules[(studentIndex + classIndex) % codeModules.length],
          codePresentation: codePresentations[(studentIndex + classIndex) % codePresentations.length],
          gender: (studentIndex + classIndex) % 2 === 0 ? "F" : "M",
          region: regions[(studentIndex + classIndex) % regions.length],
          highestEducation: educationLevels[(studentIndex + classIndex) % educationLevels.length],
          imdBand: imdBands[(studentIndex + classIndex) % imdBands.length],
          ageBand: ageBands[(studentIndex + classIndex) % ageBands.length],
          disability: (studentIndex + classIndex) % 9 === 0 ? "Y" : "N",
          updatedBy: teachers[classIndex % teachers.length]._id,
        });
      });
    });

    await StudentRiskProfile.insertMany(riskProfiles);

    // Leave StudyMaterial empty for actual teacher uploads.
    console.log("\nSEED COMPLETE");
    console.log(`Database: ${actualDbName}`);
    console.log(`Teachers: ${teachers.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Classrooms: ${classrooms.length}`);
    console.log(`Assignments: ${assignments.length}`);
    console.log(`Submissions: ${submissionsToCreate.length}`);
    console.log(`Announcements: ${announcements.length}`);
    console.log(`Notifications: ${notificationsToCreate.length}`);
    console.log(`Synthetic risk profiles: ${riskProfiles.length}`);
    console.log("Study materials: 0");
    console.log(`Demo password for all accounts: ${DEMO_PASSWORD}`);

    teachers.forEach((u) => console.log(`TEACHER ${u.email}`));
    students.forEach((u) => console.log(`STUDENT ${u.email}`));
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

seedDemo();
