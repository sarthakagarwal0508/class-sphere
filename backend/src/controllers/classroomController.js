
const crypto = require("crypto");
const Classroom = require("../models/Classroom");

const generateClassCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

  // create classroom
const createClassroom = async (req, res) => {
  try {
    const { name, description = "" } = req.body;

    if (typeof name !== "string" || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Classroom name must be at least 3 characters long.",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Classroom name cannot exceed 100 characters.",
      });
    }

    if (
      typeof description !== "string" ||
      description.trim().length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string of at most 500 characters.",
      });
    }

    const classCode = generateClassCode();

    const classroom = await Classroom.create({
      name: name.trim(),
      description: description.trim(),
      classCode,
      teacher: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Classroom created successfully.",
      data: {
        classroom,
      },
    });
  } catch (error) {
    console.error("Create classroom error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // grt classroom

const getMyClassrooms = async (req, res) => {
  try {
    let classrooms;

    if (req.user.role === "teacher") {
      classrooms = await Classroom.find({
        teacher: req.user._id,
      })
        .populate("teacher", "name email")
        .populate("students", "name email")
        .sort({ createdAt: -1 });
    } else {
      classrooms = await Classroom.find({
        students: req.user._id,
      })
        .populate("teacher", "name email")
        .populate("students", "name email")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: classrooms.length,
      data: {
        classrooms,
      },
    });
  } catch (error) {
    console.error("Get classrooms error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
  // join classroom

  
const joinClassroom = async (req, res) => {
  try {
    const { classCode } = req.body;

    if (typeof classCode !== "string" || !classCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Class code is required.",
      });
    }

    const classroom = await Classroom.findOne({
      classCode: classCode.trim().toUpperCase(),
    });

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found. Please check the class code.",
      });
    }

    if (classroom.teacher.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot join your own classroom as a student.",
      });
    }

    const alreadyJoined = classroom.students.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this classroom.",
      });
    }

    classroom.students.push(req.user._id);
    await classroom.save();

    return res.status(200).json({
      success: true,
      message: "Classroom joined successfully.",
      data: {
        classroom,
      },
    });
  } catch (error) {
    console.error("Join classroom error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
  // get a classroom by id
  
const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    const classroom = await Classroom.findById(id)
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    const isTeacher =
      classroom.teacher._id.toString() === req.user._id.toString();

    const isStudent = classroom.students.some(
      (student) => student._id.toString() === req.user._id.toString()
    );

    if (!isTeacher && !isStudent) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this classroom.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        classroom,
      },
    });
  } catch (error) {
    console.error("Get classroom details error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // update classroom details - only teacher 
 
const updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    if (name === undefined && description === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide a name or description to update.",
      });
    }

    if (
      name !== undefined &&
      (typeof name !== "string" ||
        name.trim().length < 3 ||
        name.trim().length > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 3 and 100 characters.",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" ||
        description.trim().length > 500)
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string of at most 500 characters.",
      });
    }

    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    if (classroom.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the classroom teacher can update it.",
      });
    }

    if (name !== undefined) {
      classroom.name = name.trim();
    }

    if (description !== undefined) {
      classroom.description = description.trim();
    }

    await classroom.save();

    return res.status(200).json({
      success: true,
      message: "Classroom updated successfully.",
      data: {
        classroom,
      },
    });
  } catch (error) {
    console.error("Update classroom error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // remove student - teacher

 
const removeStudent = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    if (
      !/^[a-fA-F0-9]{24}$/.test(id) ||
      !/^[a-fA-F0-9]{24}$/.test(studentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom or student ID.",
      });
    }

    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    if (classroom.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the classroom teacher can remove students.",
      });
    }

    const isMember = classroom.students.some(
      (id) => id.toString() === studentId
    );

    if (!isMember) {
      return res.status(404).json({
        success: false,
        message: "Student is not a member of this classroom.",
      });
    }

    classroom.students = classroom.students.filter(
      (id) => id.toString() !== studentId
    );

    await classroom.save();

    return res.status(200).json({
      success: true,
      message: "Student removed successfully.",
    });
  } catch (error) {
    console.error("Remove student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // leave classroom - student 

const leaveClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    const classroom = await Classroom.findById(id);

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
      return res.status(404).json({
        success: false,
        message: "You have not joined this classroom.",
      });
    }

    classroom.students = classroom.students.filter(
      (studentId) => studentId.toString() !== req.user._id.toString()
    );

    await classroom.save();

    return res.status(200).json({
      success: true,
      message: "You have left the classroom successfully.",
    });
  } catch (error) {
    console.error("Leave classroom error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
 // delete classroom 
 
const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classroom ID.",
      });
    }

    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found.",
      });
    }

    if (classroom.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the classroom teacher can delete it.",
      });
    }

    await Classroom.deleteOne({ _id: classroom._id });

    return res.status(200).json({
      success: true,
      message: "Classroom deleted successfully.",
    });
  } catch (error) {
    console.error("Delete classroom error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  createClassroom,
  getMyClassrooms,
  joinClassroom,
  getClassroomById,
  updateClassroom,
  removeStudent,
  leaveClassroom,
  deleteClassroom,
};
