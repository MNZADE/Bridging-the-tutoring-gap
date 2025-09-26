import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Quiz as QuizIcon,
  Assessment as ResultsIcon,
  ArrowBack as ArrowBackIcon
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
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

function QuizResultsList() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);

  // Fetch quiz results for the current student
  const fetchQuizResults = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get student info from localStorage (or context)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setStudentInfo(user);
      
      if (!user.id) {
        throw new Error('Student information not found');
      }
      
      // Fetch quiz results from API
      const response = await fetch(`/api/quiz-results/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Error fetching quiz results:', err);
      setError(err.message || 'Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizResults();
  }, []);

  const handleViewDetails = (resultId) => {
    navigate(`/student/quiz-result-details/${resultId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Calculate overall statistics
  const totalQuizzes = results.length;
  const passedQuizzes = results.filter(result => result.score >= 70).length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / totalQuizzes)
    : 0;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        py: 8
      }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton 
                onClick={handleBackToDashboard}
                sx={{ mr: 2, color: "primary.main" }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  fontWeight={600}
                  sx={{
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  My Quiz Results
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {studentInfo ? `${studentInfo.name}'s Performance` : 'Student Performance'}
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={fetchQuizResults}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <QuizIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                  <Typography variant="h4" component="h2">
                    {loading ? "..." : totalQuizzes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Quizzes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <ResultsIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
                  <Typography variant="h4" component="h2">
                    {loading ? "..." : passedQuizzes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Passed Quizzes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h4" component="h2" color="primary.main">
                    {loading ? "..." : `${averageScore}%`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Results Table */}
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : results.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <QuizIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No quiz results found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  You haven't taken any quizzes yet. Start a quiz to see your results here.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={() => navigate('/select-quiz')}
                >
                  Take a Quiz
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "rgba(106, 17, 203, 0.05)" }}>
                    <TableRow>
                      <TableCell>Quiz</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow 
                        key={result._id} 
                        hover
                        sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                      >
                        <TableCell>
                          <Typography fontWeight={500}>
                            {result.quizId?.title || 'Unknown Quiz'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={result.subject || 'General'} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography 
                            fontWeight={600} 
                            color={result.score >= 70 ? "success.main" : "error.main"}
                          >
                            {result.score}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={result.score >= 70 ? "Passed" : "Failed"} 
                            color={result.score >= 70 ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(result.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <IconButton 
                              color="primary"
                              onClick={() => handleViewDetails(result._id)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default QuizResultsList;