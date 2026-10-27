/**
 * ClassSphere referential-integrity audit/cleanup.
 * Default: dry-run only. Apply destructive database changes only with --apply.
 * Run against the intended database after taking a backup.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Classroom = require("../src/models/Classroom");
const Assignment = require("../src/models/Assignment");
const Submission = require("../src/models/Submission");
const Quiz = require("../src/models/Quiz");
const QuizAttempt = require("../src/models/QuizAttempt");
const StudentRiskProfile = require("../src/models/StudentRiskProfile");
const StudyMaterial = require("../src/models/StudyMaterial");
const Announcement = require("../src/models/Announcement");
const Notification = require("../src/models/Notification");
const Doubt = require("../src/models/Doubt");

const APPLY = process.argv.includes("--apply");
const id = (value) => (value?._id || value)?.toString?.() || "";
const add = (report, label, count) => {
  report[label] = count;
  console.log(`${APPLY ? "[APPLY]" : "[DRY RUN]"} ${label}: ${count}`);
};

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to database: ${mongoose.connection.name}`);
  console.log(APPLY ? "Destructive cleanup ENABLED." : "Dry-run only; no records will be changed.");

  const report = {};
  const [users, classrooms, assignments, submissions, quizzes, attempts, profiles, materials, announcements, notifications, doubts] = await Promise.all([
    User.find({}).select("_id role").lean(),
    Classroom.find({}).select("_id teacher students").lean(),
    Assignment.find({}).select("_id classroom teacher").lean(),
    Submission.find({}).select("_id assignment student").lean(),
    Quiz.find({}).select("_id classroom teacher").lean(),
    QuizAttempt.find({}).select("_id quiz student").lean(),
    StudentRiskProfile.find({}).select("_id student classroom updatedBy").lean(),
    StudyMaterial.find({}).select("_id classroom uploadedBy").lean(),
    Announcement.find({}).select("_id classroom teacher").lean(),
    Notification.find({}).select("_id recipient classroom announcement").lean(),
    Doubt.find({}).select("_id classroom student replies").lean(),
  ]);

  const userMap = new Map(users.map((u) => [id(u), u]));
  const classroomMap = new Map(classrooms.map((c) => [id(c), c]));
  const assignmentMap = new Map(assignments.map((a) => [id(a), a]));
  const quizMap = new Map(quizzes.map((q) => [id(q), q]));
  const announcementMap = new Map(announcements.map((a) => [id(a), a]));

  const validTeacher = (userId) => userMap.get(id(userId))?.role === "teacher";
  const validStudent = (userId) => userMap.get(id(userId))?.role === "student";
  const enrolled = (classroom, studentId) => (classroom?.students || []).some((x) => id(x) === id(studentId));
  const invalidClassroomIds = new Set(classrooms.filter((c) => !validTeacher(c.teacher)).map(id));

  const invalidStudentRefs = [];
  for (const classroom of classrooms) {
    const invalid = (classroom.students || []).filter((studentId) => !validStudent(studentId));
    if (invalid.length) invalidStudentRefs.push({ classroomId: id(classroom), invalid });
  }
  add(report, "classrooms with missing/non-teacher owner", invalidClassroomIds.size);
  add(report, "classrooms containing invalid student references", invalidStudentRefs.length);

  const badAssignmentIds = new Set(assignments.filter((a) => {
    const c = classroomMap.get(id(a.classroom));
    return !c || invalidClassroomIds.has(id(c)) || id(c.teacher) !== id(a.teacher) || !validTeacher(a.teacher);
  }).map(id));
  add(report, "orphaned/mismatched assignments", badAssignmentIds.size);

  const badSubmissionIds = new Set(submissions.filter((s) => {
    const a = assignmentMap.get(id(s.assignment));
    const c = a && classroomMap.get(id(a.classroom));
    // Keep historical submissions for students who left a classroom; they are
    // not orphaned if both the student and assignment still exist.
    return !a || badAssignmentIds.has(id(a)) || !validStudent(s.student) || !c;
  }).map(id));
  add(report, "orphaned submissions", badSubmissionIds.size);

  const badQuizIds = new Set(quizzes.filter((q) => {
    const c = classroomMap.get(id(q.classroom));
    return !c || invalidClassroomIds.has(id(c)) || !validTeacher(q.teacher) || id(c.teacher) !== id(q.teacher);
  }).map(id));
  add(report, "orphaned/mismatched quizzes", badQuizIds.size);

  const badAttemptIds = new Set(attempts.filter((a) => {
    const q = quizMap.get(id(a.quiz));
    const c = q && classroomMap.get(id(q.classroom));
    // Keep historical attempts for valid users even if they later leave a class.
    return !q || badQuizIds.has(id(q)) || !validStudent(a.student) || !c;
  }).map(id));
  add(report, "orphaned quiz attempts", badAttemptIds.size);

  const badProfileIds = new Set(profiles.filter((p) => {
    const c = classroomMap.get(id(p.classroom));
    return !c || invalidClassroomIds.has(id(c)) || !validStudent(p.student) || !validTeacher(p.updatedBy) || id(c.teacher) !== id(p.updatedBy);
  }).map(id));
  add(report, "orphaned student risk profiles", badProfileIds.size);

  const badMaterialIds = new Set(materials.filter((m) => {
    const c = classroomMap.get(id(m.classroom));
    return !c || invalidClassroomIds.has(id(c)) || !validTeacher(m.uploadedBy) || id(c.teacher) !== id(m.uploadedBy);
  }).map(id));
  add(report, "orphaned/mismatched study materials", badMaterialIds.size);

  const badAnnouncementIds = new Set(announcements.filter((a) => {
    const c = classroomMap.get(id(a.classroom));
    return !c || invalidClassroomIds.has(id(c)) || !validTeacher(a.teacher) || id(c.teacher) !== id(a.teacher);
  }).map(id));
  add(report, "orphaned/mismatched announcements", badAnnouncementIds.size);

  const badNotificationIds = new Set(notifications.filter((n) => {
    const c = classroomMap.get(id(n.classroom));
    const a = announcementMap.get(id(n.announcement));
    return !userMap.has(id(n.recipient)) || !c || invalidClassroomIds.has(id(c)) || !a || badAnnouncementIds.has(id(a)) || id(a.classroom) !== id(n.classroom);
  }).map(id));
  add(report, "orphaned notifications", badNotificationIds.size);

  const badDoubtIds = new Set(doubts.filter((d) => {
    const c = classroomMap.get(id(d.classroom));
    return !c || invalidClassroomIds.has(id(c)) || !validStudent(d.student);
  }).map(id));
  add(report, "orphaned doubts", badDoubtIds.size);

  const summary = Object.values(report).reduce((sum, n) => sum + n, 0);
  console.log(`\nTotal reported issue counts (categories can overlap): ${summary}`);

  if (!APPLY) {
    console.log("\nNo changes made. Review the report and take a database backup, then rerun with --apply to delete the identified orphan records and remove invalid classroom student references.");
    return;
  }

  // Delete dependent records first. These deletions are intentionally explicit.
  await Submission.deleteMany({ _id: { $in: [...badSubmissionIds] } });
  await QuizAttempt.deleteMany({ _id: { $in: [...badAttemptIds] } });
  await StudentRiskProfile.deleteMany({ _id: { $in: [...badProfileIds] } });
  await StudyMaterial.deleteMany({ _id: { $in: [...badMaterialIds] } });
  await Notification.deleteMany({ _id: { $in: [...badNotificationIds] } });
  await Doubt.deleteMany({ _id: { $in: [...badDoubtIds] } });
  await Announcement.deleteMany({ _id: { $in: [...badAnnouncementIds] } });
  await Quiz.deleteMany({ _id: { $in: [...badQuizIds] } });
  await Assignment.deleteMany({ _id: { $in: [...badAssignmentIds] } });

  for (const classroom of invalidStudentRefs) {
    const classroomDoc = await Classroom.findById(classroom.classroomId);
    if (classroomDoc) {
      const invalidIds = new Set(classroom.invalid.map(id));
      classroomDoc.students = classroomDoc.students.filter((studentId) => !invalidIds.has(id(studentId)));
      await classroomDoc.save();
    }
  }

  // A classroom without a valid teacher cannot be safely retained.
  await Classroom.deleteMany({ _id: { $in: [...invalidClassroomIds] } });
  console.log("Cleanup complete. Cloudinary files referenced by deleted StudyMaterial records may need separate asset cleanup; this script does not delete remote assets.");
}

main().catch((error) => {
  console.error("Orphan-data audit failed:", error.message);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect().catch(() => {});
});
