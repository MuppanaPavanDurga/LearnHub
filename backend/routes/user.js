const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getAllStudents } = require("../controllers/userController");
const User    = require("../models/User");

router.get("/", protect, async (_, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.get("/students", protect, getAllStudents);

module.exports = router;