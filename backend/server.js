// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";

import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quizzes.js";
import quizResultsRoutes from "./routes/quizResults.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize OpenAI (use backend env variable)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-results", quizResultsRoutes);

// ✅ Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const formattedMessages = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));
    formattedMessages.unshift({
      role: "system",
      content:
        "You are a helpful AI learning assistant for students. Provide concise and educational responses.",
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
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// ✅ Serve React Frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
