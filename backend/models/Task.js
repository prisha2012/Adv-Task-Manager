const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  project: {
    type: String,
    default: "General",
  },
  userId: {
    type: String,
    required: true,
  },

  // ✅ ADD THESE
  description: {
    type: String,
    default: "",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  dueDate: {
    type: Date,
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);