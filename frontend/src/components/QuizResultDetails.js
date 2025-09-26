import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  Alert,
  AlertTitle
} from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon
} from "@mui/icons-material";
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
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

function QuizResultDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get quiz result from location state
    const result = location.state?.result;
    
    if (result) {
      // Process the result to ensure it has the expected structure
      const processedResult = {
        ...result,
        subject: result.subject || "Unknown Subject",
        level: result.level || "Unknown Level",
        score: result.score || result.correctAnswers || 0,
        total: result.total || result.totalQuestions || 0,
        percentage: result.percentage || 
          (result.total || result.totalQuestions ? 
            Math.round((result.score || result.correctAnswers || 0) / (result.total || result.totalQuestions) * 100) : 0),
        date: result.date || new Date(result.timestamp).toLocaleDateString(),
        // Ensure answers is an array, even if it's empty
        answers: Array.isArray(result.answers) ? result.answers : []
      };
      
      setQuizResult(processedResult);
    } else {
      setError("No quiz result data found");
    }
    
    setLoading(false);
  }, [location.state]);

  const handleBack = () => {
    navigate("/student/quiz-results");
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', py: 4 }}>
          <Container maxWidth="lg">
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleBack}
            >
              Back to Results
            </Button>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  if (!quizResult) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', py: 4 }}>
          <Container maxWidth="lg">
            <Alert severity="warning">
              <AlertTitle>No Data</AlertTitle>
              No quiz result data available.
            </Alert>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleBack}
            >
              Back to Results
            </Button>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mb: 2 }}
            >
              Back to Results
            </Button>
            
            <Typography 
              variant="h3" 
              component="h1" 
              fontWeight={600}
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Quiz Result Details
            </Typography>
            
            <Typography variant="h6" color="text.secondary">
              {quizResult.subject} - {quizResult.level}
            </Typography>
          </Box>

          {/* Quiz Summary */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {quizResult.date}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Score
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {quizResult.score}/{quizResult.total}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Percentage
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      <Chip 
                        label={`${quizResult.percentage}%`} 
                        color={getScoreColor(quizResult.percentage)}
                      />
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Result
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      <Chip 
                        label={quizResult.percentage >= 70 ? "Passed" : "Failed"} 
                        color={quizResult.percentage >= 70 ? "success" : "error"}
                      />
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Answers Section */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Question Review
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {quizResult.answers.length > 0 ? (
                <List>
                  {quizResult.answers.map((answer, index) => (
                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                      <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Question {index + 1}: {answer.question || "Question text not available"}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Your answer: {answer.userAnswer || "Not answered"}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Correct answer: {answer.correctAnswer || "Not available"}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {answer.isCorrect ? (
                          <>
                            <CorrectIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="success.main">
                              Correct
                            </Typography>
                          </>
                        ) : (
                          <>
                            <IncorrectIcon color="error" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="error.main">
                              Incorrect
                            </Typography>
                          </>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={3}>
                  <Typography variant="body1" color="text.secondary">
                    No detailed answer data available for this quiz.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default QuizResultDetails;