
const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");
const Classroom = require("../models/Classroom");

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

module.exports = {
  createAssignment,
  getAssignments,
};
