import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
  },
});

function QuizResultDetails() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resultFromState = location.state?.result;

  // ✅ function defined before usage
  const handleBackToResults = () => {
    if (location.state?.fromDashboard) {
      navigate("/dashboard");
    } else {
      navigate("/student/quiz-results");
    }
  };

  const fetchResultDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/quiz-results/result/${resultId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error fetching quiz result details:", err);
      setError(err.message || "Failed to load quiz result details");
    } finally {
      setLoading(false);
    }
  }, [resultId]);

  useEffect(() => {
    if (resultFromState) {
      setResult(resultFromState);
      setLoading(false);
    } else {
      fetchResultDetails();
    }
  }, [resultFromState, fetchResultDetails]); // ✅ dependency added

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
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
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error Loading Quiz Result
            </Typography>
            <Typography variant="body1" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToResults}
              sx={{ mt: 2 }}
            >
              Back to Results
            </Button>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  if (!result) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Quiz Result Not Found
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToResults}
              sx={{ mt: 2 }}
            >
              Back to Results
            </Button>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Quiz Result Details
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Quiz Information</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Quiz Name"
                secondary={result.quizId?.title || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Score"
                secondary={`${result.score} / ${result.totalQuestions}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Correct Answers"
                secondary={result.correctAnswers}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Wrong Answers"
                secondary={result.wrongAnswers}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date Taken"
                secondary={new Date(result.date).toLocaleString()}
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Answers</Typography>
          <List>
            {result.answers?.map((answer, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  primary={`Q${index + 1}: ${answer.question}`}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Your Answer:{" "}
                        {answer.selectedOption || "Not Answered"}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color={
                          answer.isCorrect ? "success.main" : "error.main"
                        }
                      >
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Correct Answer: {answer.correctOption}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToResults}
            >
              Back to Results
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default QuizResultDetails;
