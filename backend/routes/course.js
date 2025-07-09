const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createCourse, getCourses, deleteCourse, enrollCourse, getAllCoursesForTeachers, markAsCompleted, addSection,
  getCourseById, assignCourseToStudents } = require("../controllers/courseController");

router.get("/", getCourses);
router.get("/all", protect, getAllCoursesForTeachers);
router.get("/:id", protect, getCourseById);
router.post("/create", protect, createCourse);
router.post("/:id/enroll", protect, enrollCourse);
router.post("/:id/assign", protect, assignCourseToStudents);
router.post("/:id/add-section", protect, addSection);
router.post("/:id/complete", protect, markAsCompleted);
router.delete("/:id", protect, deleteCourse);

module.exports = router;