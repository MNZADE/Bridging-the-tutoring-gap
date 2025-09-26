import express from "express";
import Attendance from "../models/Attendance.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all attendance
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized" });
  const data = await Attendance.find().populate("studentId", "name email standard");
  res.json(data);
});

// Add attendance
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized" });
  const att = new Attendance(req.body);
  await att.save();
  res.json(att);
});

// Delete attendance
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized" });
  await Attendance.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

export default router;
