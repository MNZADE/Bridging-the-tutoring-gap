// backend/models/Quiz.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true }
});

const quizSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    standard: { type: String, required: true }, // e.g. "6", "11-science"
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"], // ✅ must include beginner
      required: true
    },
    questions: [questionSchema]
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
