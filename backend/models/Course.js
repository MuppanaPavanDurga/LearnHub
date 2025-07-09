const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    C_educator: {
      type: String,
      required: true,
    },
    C_categories: {
      type: String,
      required: true,
    },
    C_title: {
      type: String,
      required: true,
    },
    C_description: {
      type: String,
      required: true,
    },
    sections: {
      type: [
        {
          title: { type: String, required: true },
          videoUrl: { type: String },
          externalLink: { type: String },
        },
      ],
      default: [],
    },
    completed: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    C_price: {
      type: Number,
      default: 0,
    },
    enrolled: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
