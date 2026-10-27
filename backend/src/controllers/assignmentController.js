const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const Assignment = require("../models/Assignment");
const Classroom = require("../models/Classroom");
const Submission = require("../models/Submission");
const cloudinary = require("../config/cloudinary");

// Upload assignment PDF to authenticated Cloudinary storage.
const uploadAssignmentPdfToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const publicId = `classsphere/assignments/${randomUUID()}.pdf`;

    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          type: "authenticated",
          public_id: publicId,
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });

const deleteAssignmentPdfFromCloudinary = async (publicId) =>
  cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
    type: "authenticated",
  });

// Return attachment metadata and a protected API URL.
// Never expose the internal Cloudinary public ID in list responses.
const assignmentForResponse = (assignment) => {
  const result = assignment.toObject
    ? assignment.toObject()
    : { ...assignment };

  if (result.attachment) {
    delete result.attachment.cloudinaryPublicId;
    result.attachmentDownloadUrl =
      `/api/assignments/${result._id}/attachment`;
  }

  return result;
};

// POST /classrooms/:id/assignments
const createAssignment = async (req, res) => {
  let uploadedPublicId;

  try {
    const { id: classroomId } = req.params;
    const {
      title,
      description = "",
      dueDate,
      maxMarks,
    } = req.body;

    // Multipart form fields arrive as strings.
    // JSON clients may send maxMarks as a number.
    const parsedMaxMarks =
      typeof maxMarks === "number"
        ? maxMarks
        : typeof maxMarks === "string" &&
            maxMarks.trim() !== ""
          ? Number(maxMarks)
          : NaN;

    if (!mongoose.isValidObjectId(classroomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

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

    if (
      typeof description !== "string" ||
      description.trim().length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must not exceed 5000 characters.",
      });
    }

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

    if (
      !Number.isFinite(parsedMaxMarks) ||
      parsedMaxMarks < 1 ||
      parsedMaxMarks > 10000
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum marks must be a number between 1 and 10000.",
      });
    }

    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    if (
      String(classroom.teacher) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the classroom teacher can create assignments.",
      });
    }

    let attachment;

    // PDF is optional. Old JSON-only requests continue to work.
    if (req.file) {
      // Basic PDF signature validation.
      if (req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
        return res.status(400).json({
          success: false,
          message: "The uploaded file is not a valid PDF.",
        });
      }

      const uploaded = await uploadAssignmentPdfToCloudinary(
        req.file.buffer
      );

      uploadedPublicId = uploaded.public_id;

      attachment = {
        cloudinaryPublicId: uploaded.public_id,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: "application/pdf",
      };
    }

    const assignment = await Assignment.create({
      title: title.trim(),
      description: description.trim(),
      classroom: classroom._id,
      teacher: req.user._id,
      dueDate: parsedDueDate,
      maxMarks: parsedMaxMarks,
      ...(attachment ? { attachment } : {}),
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully.",
      data: {
        assignment: assignmentForResponse(assignment),
      },
    });
  } catch (error) {
    // If the PDF uploaded successfully but MongoDB creation failed,
    // attempt to remove the newly uploaded Cloudinary file.
    if (uploadedPublicId) {
      try {
        await deleteAssignmentPdfFromCloudinary(uploadedPublicId);
      } catch (cleanupError) {
        console.error(
          "Assignment PDF cleanup failed:",
          cleanupError.message
        );
      }
    }

    console.error("Create assignment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// GET /classrooms/:id/assignments
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
      String(classroom.teacher) === String(req.user._id);

    const isStudent = classroom.students.some(
      (studentId) =>
        String(studentId) === String(req.user._id)
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
        assignments: assignments.map(assignmentForResponse),
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

// GET /assignments/:id/attachment
// View/download PDF only for a classroom member.
const downloadAssignmentAttachment = async (req, res) => {
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

    if (!assignment.attachment?.cloudinaryPublicId) {
      return res.status(404).json({
        success: false,
        message: "This assignment does not have a PDF attachment.",
      });
    }

    const classroom = await Classroom.findById(
      assignment.classroom
    );

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    const isTeacher =
      String(classroom.teacher) === String(req.user._id);

    const isStudent = classroom.students.some(
      (studentId) =>
        String(studentId) === String(req.user._id)
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this assignment PDF.",
      });
    }

    const signedUrl = cloudinary.utils.private_download_url(
      assignment.attachment.cloudinaryPublicId,
      "pdf",
      {
        resource_type: "raw",
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 60,
        attachment: false,
      }
    );

    const fileResponse = await fetch(signedUrl);

    if (!fileResponse.ok) {
      console.error(
        "Cloudinary assignment PDF status:",
        fileResponse.status
      );

      return res.status(502).json({
        success: false,
        message:
          "Unable to retrieve the assignment PDF from cloud storage.",
      });
    }

    const fileBuffer = Buffer.from(
      await fileResponse.arrayBuffer()
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", fileBuffer.length);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "private, no-store");

    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error(
      "Download assignment PDF error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve assignment PDF.",
    });
  }
};

// POST /assignments/:id/submit
const submitAssignment = async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    const {
      answerText = "",
      submissionUrl = "",
    } = req.body;

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
        message:
          "Submission URL must be a string of at most 2048 characters.",
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

    const classroom = await Classroom.findById(
      assignment.classroom
    );

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    const isMember = classroom.students.some(
      (studentId) =>
        String(studentId) === String(req.user._id)
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

// GET /assignments/:id/submissions
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

    if (
      String(assignment.teacher) !== String(req.user._id)
    ) {
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
    console.error(
      "Get assignment submissions error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// PATCH /assignments/:assignmentId/submissions/:submissionId/grade
const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const {
      marksObtained,
      feedback = "",
    } = req.body;

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

    if (
      String(assignment.teacher) !== String(req.user._id)
    ) {
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

// GET /assignments/:id/my-submission
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

    const classroom = await Classroom.findById(
      assignment.classroom
    );

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    const isMember = classroom.students.some(
      (studentId) =>
        String(studentId) === String(req.user._id)
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
          ...(assignment.attachment
            ? {
                attachment: {
                  originalName:
                    assignment.attachment.originalName,
                  fileSize: assignment.attachment.fileSize,
                  mimeType: assignment.attachment.mimeType,
                },
                attachmentDownloadUrl:
                  `/api/assignments/${assignment._id}/attachment`,
              }
            : {}),
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
  downloadAssignmentAttachment,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getMySubmission,
};