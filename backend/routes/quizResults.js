import express from 'express';
import mongoose from 'mongoose';
import QuizResult from '../models/QuizResult.js';

const router = express.Router();

// @route   POST api/quiz-results
// @desc    Save quiz results to MongoDB quizapp database
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Convert string IDs to ObjectId if needed
    const studentId = mongoose.Types.ObjectId(req.body.studentId);
    const quizId = mongoose.Types.ObjectId(req.body.quizId);

    const newQuizResult = new QuizResult({
      studentId: studentId,
      quizId: quizId,
      subject: req.body.subject,
      level: req.body.level, // Added level field
      score: req.body.score,
      totalQuestions: req.body.totalQuestions,
      correctAnswers: req.body.correctAnswers,
      timestamp: req.body.timestamp,
      results: req.body.results,
    });

    const quizResult = await newQuizResult.save();
    res.json(quizResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/quiz-results
// @desc    Get all quiz results (for admin)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all quiz results and populate related data
    const quizResults = await QuizResult.find({})
      .populate('quizId', 'title subject') // Get quiz title and subject
      .populate('studentId', 'name email') // Get student details
      .sort({ timestamp: -1 }); // Sort by most recent first
      
    res.json(quizResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/quiz-results/:studentId
// @desc    Get all quiz results for a student from quizapp database
// @access  Public
router.get('/:studentId', async (req, res) => {
  try {
    const studentId = mongoose.Types.ObjectId(req.params.studentId);
    
    // Find all quiz results for this student and populate quiz details
    const quizResults = await QuizResult.find({ studentId: studentId })
      .populate('quizId', 'title subject') // Get quiz title and subject
      .sort({ timestamp: -1 }); // Sort by most recent first
      
    res.json(quizResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/quiz-results/quiz/:quizId
// @desc    Get all results for a specific quiz
// @access  Public
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const quizId = mongoose.Types.ObjectId(req.params.quizId);
    
    const quizResults = await QuizResult.find({ quizId: quizId })
      .populate('studentId', 'name email') // Get student details
      .sort({ score: -1 }); // Sort by highest score first
      
    res.json(quizResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/quiz-results/result/:resultId
// @desc    Get a specific quiz result by ID
// @access  Public
router.get('/result/:resultId', async (req, res) => {
  try {
    const resultId = req.params.resultId;
    
    // Find the specific quiz result by ID and populate related data
    const quizResult = await QuizResult.findById(resultId)
      .populate('quizId', 'title subject level') // Get quiz details including level
      .populate('studentId', 'name email'); // Get student details
      
    if (!quizResult) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }
    
    res.json(quizResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;