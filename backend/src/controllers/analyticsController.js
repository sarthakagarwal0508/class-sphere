
const mongoose = require("mongoose");
const Classroom = require("../models/Classroom");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

// 1. Student overall analytics
const getStudentOverview = async (req, res) => {
  try {
    const studentId = req.user._id;

    const classrooms = await Classroom.find({
      students: studentId,
    }).select("_id");

    const classroomIds = classrooms.map((c) => c._id);

    const assignments = await Assignment.find({
      classroom: { $in: classroomIds },
    }).select("_id maxMarks");

    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
      student: studentId,
    }).select("assignment status marksObtained");

    const submissionMap = new Map(
      submissions.map((s) => [s.assignment.toString(), s])
    );

    let completed = 0;
    let graded = 0;
    let pending = 0;
    let marksObtained = 0;
    let maxMarksForGraded = 0;

    for (const assignment of assignments) {
      const submission = submissionMap.get(
        assignment._id.toString()
      );

      if (!submission) {
        pending++;
        continue;
      }

      completed++;

      if (submission.status === "graded") {
        graded++;
        marksObtained += submission.marksObtained ?? 0;
        maxMarksForGraded += assignment.maxMarks;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalClassrooms: classroomIds.length,
        totalAssignments: assignments.length,
        completedAssignments: completed,
        gradedAssignments: graded,
        pendingAssignments: pending,
        averagePercentage:
          maxMarksForGraded > 0
            ? Number(
                ((marksObtained / maxMarksForGraded) * 100).toFixed(2)
              )
            : null,
      },
    });
  } catch (error) {
    console.error("Student overview error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 2. Student classroom analytics
const getStudentClassroomAnalytics = async (req, res) => {
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
      students: req.user._id,
    }).select("name teacher");

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found or you are not enrolled.",
      });
    }

    const assignments = await Assignment.find({
      classroom: classroomId,
    }).select("title maxMarks dueDate");

    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
      student: req.user._id,
    }).select("assignment status marksObtained submittedAt gradedAt");

    const submissionMap = new Map(
      submissions.map((s) => [s.assignment.toString(), s])
    );

    let completed = 0;
    let graded = 0;
    let pending = 0;
    let marksObtained = 0;
    let maxMarksForGraded = 0;

    const assignmentDetails = assignments.map((assignment) => {
      const submission = submissionMap.get(
        assignment._id.toString()
      );

      if (!submission) {
        pending++;
      } else {
        completed++;

        if (submission.status === "graded") {
          graded++;
          marksObtained += submission.marksObtained ?? 0;
          maxMarksForGraded += assignment.maxMarks;
        }
      }

      return {
        assignmentId: assignment._id,
        title: assignment.title,
        maxMarks: assignment.maxMarks,
        dueDate: assignment.dueDate,
        status: submission?.status || "pending",
        marksObtained: submission?.marksObtained ?? null,
        submittedAt: submission?.submittedAt ?? null,
        gradedAt: submission?.gradedAt ?? null,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        classroom: {
          id: classroom._id,
          name: classroom.name,
        },
        totalAssignments: assignments.length,
        completedAssignments: completed,
        gradedAssignments: graded,
        pendingAssignments: pending,
        averagePercentage:
          maxMarksForGraded > 0
            ? Number(
                ((marksObtained / maxMarksForGraded) * 100).toFixed(2)
              )
            : null,
        assignments: assignmentDetails,
      },
    });
  } catch (error) {
    console.error("Student classroom analytics error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 3. Teacher classroom analytics
const getTeacherClassroomAnalytics = async (req, res) => {
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
    }).select("name students");

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found or you are not its teacher.",
      });
    }

    const assignments = await Assignment.find({
      classroom: classroomId,
    }).select("_id maxMarks");

    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
    }).select("student assignment status marksObtained");

    const totalPossibleSubmissions =
      classroom.students.length * assignments.length;

    const gradedSubmissions = submissions.filter(
      (s) => s.status === "graded"
    );

    const submittedStudentIds = new Set(
      submissions.map((s) => s.student.toString())
    );

    const studentPerformance = new Map();

    for (const studentId of classroom.students) {
      studentPerformance.set(studentId.toString(), {
        submittedAssignments: 0,
        gradedAssignments: 0,
        marksObtained: 0,
        maxMarksForGraded: 0,
      });
    }

    const assignmentMap = new Map(
      assignments.map((a) => [a._id.toString(), a])
    );

    for (const submission of submissions) {
      const performance = studentPerformance.get(
        submission.student.toString()
      );

      if (!performance) continue;

      performance.submittedAssignments++;

      if (submission.status === "graded") {
        const assignment = assignmentMap.get(
          submission.assignment.toString()
        );

        performance.gradedAssignments++;
        performance.marksObtained += submission.marksObtained ?? 0;
        performance.maxMarksForGraded += assignment?.maxMarks ?? 0;
      }
    }

    const totalSubmissions = submissions.length;
    const totalGraded = gradedSubmissions.length;

    return res.status(200).json({
      success: true,
      data: {
        classroom: {
          id: classroom._id,
          name: classroom.name,
        },
        totalStudents: classroom.students.length,
        totalAssignments: assignments.length,
        totalPossibleSubmissions,
        totalSubmissions,
        totalGradedSubmissions: totalGraded,
        pendingSubmissions: Math.max(
          0,
          totalPossibleSubmissions - totalSubmissions
        ),
        submissionRate:
          totalPossibleSubmissions > 0
            ? Number(
                ((totalSubmissions / totalPossibleSubmissions) * 100).toFixed(2)
              )
            : 0,
        averageGradedPercentage:
          gradedSubmissions.length > 0
            ? Number(
                (
                  gradedSubmissions.reduce((sum, s) => {
                    const assignment = assignmentMap.get(
                      s.assignment.toString()
                    );
                    return sum + (
                      assignment?.maxMarks > 0
                        ? ((s.marksObtained ?? 0) / assignment.maxMarks) * 100
                        : 0
                    );
                  }, 0) / gradedSubmissions.length
                ).toFixed(2)
              )
            : null,
      },
    });
  } catch (error) {
    console.error("Teacher classroom analytics error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 4. Teacher analytics for each student
const getTeacherStudentAnalytics = async (req, res) => {
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

    const assignments = await Assignment.find({
      classroom: classroomId,
    }).select("_id maxMarks");

    const assignmentIds = assignments.map((a) => a._id);

    const submissions = await Submission.find({
      assignment: { $in: assignmentIds },
    }).select("student assignment status marksObtained");

    const assignmentMap = new Map(
      assignments.map((a) => [a._id.toString(), a])
    );

    const studentData = classroom.students.map((student) => {
      const ownSubmissions = submissions.filter(
        (s) => s.student.toString() === student._id.toString()
      );

      const graded = ownSubmissions.filter(
        (s) => s.status === "graded"
      );

      let marksObtained = 0;
      let maxMarksForGraded = 0;

      for (const submission of graded) {
        const assignment = assignmentMap.get(
          submission.assignment.toString()
        );

        if (assignment) {
          marksObtained += submission.marksObtained ?? 0;
          maxMarksForGraded += assignment.maxMarks;
        }
      }

      return {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
        },
        totalAssignments: assignments.length,
        submittedAssignments: ownSubmissions.length,
        gradedAssignments: graded.length,
        pendingAssignments: Math.max(
          0,
          assignments.length - ownSubmissions.length
        ),
        averagePercentage:
          maxMarksForGraded > 0
            ? Number(
                ((marksObtained / maxMarksForGraded) * 100).toFixed(2)
              )
            : null,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        classroom: {
          id: classroom._id,
          name: classroom.name,
        },
        students: studentData,
      },
    });
  } catch (error) {
    console.error("Teacher student analytics error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  getStudentOverview,
  getStudentClassroomAnalytics,
  getTeacherClassroomAnalytics,
  getTeacherStudentAnalytics,
};
