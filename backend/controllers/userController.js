const User = require("../models/User");

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ type: "student" }).select("-password");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
};