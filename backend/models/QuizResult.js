import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  answers: [{
    question: {
      type: String,
      required: true
    },
    userAnswer: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }]
}, {
  timestamps: true
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;