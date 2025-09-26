import express from "express";
import StudyMaterial from "../models/StudyMaterial.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all materials
router.get("/", auth, async (req, res) => {
  const data = await StudyMaterial.find();
  res.json(data);
});

// Add material
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized" });
  const material = new StudyMaterial(req.body);
  await material.save();
  res.json(material);
});

// Update material
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized" });
  const material = await StudyMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(material);
});

// Delete material
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Not authorized" });
  await StudyMaterial.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

export default router;
