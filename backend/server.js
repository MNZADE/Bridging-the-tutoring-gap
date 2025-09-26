import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { OpenAI } from "openai";

import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quizzes.js";
import quizResultsRoutes from "./routes/quizResults.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, 
});

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-results", quizResultsRoutes);

// ✅ Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const formattedMessages = messages.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    formattedMessages.unshift({
      role: "system",
      content:
        "You are a helpful AI learning assistant for students. You provide concise, accurate, and educational responses. You can help with study tips, explain concepts, and answer questions about various subjects.",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({
      error: "Failed to get response from AI assistant.",
      details: error.message,
    });
  }
});

// ✅ Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Backend running on Render 🚀");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
