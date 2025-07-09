/* ──────────────────────────────────────────────────────
   LearnHub – Course Controller
   Handles course CRUD, section management, enrollment,
   completion, and bulk assignment to students.
   ----------------------------------------------------- */

const Course = require("../models/Course");
const User   = require("../models/User");

/* ────────────────── 1.  Create Course ───────────────── */
exports.createCourse = async (req, res) => {
  try {
    const {
      C_educator,      // optional override (usually teacher name)
      C_categories,
      C_title,
      C_description,
      C_price = 0,
    } = req.body;

    const course = await Course.create({
      userID:      req.user._id,
      C_educator:  C_educator || req.user.name,
      C_categories,
      C_title,
      C_description,
      C_price,
    });

    return res.status(201).json(course);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create course", error: err.message });
  }
};

/* ────────────────── 2.  Add Section ─────────────────── */
exports.addSection = async (req, res) => {
  try {
    const { id }               = req.params;
    const { title, videoUrl, externalLink } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // only original teacher OR admin can add sections
    const isOwner = course.userID.toString() === req.user._id.toString();
    if (!isOwner && req.user.type !== "admin") {
      return res.status(403).json({ message: "Not authorised" });
    }

    course.sections.push({ title, videoUrl, externalLink });
    await course.save();

    return res
      .status(200)
      .json({ message: "Section added successfully", course });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to add section", error: err.message });
  }
};

/* ────────────────── 3.  Enroll Course ───────────────── */
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.enrolled.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolled.push(req.user._id);
    await course.save();

    return res
      .status(200)
      .json({ message: "Enrolled successfully", course });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to enroll", error: err.message });
  }
};

/* ────────────────── 4.  Mark Completed ──────────────── */
exports.markAsCompleted = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.enrolled.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    if (!course.completed.includes(req.user._id)) {
      course.completed.push(req.user._id);
      await course.save();
    }

    return res.status(200).json({ message: "Course marked as completed" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to mark as completed", error: err.message });
  }
};

/* ────────────────── 5.  Delete Course ───────────────── */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isOwner = course.userID.toString() === req.user._id.toString();
    const isAdmin = req.user.type === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorised to delete this course" });
    }

    await course.deleteOne();
    return res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting course", error: err.message });
  }
};

/* ────────────────── 6.  List / Search Courses ───────── */
exports.getCourses = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {};
    if (search)    filter.C_title      = { $regex: search, $options: "i" };
    if (category)  filter.C_categories = category;

    const courses = await Course.find(filter);
    return res.status(200).json(courses);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

/* ────────────────── 7.  Get Course by ID ────────────── */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    return res.status(200).json(course);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get course", error: err.message });
  }
};

/* ────────────────── 8.  Teacher View All Courses ───── */
exports.getAllCoursesForTeachers = async (_req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

/* ────────────────── 9.  Assign Course Bulk ──────────── */
exports.assignCourseToStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const { studentIds = [] } = req.body; // must be array

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res
        .status(400)
        .json({ message: "studentIds must be a non-empty array" });
    }

    // fetch only student users
    const students = await User.find({
      _id:  { $in: studentIds },
      type: "student",
    }).select("_id");

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No valid student IDs supplied" });
    }

    // push each new student
    students.forEach(({ _id }) => {
      if (!course.enrolled.includes(_id.toString())) {
        course.enrolled.push(_id);
      }
    });

    await course.save();

    return res.status(200).json({
      message:       "Course assigned successfully",
      enrolledCount: course.enrolled.length,
      course,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to assign course", error: err.message });
  }
};
