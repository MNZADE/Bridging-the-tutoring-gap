import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Divider,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  Assessment as ResultsIcon,
  EmojiEvents,
  TrendingUp,
  School
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
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 16,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        }
      }
    }
  },
});

// Make sure the Results component is properly reading from localStorage

function Results() {
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState([]);

  // Fetch quiz results from localStorage
  useEffect(() => {
    const results = JSON.parse(localStorage.getItem("quizResults")) || [];
    setQuizResults(results);
  }, []);
}

  // Calculate statistics
  const averageScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, quiz) => sum + (quiz.score / quiz.total * 100), 0) / quizResults.length)
    : 0;
    
  const highestScore = quizResults.length > 0
    ? Math.max(...quizResults.map(quiz => (quiz.score / quiz.total * 100)))
    : 0;
    
  const totalQuizzes = quizResults.length;

  // Get performance color based on percentage
  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 70) return "primary";
    if (percentage >= 50) return "warning";
    return "error";
  };

  // Get performance label based on percentage
  const getPerformanceLabel = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 70) return "Good";
    if (percentage >= 50) return "Average";
    return "Needs Improvement";
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
        {/* Sidebar */}
        <Paper 
          elevation={1}
          sx={{ 
            width: 260, 
            display: "flex", 
            flexDirection: "column",
            borderRight: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 0,
            overflow: "hidden"
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "white",
              textAlign: "center"
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
              Student Portal
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Learn & Grow
            </Typography>
          </Box>
          
          <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
            <List sx={{ py: 0 }}>
              {[
                { text: "Dashboard", icon: <BackIcon />, path: "/dashboard" },
                { text: "Study Materials", icon: <ResultsIcon />, path: "/materials" },
                { text: "Quizzes", icon: <ResultsIcon />, path: "/select-standard" },
                { text: "Results", icon: <ResultsIcon />, path: "/quiz-results" },
                { text: "Attendance", icon: <ResultsIcon />, path: "/attendance" },
                { text: "Educators", icon: <ResultsIcon />, path: "/educators" },
              ].map((item, index) => (
                <ListItem 
                  key={index}
                  button
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    mb: 0.5, 
                    borderRadius: 2, 
                    px: 2, 
                    py: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      bgcolor: "rgba(106, 17, 203, 0.08)" 
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: "primary.main" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Button 
              startIcon={<BackIcon />} 
              onClick={() => navigate("/dashboard")}
              sx={{ mr: 2 }}
            >
              Back to Dashboard
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Quiz Results
            </Typography>
          </Box>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmojiEvents sx={{ color: "primary.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Average Score
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mr: 2 }}>
                      {averageScore}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={averageScore} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        flexGrow: 1,
                        bgcolor: "rgba(106, 17, 203, 0.1)"
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TrendingUp sx={{ color: "primary.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Highest Score
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mr: 2 }}>
                      {highestScore}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={highestScore} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        flexGrow: 1,
                        bgcolor: "rgba(106, 17, 203, 0.1)"
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <School sx={{ color: "primary.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Total Quizzes
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mr: 2 }}>
                      {totalQuizzes}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Results Table */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                All Quiz Results
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {quizResults.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Quiz Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="center">Score</TableCell>
                        <TableCell align="center">Percentage</TableCell>
                        <TableCell align="center">Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quizResults.map((result, index) => {
                        const percentage = Math.round((result.score / result.total) * 100);
                        return (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {result.quizName}
                            </TableCell>
                            <TableCell>{result.date}</TableCell>
                            <TableCell align="center">
                              {result.score}/{result.total}
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                  {percentage}%
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={percentage} 
                                  sx={{ 
                                    width: 60, 
                                    height: 6, 
                                    borderRadius: 3,
                                    bgcolor: "rgba(106, 17, 203, 0.1)"
                                  }} 
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={getPerformanceLabel(percentage)}
                                size="small"
                                color={getPerformanceColor(percentage)}
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <ResultsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No quiz results available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Take a quiz to see your results here
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate("/select-standard")}
                    sx={{ mt: 2 }}
                  >
                    Take a Quiz
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Results;