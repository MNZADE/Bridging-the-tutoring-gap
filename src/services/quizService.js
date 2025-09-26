// services/quizService.js

// ML-powered quiz generation service
export const generateQuizWithML = (standard, subject, level) => {
  // This simulates ML-based quiz generation
  // In a real app, this would call an ML service
  
  const questionTemplates = {
    Math: [
      {
        question: `What is the result of ${Math.floor(Math.random() * 20) + 1} + ${Math.floor(Math.random() * 20) + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0
      },
      {
        question: `Solve for x: ${Math.floor(Math.random() * 10) + 1}x + ${Math.floor(Math.random() * 10) + 1} = ${Math.floor(Math.random() * 30) + 20}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 1
      }
    ],
    Science: [
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correctAnswer: 0
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
      }
    ],
    English: [
      {
        question: "Which of the following is a noun?",
        options: ["Run", "Beautiful", "Book", "Quickly"],
        correctAnswer: 2
      },
      {
        question: "Identify the verb in this sentence: 'She sings beautifully.'",
        options: ["She", "Sings", "Beautifully", "The"],
        correctAnswer: 1
      }
    ],
    Social: [
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
        correctAnswer: 1
      },
      {
        question: "Which is the largest continent by area?",
        options: ["Africa", "Asia", "North America", "Europe"],
        correctAnswer: 1
      }
    ]
  };
  
  // Get questions for the subject or use default questions
  const subjectQuestions = questionTemplates[subject] || questionTemplates.Math;
  
  // Adjust difficulty based on level
  const difficultyMultiplier = {
    Beginner: 1,
    Intermediate: 1.5,
    Advanced: 2
  }[level] || 1;
  
  // Create a new quiz
  const newQuiz = {
    id: Date.now(),
    standard,
    subject,
    level,
    title: `${subject} Quiz - Std ${standard} (${level})`,
    description: `Automatically generated ${level.toLowerCase()} level quiz for ${subject} in standard ${standard}`,
    questions: subjectQuestions.map((q, index) => ({
      id: index + 1,
      text: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    })),
    timeLimit: Math.floor(10 * difficultyMultiplier), // Time limit based on difficulty
    isActive: true
  };
  
  return newQuiz;
};