const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, required: true },
  dueDate: Date,
  assignee: { type: String, default: "" },
  label: { type: String, default: "General" },
  priority: { type: String, default: "Medium", enum: ["High", "Medium", "Low"] },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
