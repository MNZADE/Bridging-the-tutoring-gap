import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6a11cb",
      light: "#8a3dd8",
      dark: "#4a0b9b",
    },
    secondary: {
      main: "#2575fc",
      light: "#5191fd",
      dark: "#0057cc",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

function QuizPlay() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Mock quiz data - in a real app, this would come from an API
  const mockQuiz = useMemo(() => ({
    id: "1",
    title: "English - Std 5 - Beginner",
    subject: "English",
    level: "Std 5 - Beginner",
    timeLimit: 600, // 10 minutes in seconds
    questions: [
      {
        id: 1,
        text: "What is the past tense of 'go'?",
        options: ["went", "gone", "going", "goes"],
        correctAnswer: "went"
      },
      {
        id: 2,
        text: "Which word is a noun?",
        options: ["run", "quickly", "happiness", "beautiful"],
        correctAnswer: "happiness"
      },
      {
        id: 3,
        text: "What is the plural form of 'child'?",
        options: ["childs", "children", "childes", "child's"],
        correctAnswer: "children"
      }
    ]
  }), []);

  const handleSubmitQuiz = useCallback(() => {
    // Calculate score
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    
    // Save quiz result to localStorage (in a real app, you would save to a database)
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const studentId = user.id || "1";
    
    const quizResult = {
      studentId,
      quizId: quiz.id,
      subject: quiz.subject,
      level: quiz.level,
      score,
      correctAnswers: correctCount,
      totalQuestions: quiz.questions.length,
      timestamp: new Date().toISOString(),
      results: quiz.questions.map((question, index) => ({
        question: question.text,
        userAnswer: userAnswers[index],
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswers[index] === question.correctAnswer
      }))
    };
    
    // Get existing quiz results or initialize as empty array
    const existingResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    existingResults.push(quizResult);
    localStorage.setItem("quizResults", JSON.stringify(existingResults));
    
    // Navigate to quiz results page with the result data
    navigate('/student/quiz-results', { state: { quizResult } });
  }, [quiz, userAnswers, navigate]);

  useEffect(() => {
    // In a real app, you would fetch the quiz data from an API
    // const quizId = ...; // Get from URL params
    // const response = await fetch(`/api/quizzes/${quizId}`);
    // const data = await response.json();
    
    // Using mock data for demonstration
    setTimeout(() => {
      setQuiz(mockQuiz);
      setUserAnswers(new Array(mockQuiz.questions.length).fill(null));
      setLoading(false);
    }, 500);
  }, [mockQuiz]);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, handleSubmitQuiz]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit);
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = e.target.value;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (!quizStarted) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          minHeight: "100vh", 
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
          py: 8
        }}>
          <Container maxWidth="md">
            <Card>
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  {quiz.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  This quiz has {quiz.questions.length} questions and a time limit of {Math.floor(quiz.timeLimit / 60)} minutes.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={startQuiz}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        py: 8
      }}>
        <Container maxWidth="md">
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </Typography>
                <Typography variant="h6" fontWeight={600} color={timeLeft < 60 ? "error.main" : "primary.main"}>
                  Time left: {formatTime(timeLeft)}
                </Typography>
              </Box>
              
              <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
                {quiz.questions[currentQuestion].text}
              </Typography>
              
              <FormControl component="fieldset" sx={{ width: "100%", mb: 4 }}>
                <RadioGroup
                  value={userAnswers[currentQuestion] || ""}
                  onChange={handleAnswerChange}
                >
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel 
                      key={index} 
                      value={option} 
                      control={<Radio />} 
                      label={option} 
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button 
                  variant="outlined" 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default QuizPlay;