import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// ✅ POST: Register student
router.post("/register", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: "Registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST: Login student
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email, password });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST: Store quiz result
router.post("/:id/results", async (req, res) => {
  try {
    const { quizId, subject, standard, level, score, total } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.results.push({ quizId, subject, standard, level, score, total });
    await student.save();

    res.json({ message: "Result saved successfully", results: student.results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET: Fetch student dashboard (profile + results)
router.get("/:id/dashboard", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("results.quizId");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      name: student.name,
      email: student.email,
      attendance: student.attendance,
      results: student.results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
