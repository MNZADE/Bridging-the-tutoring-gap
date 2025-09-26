import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { 
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
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
    warning: {
      main: "#ff9800",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
});

function QuizResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectResults, setSubjectResults] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [studentStandard, setStudentStandard] = useState("Std 5"); // Default standard
  
  // Check if we have a new quiz result from location state
  const newQuizResult = location.state?.quizResult;

  // Mock data - in a real app, this would come from an API
  const mockQuizData = useMemo(() => [
    {
      subject: 'English',
      level: 'Std 5 - Beginner',
      quizzes: [
        { date: '2025-09-21', score: 2, total: 3, percentage: 67 },
        { date: '2025-09-15', score: 3, total: 3, percentage: 100 },
        { date: '2025-09-10', score: 1, total: 3, percentage: 33 },
      ],
    },
    {
      subject: 'Mathematics',
      level: 'Std 5 - Intermediate',
      quizzes: [
        { date: '2025-09-20', score: 8, total: 10, percentage: 80 },
        { date: '2025-09-13', score: 7, total: 10, percentage: 70 },
      ],
    },
    {
      subject: 'Science',
      level: 'Std 5 - Advanced',
      quizzes: [
        { date: '2025-09-19', score: 4, total: 5, percentage: 80 },
        { date: '2025-09-12', score: 3, total: 5, percentage: 60 },
      ],
    },
    {
      subject: 'History',
      level: 'Std 5 - Beginner',
      quizzes: [
        { date: '2025-09-18', score: 5, total: 6, percentage: 83 },
      ],
    },
    {
      subject: 'Geography',
      level: 'Std 5 - Intermediate',
      quizzes: [
        { date: '2025-09-17', score: 4, total: 5, percentage: 80 },
      ],
    },
  ], []);

  useEffect(() => {
    // Get student info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.standard) {
      setStudentStandard(user.standard);
    }
    
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      
      // Get existing quiz results from localStorage
      const storedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
      
      // If we have a new quiz result, add it to the stored results
      if (newQuizResult) {
        const updatedResults = [...storedResults, newQuizResult];
        localStorage.setItem("quizResults", JSON.stringify(updatedResults));
        
        // Process the updated results
        const processedData = processQuizResults(updatedResults);
        setQuizData(processedData);
      } else {
        // Process the stored results
        const processedData = processQuizResults(storedResults);
        setQuizData(processedData);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [studentStandard, mockQuizData, newQuizResult]);

  // Function to process quiz results into the format we need
  const processQuizResults = (results) => {
    // Group results by subject and level
    const groupedResults = {};
    
    results.forEach(result => {
      // Skip results without necessary data
      if (!result.subject || !result.level) return;
      
      const key = `${result.subject}-${result.level}`;
      
      if (!groupedResults[key]) {
        groupedResults[key] = {
          subject: result.subject,
          level: result.level,
          quizzes: []
        };
      }
      
      // Validate the timestamp before using it
      let date = 'Unknown';
      if (result.timestamp) {
        try {
          // Try to create a valid date object
          const dateObj = new Date(result.timestamp);
          // Check if the date is valid
          if (!isNaN(dateObj.getTime())) {
            date = dateObj.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Invalid timestamp:', result.timestamp);
          date = 'Unknown';
        }
      }
      
      // Ensure score and total are numbers and calculate percentage if needed
      const score = Number(result.correctAnswers) || 0;
      const total = Number(result.totalQuestions) || 0;
      let percentage = 0;
      
      if (total > 0) {
        percentage = Math.round((score / total) * 100);
      } else if (result.score && !isNaN(result.score)) {
        // If we have a direct score field, use it
        percentage = Number(result.score);
      }
      
      groupedResults[key].quizzes.push({
        date,
        score,
        total,
        percentage,
        resultId: result.timestamp || Date.now() // Use timestamp as a unique ID or fallback to current time
      });
    });
    
    // Convert to array and sort by most recent quiz
    return Object.values(groupedResults).map(subjectData => {
      // Ensure quizzes is an array
      subjectData.quizzes = subjectData.quizzes || [];
      // Sort quizzes by date (most recent first)
      subjectData.quizzes.sort((a, b) => {
        if (a.date === 'Unknown') return 1;
        if (b.date === 'Unknown') return -1;
        return new Date(b.date) - new Date(a.date);
      });
      return subjectData;
    });
  };

  const handleViewSubjectResults = (subject, level) => {
    const subjectData = quizData.find(
      (item) => item.subject === subject && item.level === level
    );
    
    if (subjectData) {
      setSelectedSubject(`${subject} - ${level}`);
      setSubjectResults(subjectData.quizzes);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getPerformanceTrend = (quizzes) => {
    if (quizzes.length < 2) return null;
    
    const latest = quizzes[0].percentage;
    const previous = quizzes[1].percentage;
    
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'same';
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

  // Calculate overall statistics with proper validation
  const allQuizzes = quizData.flatMap(subject => subject.quizzes || []);
  const totalQuizzes = allQuizzes.length;
  
  // Calculate total score with validation
  const totalScore = allQuizzes.reduce((sum, quiz) => {
    const percentage = Number(quiz.percentage) || 0;
    return sum + percentage;
  }, 0);
  
  // Calculate average score with validation
  let averageScore = 0;
  if (totalQuizzes > 0) {
    averageScore = Math.round(totalScore / totalQuizzes);
  }
  
  // Ensure averageScore is a valid number
  if (isNaN(averageScore) || averageScore === Infinity) {
    averageScore = 0;
  }
  
  // Calculate passed quizzes with validation
  const passedQuizzes = allQuizzes.filter(quiz => {
    const percentage = Number(quiz.percentage) || 0;
    return percentage >= 70;
  }).length;
  
  // Calculate pass rate with validation
  let passRate = 0;
  if (totalQuizzes > 0) {
    passRate = Math.round((passedQuizzes / totalQuizzes) * 100);
  }
  
  // Ensure passRate is a valid number
  if (isNaN(passRate) || passRate === Infinity) {
    passRate = 0;
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
              Back to Dashboard
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
              Quiz Results
            </Typography>
            
            <Typography variant="h6" color="text.secondary">
              {studentStandard} - View your performance across all subjects
            </Typography>
          </Box>

          {/* Show new quiz result if available */}
          {newQuizResult && (
            <Card sx={{ mb: 4, border: '2px solid #4caf50' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>
                  New Quiz Result!
                </Typography>
                <Typography variant="body1" gutterBottom>
                  You just completed a quiz in {newQuizResult.subject} - {newQuizResult.level}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" fontWeight={600} sx={{ mr: 2 }}>
                    {newQuizResult.score}%
                  </Typography>
                  <Chip 
                    label={newQuizResult.score >= 70 ? "Passed" : "Failed"} 
                    color={newQuizResult.score >= 70 ? "success" : "error"}
                  />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Overall Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    {averageScore}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Average Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    {totalQuizzes}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Quizzes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={600} color="primary.main">
                    {passRate}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Pass Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Subject Results" />
              <Tab label="All Results" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {activeTab === 0 ? (
                // Subject Results Tab
                <Grid container spacing={3}>
                  {quizData.length > 0 ? (
                    quizData.map((subjectData, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                          elevation={0} 
                          sx={{ 
                            border: '1px solid #e0e0e0',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {subjectData.subject}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {subjectData.level}
                            </Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <List dense>
                              <ListItem>
                                <ListItemText 
                                  primary="Latest Quiz" 
                                  secondary={subjectData.quizzes[0].date === 'Unknown' ? 'Unknown date' : new Date(subjectData.quizzes[0].date).toLocaleDateString()} 
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Score" 
                                  secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="body1" fontWeight={500}>
                                        {subjectData.quizzes[0].score}/{subjectData.quizzes[0].total}
                                      </Typography>
                                      <Chip 
                                        label={`${subjectData.quizzes[0].percentage}%`} 
                                        color={getScoreColor(subjectData.quizzes[0].percentage)}
                                        size="small"
                                        sx={{ ml: 1 }}
                                      />
                                    </Box>
                                  } 
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Performance" 
                                  secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {getPerformanceTrend(subjectData.quizzes) === 'up' && (
                                        <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                                      )}
                                      {getPerformanceTrend(subjectData.quizzes) === 'down' && (
                                        <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                                      )}
                                      <Typography variant="body2">
                                        {getPerformanceTrend(subjectData.quizzes) === 'up' && 'Improving'}
                                        {getPerformanceTrend(subjectData.quizzes) === 'down' && 'Needs improvement'}
                                        {getPerformanceTrend(subjectData.quizzes) === 'same' && 'Stable'}
                                        {getPerformanceTrend(subjectData.quizzes) === null && 'Not enough data'}
                                      </Typography>
                                    </Box>
                                  } 
                                />
                              </ListItem>
                            </List>
                          </CardContent>
                          
                          <Box sx={{ p: 2, pt: 0 }}>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<ViewIcon />}
                              onClick={() => handleViewSubjectResults(subjectData.subject, subjectData.level)}
                            >
                              View All Results
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No quiz results available for your standard.
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          sx={{ mt: 2 }}
                          onClick={() => navigate('/select-standard')}
                        >
                          Take a Quiz
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                // All Results Tab
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Latest Score</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quizData.length > 0 ? (
                        quizData.map((subjectData, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              <Typography fontWeight={500}>
                                {subjectData.subject}
                              </Typography>
                            </TableCell>
                            <TableCell>{subjectData.level}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography>
                                  {subjectData.quizzes[0].score}/{subjectData.quizzes[0].total}
                                </Typography>
                                <Chip 
                                  label={`${subjectData.quizzes[0].percentage}%`} 
                                  color={getScoreColor(subjectData.quizzes[0].percentage)}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getPerformanceTrend(subjectData.quizzes) === 'up' && (
                                  <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                                )}
                                {getPerformanceTrend(subjectData.quizzes) === 'down' && (
                                  <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                                )}
                                <Typography variant="body2">
                                  {getPerformanceTrend(subjectData.quizzes) === 'up' && 'Improving'}
                                  {getPerformanceTrend(subjectData.quizzes) === 'down' && 'Needs improvement'}
                                  {getPerformanceTrend(subjectData.quizzes) === 'same' && 'Stable'}
                                  {getPerformanceTrend(subjectData.quizzes) === null && 'Not enough data'}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ViewIcon />}
                                onClick={() => handleViewSubjectResults(subjectData.subject, subjectData.level)}
                              >
                                View All
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body1" color="text.secondary">
                              No quiz results available for your standard.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Subject Results Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            {selectedSubject} - All Results
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.date === 'Unknown' ? 'Unknown date' : new Date(result.date).toLocaleDateString()}</TableCell>
                    <TableCell>{result.score}/{result.total}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${result.percentage}%`} 
                        color={getScoreColor(result.percentage)}
                      />
                    </TableCell>
                    <TableCell>
                      {index < subjectResults.length - 1 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {result.percentage > subjectResults[index + 1].percentage && (
                            <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                          )}
                          {result.percentage < subjectResults[index + 1].percentage && (
                            <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                          )}
                          {result.percentage === subjectResults[index + 1].percentage && (
                            <span style={{ marginRight: '8px' }}>—</span>
                          )}
                          <Typography variant="body2">
                            {result.percentage > subjectResults[index + 1].percentage && 'Improved'}
                            {result.percentage < subjectResults[index + 1].percentage && 'Declined'}
                            {result.percentage === subjectResults[index + 1].percentage && 'No change'}
                          </Typography>
                        </Box>
                      )}
                      {index === subjectResults.length - 1 && (
                        <Typography variant="body2" color="text.secondary">
                          First attempt
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default QuizResults;