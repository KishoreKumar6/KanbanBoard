const express = require("express");
const router = express.Router();
const Column = require("../models/Column");
const Task = require("../models/Task");

// GET all columns
router.get("/", async (req, res) => {
  try {
    const columns = await Column.find();
    const columnNames = columns.map((col) => col.name);
    res.json(columnNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a new column
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Column.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Column already exists" });

    const newColumn = new Column({ name });
    await newColumn.save();
    res.status(201).json(newColumn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a column name
router.put("/:oldName", async (req, res) => {
  try {
    const oldName = decodeURIComponent(req.params.oldName.trim());
    const { newName } = req.body;

    const col = await Column.findOne({ name: oldName });
    if (!col) {
      return res.status(404).json({ message: "Column not found" });
    }

    col.name = newName;
    await col.save();

    await Task.updateMany({ status: oldName }, { $set: { status: newName } });

    res.json({ message: `Column renamed from "${oldName}" to "${newName}"` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a column
router.delete("/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name.trim());
    console.log("Deleting column:", name);

    const col = await Column.findOneAndDelete({ name });
    if (!col) {
      return res.status(404).json({ message: "Column not found" });
    }

    await Task.deleteMany({ status: name });
    res.json({ message: "Column and related tasks deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
