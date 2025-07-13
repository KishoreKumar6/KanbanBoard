const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

router.post("/", async (req, res) => {
  try {
    // 🔍 Log raw body from frontend
    console.log("Received Task Body:", req.body);

    const {
      title,
      description,
      status,
      dueDate,
      assignee = "",
      label = "",
      priority = "Medium",
    } = req.body;

    // 🔧 Log structured data about to be saved
    console.log("Saving Task:", {
      title,
      description,
      status,
      dueDate,
      assignee,
      label,
      priority,
    });
    console.log("Received Task Body:", req.body);

    const task = new Task({
      title,
      description,
      status,
      dueDate,
      assignee,
      label,
      priority,
    });

    await task.save();
    console.log("Saved task to DB:", task);
    res.status(201).json(task);
  } catch (err) {
    console.error("Task creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (err) {
    console.error("Task update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// server/routes/taskRoutes.js
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
