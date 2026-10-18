
const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Classroom = require("../models/Classroom");
const Submission = require("../models/Submission");

const createAssignment = async (req, res) => {
  try {
    const { id: classroomId } = req.params;
    const { title, description = "", dueDate, maxMarks } = req.body;

    // Validate classroom ID
    if (!mongoose.isValidObjectId(classroomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    // Validate title
    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      title.trim().length > 150
    ) {
      return res.status(400).json({
        success: false,
        message: "Title must be between 3 and 150 characters.",
      });
    }

    // Validate description
    if (
      typeof description !== "string" ||
      description.trim().length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must not exceed 5000 characters.",
      });
    }

    // Validate deadline
    if (
      typeof dueDate !== "string" ||
      dueDate.trim() === "" ||
      !Number.isFinite(Date.parse(dueDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid due date is required.",
      });
    }

    const parsedDueDate = new Date(dueDate);

    if (parsedDueDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date must be in the future.",
      });
    }

    // Validate maximum marks
    if (
      typeof maxMarks !== "number" ||
      !Number.isFinite(maxMarks) ||
      maxMarks < 1 ||
      maxMarks > 10000
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum marks must be a number between 1 and 10000.",
      });
    }

    // Find classroom
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    // Only the classroom's own teacher can create assignments
    if (classroom.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the classroom teacher can create assignments.",
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      title: title.trim(),
      description: description.trim(),
      classroom: classroom._id,
      teacher: req.user._id,
      dueDate: parsedDueDate,
      maxMarks,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully.",
      data: {
        assignment,
      },
    });
  } catch (error) {
    console.error("Create assignment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // get assignmrent
 
const getAssignments = async (req, res) => {
  try {
    const { id: classroomId } = req.params;

    if (!mongoose.isValidObjectId(classroomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    const isTeacher =
      classroom.teacher.toString() === req.user._id.toString();

    const isStudent = classroom.students.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these assignments.",
      });
    }

    const assignments = await Assignment.find({
      classroom: classroomId,
    })
      .populate("teacher", "name email")
      .sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: {
        assignments,
      },
    });
  } catch (error) {
    console.error("Get assignments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // assignment submission 

const submitAssignment = async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    const { answerText = "", submissionUrl = "" } = req.body;

    if (!mongoose.isValidObjectId(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    if (
      typeof answerText !== "string" ||
      answerText.trim().length > 10000
    ) {
      return res.status(400).json({
        success: false,
        message: "Answer must be a string of at most 10000 characters.",
      });
    }

    if (
      typeof submissionUrl !== "string" ||
      submissionUrl.trim().length > 2048
    ) {
      return res.status(400).json({
        success: false,
        message: "Submission URL must be a string of at most 2048 characters.",
      });
    }

    if (!answerText.trim() && !submissionUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Provide an answer or a submission URL.",
      });
    }

    if (
      submissionUrl.trim() &&
      !/^https?:\/\/\S+$/i.test(submissionUrl.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid HTTP or HTTPS submission URL.",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    const classroom = await Classroom.findById(assignment.classroom);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    const isMember = classroom.students.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Join the classroom before submitting assignments.",
      });
    }

    if (new Date() > assignment.dueDate) {
      return res.status(400).json({
        success: false,
        message: "The assignment deadline has passed.",
      });
    }

    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    if (submission && submission.status === "graded") {
      return res.status(400).json({
        success: false,
        message: "This submission has already been graded.",
      });
    }

    if (!submission) {
      submission = new Submission({
        assignment: assignmentId,
        student: req.user._id,
      });
    }

    submission.answerText = answerText.trim();
    submission.submissionUrl = submissionUrl.trim();
    submission.submittedAt = new Date();
    submission.status = "submitted";

    await submission.save();

    return res.status(201).json({
      success: true,
      message: "Assignment submitted successfully.",
      data: {
        submission,
      },
    });
  } catch (error) {
    console.error("Submit assignment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// get assignment submission of students 

const getAssignmentSubmissions = async (req, res) => {
  try {
    const { id: assignmentId } = req.params;

    if (!mongoose.isValidObjectId(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the assignment teacher can view submissions.",
      });
    }

    const submissions = await Submission.find({
      assignment: assignmentId,
    })
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: {
        submissions,
      },
    });
  } catch (error) {
    console.error("Get assignment submissions error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // grading 
 
const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { marksObtained, feedback = "" } = req.body;

    if (
      !mongoose.isValidObjectId(assignmentId) ||
      !mongoose.isValidObjectId(submissionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment or submission ID.",
      });
    }

    if (
      typeof marksObtained !== "number" ||
      !Number.isFinite(marksObtained) ||
      marksObtained < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Marks must be a non-negative number.",
      });
    }

    if (
      typeof feedback !== "string" ||
      feedback.trim().length > 3000
    ) {
      return res.status(400).json({
        success: false,
        message: "Feedback must not exceed 3000 characters.",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the assignment teacher can grade submissions.",
      });
    }

    if (marksObtained > assignment.maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks cannot exceed ${assignment.maxMarks}.`,
      });
    }

    const submission = await Submission.findOne({
      _id: submissionId,
      assignment: assignmentId,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found for this assignment.",
      });
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback.trim();
    submission.status = "graded";
    submission.gradedAt = new Date();

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Submission graded successfully.",
      data: {
        submission,
      },
    });
  } catch (error) {
    console.error("Grade submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// see grading by student

const getMySubmission = async (req, res) => {
  try {
    const { id: assignmentId } = req.params;

    if (!mongoose.isValidObjectId(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID.",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    const classroom = await Classroom.findById(assignment.classroom);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    const isMember = classroom.students.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this classroom.",
      });
    }

    const submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    return res.status(200).json({
      success: true,
      data: {
        assignment: {
          _id: assignment._id,
          title: assignment.title,
          dueDate: assignment.dueDate,
          maxMarks: assignment.maxMarks,
        },
        submission,
      },
    });
  } catch (error) {
    console.error("Get my submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getMySubmission,
};
