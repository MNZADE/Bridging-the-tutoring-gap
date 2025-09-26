import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dashboard as DashboardIcon, 
  Book as MaterialsIcon, 
  Quiz as QuizIcon, 
  Assessment as ResultsIcon, 
  EventNote as AttendanceIcon, 
  School as EducatorsIcon,
  Logout as LogoutIcon,
  EmojiEvents,
  CalendarToday,
  Notifications,
  MenuBook,
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  Avatar, 
  Divider,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
  Alert,
  AlertTitle
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

// OpenAI API configuration
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "your-api-key-here";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

function Dashboard() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [quizResults, setQuizResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notices, setNotices] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [averageQuizScore, setAverageQuizScore] = useState(0);
  
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI learning assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const messagesEndRef = useRef(null);

  // Function to refresh data from localStorage
  const refreshData = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setStudentName(user.name);
    }
    
    // Fetch data from local storage, or initialize as empty if not present
    const quizData = JSON.parse(localStorage.getItem("quizResults")) || [];
    setQuizResults(quizData);
    
    // Recalculate average score whenever quiz results change
    if (quizData.length > 0) {
      let totalPercentage = 0;
      let validQuizzes = 0;
      
      quizData.forEach(quiz => {
        // Get score and total questions, handling different field names
        const score = Number(quiz.score) || Number(quiz.correctAnswers) || 0;
        const total = Number(quiz.total) || Number(quiz.totalQuestions) || 0;
        
        // Skip if total is 0 to avoid division by zero
        if (total === 0) return;
        
        // Calculate percentage and ensure it's between 0-100
        let percentage = Math.round((score / total) * 100);
        percentage = Math.min(100, Math.max(0, percentage)); // Clamp between 0-100
        
        totalPercentage += percentage;
        validQuizzes++;
      });
      
      // Calculate average only if we have valid quizzes
      const average = validQuizzes > 0 ? Math.round(totalPercentage / validQuizzes) : 0;
      setAverageQuizScore(average);
    } else {
      setAverageQuizScore(0);
    }
    
    setAttendance(JSON.parse(localStorage.getItem("attendance")) || []);
    setNotices(JSON.parse(localStorage.getItem("notices")) || []);
    setStudyMaterials(JSON.parse(localStorage.getItem("studyMaterials")) || []);
  }, []);

  // Initial data load
  useEffect(() => {
    refreshData();
    
    // Add event listener for storage changes (when quiz results are updated in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "quizResults") {
        refreshData();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshData]);

  // Scroll to bottom of chat messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fun & positive messages for students (rotates randomly)
  const funMessages = [
    "🌟 Keep shining, you're doing amazing!",
    "📚 A little progress each day adds up to big results.",
    "💡 Did you know? Honey never spoils!",
    "🎯 Believe in yourself — you are smarter than you think.",
    "🚀 Every expert was once a beginner, keep learning!",
    "🧠 Fun Fact: Your brain is more active at night than during the day!",
    "😊 Smile! It makes you feel better instantly.",
  ];
  const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];

  // Calculate attendance percentage
  const attendancePercentage = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === "Present").length / attendance.length) * 100) 
    : 0;

  // Helper function to calculate percentage for a quiz result
  const getQuizPercentage = (result) => {
    // Handle different possible field names in the data
    const score = Number(result.score) || Number(result.correctAnswers) || 0;
    const total = Number(result.total) || Number(result.totalQuestions) || 0;
    
    // Avoid division by zero
    if (total === 0) return 0;
    
    // Calculate and clamp percentage between 0-100
    let percentage = Math.round((score / total) * 100);
    return Math.min(100, Math.max(0, percentage));
  };

  // Navigate to quiz results page
  const handleViewQuizResults = () => {
    navigate("/student/quiz-results");
  };

  // Navigate to detailed quiz result
  const handleViewResultDetails = (result) => {
    // In a real app, you would pass the result ID
    // For now, we'll pass the result data in state
    navigate("/student/quiz-result", { state: { result } });
  };

  // Chatbot functions
  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setApiError(null);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    
    // Add user message
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Get bot response from OpenAI
      const botResponse = await fetchOpenAIResponse([...messages, userMessage]);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      setApiError("Failed to get response from AI assistant. Please try again later.");
      
      // Add fallback response
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOpenAIResponse = async (conversationHistory) => {
    // If no API key is provided, use fallback responses
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "your-api-key-here") {
      return getFallbackResponse(conversationHistory[conversationHistory.length - 1].text);
    }

    // Prepare conversation history for OpenAI
    const apiMessages = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    // Add system message to set the assistant's behavior
    apiMessages.unshift({
      role: 'system',
      content: 'You are a helpful AI learning assistant for students. You provide concise, accurate, and educational responses. You can help with study tips, explain concepts, and answer questions about various subjects.'
    });

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: apiMessages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw error;
    }
  };

  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword matching for fallback responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your AI learning assistant. How can I help you with your studies today?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return "I can help you with study tips, explain concepts, or answer questions about your subjects. What would you like to know?";
    } else if (lowerMessage.includes('grade') || lowerMessage.includes('score') || lowerMessage.includes('result')) {
      return "You can check your grades in the 'Results' section of your dashboard. Is there a specific subject you need help with?";
    } else if (lowerMessage.includes('material') || lowerMessage.includes('resource') || lowerMessage.includes('study')) {
      return "Study materials are available in the 'Study Materials' section. You can find resources for all your subjects there.";
    } else if (lowerMessage.includes('attendance')) {
      return "Your attendance records are in the 'Attendance' section. Regular attendance is important for academic success!";
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('exam')) {
      return "You can take quizzes by clicking on 'Quizzes' in the sidebar. Regular practice helps improve your understanding of the material.";
    } else {
      return "I'm here to help with your learning journey. You can ask me about study strategies, subject concepts, or how to navigate your student portal.";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
                { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
                { text: "Study Materials", icon: <MaterialsIcon />, path: "/materials" },
                { text: "Quizzes", icon: <QuizIcon />, path: "/select-standard" },
                { text: "Results", icon: <ResultsIcon />, path: "/student/quiz-results" },
                { text: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
                { text: "Educators", icon: <EducatorsIcon />, path: "/educators" },
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
          
          <Box sx={{ p: 2 }}>
            <Button 
              onClick={handleLogout}
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<LogoutIcon />}
              sx={{ 
                borderRadius: 2,
                py: 1.2,
                borderColor: "rgba(211, 47, 47, 0.5)",
                color: "error.main",
                "&:hover": {
                  borderColor: "error.main",
                  bgcolor: "rgba(211, 47, 47, 0.04)"
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* Welcome Banner */}
          <Card 
            sx={{ 
              mb: 3, 
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "white",
              borderRadius: 4,
              overflow: "hidden"
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: "rgba(255, 255, 255, 0.2)", 
                    width: 64, 
                    height: 64, 
                    mr: 3 
                  }}
                >
                  {studentName ? studentName.charAt(0) : "S"}
                </Avatar>
                <Box>
                  <Typography variant="h3" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Welcome back, {studentName || "Student"}! 🎉
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    We're so glad to see you learning and growing every day.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Fun & Motivational Section */}
          <Card 
            sx={{ 
              mb: 3, 
              textAlign: "center", 
              py: 2.5, 
              px: 3,
              bgcolor: "rgba(106, 17, 203, 0.04)",
              border: "1px dashed rgba(106, 17, 203, 0.2)"
            }}
          >
            <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 500 }}>
              {randomMessage}
            </Typography>
          </Card>

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
                      {averageQuizScore}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={averageQuizScore} 
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
                    <CalendarToday sx={{ color: "primary.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Attendance
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mr: 2 }}>
                      {attendancePercentage}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={attendancePercentage} 
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
                    <MenuBook sx={{ color: "primary.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Study Materials
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mr: 2 }}>
                      {studyMaterials.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Available
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Sections */}
          <Grid container spacing={3}>
            {/* Quiz Results Section */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <ResultsIcon sx={{ color: "primary.main", mr: 1.5 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Recent Quiz Results
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {quizResults.length > 0 ? (
                    <List sx={{ py: 0 }}>
                      {quizResults.slice(0, 3).map((result, index) => {
                        const percentage = getQuizPercentage(result);
                        return (
                          <ListItem 
                            key={index} 
                            disablePadding 
                            sx={{ mb: 1.5, cursor: "pointer" }}
                            onClick={() => handleViewResultDetails(result)}
                          >
                            <Box sx={{ width: "100%" }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body1" fontWeight={500}>
                                  {result.quizName || result.subject || "Quiz"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {result.date || new Date(result.timestamp).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                  Score: {result.score || result.correctAnswers}/{result.total || result.totalQuestions}
                                </Typography>
                                <Chip 
                                  label={`${percentage}%`}
                                  size="small"
                                  color={percentage >= 70 ? "success" : "warning"}
                                  sx={{ fontWeight: 500 }}
                                />
                              </Box>
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No quiz results to display yet.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/select-standard")}
                      >
                        Take a Quiz
                      </Button>
                    </Box>
                  )}
                  {quizResults.length > 0 && (
                    <Button 
                      variant="text" 
                      color="primary" 
                      onClick={handleViewQuizResults}
                      sx={{ mt: 1, fontWeight: 500 }}
                    >
                      View All Results
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Section */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttendanceIcon sx={{ color: "primary.main", mr: 1.5 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Recent Attendance
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {attendance.length > 0 ? (
                    <List sx={{ py: 0 }}>
                      {attendance.slice(0, 3).map((record, index) => (
                        <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                          <Box sx={{ width: "100%" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                              <Typography variant="body1" fontWeight={500}>
                                {record.subject}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {record.date}
                              </Typography>
                            </Box>
                            <Chip 
                              label={record.status}
                              size="small"
                              color={record.status === "Present" ? "success" : "error"}
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No attendance records to display yet.
                      </Typography>
                    </Box>
                  )}
                  {attendance.length > 3 && (
                    <Button 
                      variant="text" 
                      color="primary" 
                      onClick={() => navigate("/attendance")}
                      sx={{ mt: 1, fontWeight: 500 }}
                    >
                      View All Attendance
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Notices Section */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Notifications sx={{ color: "primary.main", mr: 1.5 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Notices
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {notices.length > 0 ? (
                    <List sx={{ py: 0 }}>
                      {notices.slice(0, 3).map((notice, index) => (
                        <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                          <Box sx={{ width: "100%" }}>
                            <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                              {notice.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {notice.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                              {notice.date}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No new notices at the moment.
                      </Typography>
                    </Box>
                  )}
                  {notices.length > 3 && (
                    <Button 
                      variant="text" 
                      color="primary" 
                      sx={{ mt: 1, fontWeight: 500 }}
                    >
                      View All Notices
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Study Materials Section */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MaterialsIcon sx={{ color: "primary.main", mr: 1.5 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                      Study Materials
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {studyMaterials.length > 0 ? (
                    <List sx={{ py: 0 }}>
                      {studyMaterials.slice(0, 3).map((material, index) => (
                        <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
                          <Box sx={{ width: "100%" }}>
                            <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                              {material.title}
                            </Typography>
                            <Button 
                              variant="text" 
                              color="primary" 
                              href={material.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              sx={{ p: 0, textAlign: "left", fontWeight: 400 }}
                            >
                              {material.description}
                            </Button>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No study materials uploaded yet.
                      </Typography>
                    </Box>
                  )}
                  {studyMaterials.length > 3 && (
                    <Button 
                      variant="text" 
                      color="primary" 
                      onClick={() => navigate("/materials")}
                      sx={{ mt: 1, fontWeight: 500 }}
                    >
                      View All Materials
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Floating Chat Button */}
        <Fab
          color="primary"
          aria-label="chat"
          sx={{ position: 'fixed', bottom: 20, right: 20 }}
          onClick={handleChatOpen}
        >
          <Badge badgeContent={0} color="error">
            <ChatIcon />
          </Badge>
        </Fab>

        {/* Chat Dialog */}
        <Dialog
          open={chatOpen}
          onClose={handleChatClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              height: '80vh',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">AI Learning Assistant</Typography>
            <IconButton onClick={handleChatClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>API Error</AlertTitle>
                {apiError}
              </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.200',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                  </Box>
                </Box>
              ))}
              {isLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'grey.200',
                      color: 'text.primary',
                    }}
                  >
                    <Typography variant="body1" fontStyle="italic">Thinking...</Typography>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;

