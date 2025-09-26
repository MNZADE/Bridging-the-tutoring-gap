import express from "express";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// ✅ POST: Create quiz
router.post("/", async (req, res) => {
  try {
    const { subject, standard, level, questions } = req.body;

    const quiz = new Quiz({ subject, standard, level, questions });
    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET: Fetch all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET: Fetch quizzes by standard + subject + level
router.get("/:standard/:subject/:level", async (req, res) => {
  try {
    const { standard, subject, level } = req.params;
    const quizzes = await Quiz.find({ standard, subject, level });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ PUT: Update quiz
router.put("/:id", async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz updated successfully", updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE: Delete quiz
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
