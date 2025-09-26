import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Paper,
  Avatar,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  Quiz as QuizIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SmartToy as AIIcon,
  ExpandMore as ExpandIcon
} from "@mui/icons-material";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quiz-tabpanel-${index}`}
      aria-labelledby={`quiz-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function ManageQuizzes() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAIDialog, setOpenAIDialog] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState({
    id: null,
    title: "",
    description: "",
    subject: "",
    standard: "10", // Added default standard
    level: "Medium", // Added default level
    difficulty: "Medium",
    timeLimit: 30,
    isActive: true,
    questions: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedQuiz, setAiGeneratedQuiz] = useState(null);

  // Fetch quizzes from localStorage
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    try {
      setLoading(true);
      const quizzesData = JSON.parse(localStorage.getItem("quizzes")) || [];
      setQuizzes(quizzesData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading quizzes:", err);
      setError("Failed to load quizzes. Please try again.");
      setLoading(false);
    }
  };

  const saveQuizzes = (quizzesToSave) => {
    try {
      localStorage.setItem("quizzes", JSON.stringify(quizzesToSave));
      // Trigger a custom event to update the dashboard
      window.dispatchEvent(new Event('dataUpdated'));
    } catch (err) {
      console.error("Error saving quizzes:", err);
      setError("Failed to save quizzes. Please try again.");
    }
  };

  const handleAddQuiz = () => {
    setCurrentQuiz({
      id: Date.now(), // Simple ID generation
      title: "",
      description: "",
      subject: "",
      standard: "10", // Added default standard
      level: "Medium", // Added default level
      difficulty: "Medium",
      timeLimit: 30,
      isActive: true,
      questions: []
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      const updatedQuizzes = quizzes.filter(quiz => quiz.id !== id);
      setQuizzes(updatedQuizzes);
      saveQuizzes(updatedQuizzes);
    }
  };

  const handleSaveQuiz = () => {
    if (!currentQuiz.title || !currentQuiz.subject) {
      setError("Please fill in all required fields.");
      return;
    }

    // Ensure the quiz has standard and level properties
    const quizToSave = {
      ...currentQuiz,
      standard: currentQuiz.standard || "10", // Default to 10 if not specified
      level: currentQuiz.level || "Medium" // Default to Medium if not specified
    };

    let updatedQuizzes;
    if (isEditing) {
      updatedQuizzes = quizzes.map(quiz => 
        quiz.id === currentQuiz.id ? quizToSave : quiz
      );
    } else {
      updatedQuizzes = [...quizzes, quizToSave];
    }

    setQuizzes(updatedQuizzes);
    saveQuizzes(updatedQuizzes);
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // AI Quiz Generation Functions
  const handleOpenAIDialog = () => {
    setAiPrompt("");
    setAiGeneratedQuiz(null);
    setOpenAIDialog(true);
  };

  const handleGenerateAIQuiz = () => {
    if (!aiPrompt.trim()) {
      setError("Please enter a prompt for the AI to generate a quiz.");
      return;
    }

    setAiGenerating(true);
    
    // Simulate AI processing with a timeout
    setTimeout(() => {
      // In a real implementation, this would call an AI service like OpenAI's GPT
      // For demo purposes, we'll generate a mock quiz based on the prompt
      const mockQuiz = generateMockQuiz(aiPrompt);
      setAiGeneratedQuiz(mockQuiz);
      setAiGenerating(false);
    }, 2000);
  };

  const generateMockQuiz = (prompt) => {
    // This is a simplified mock function that generates a quiz based on keywords in the prompt
    const lowerPrompt = prompt.toLowerCase();
    
    let subject = "General Knowledge";
    if (lowerPrompt.includes("math")) subject = "Mathematics";
    else if (lowerPrompt.includes("science")) subject = "Science";
    else if (lowerPrompt.includes("history")) subject = "History";
    else if (lowerPrompt.includes("english")) subject = "English Literature";
    
    // Extract standard from prompt if available
    let standard = "10"; // Default
    const standardMatch = prompt.match(/grade\s+(\d+)|standard\s+(\d+)|class\s+(\d+)/i);
    if (standardMatch) {
      standard = standardMatch[1] || standardMatch[2] || standardMatch[3];
    }
    
    // Extract level from prompt if available
    let level = "Medium"; // Default
    if (lowerPrompt.includes("beginner") || lowerPrompt.includes("easy")) level = "Beginner";
    else if (lowerPrompt.includes("advanced") || lowerPrompt.includes("hard")) level = "Advanced";
    
    const questions = [
      {
        id: 1,
        text: `What is the primary concept in ${subject} according to your prompt?`,
        options: [
          "Option A: The fundamental principle",
          "Option B: The secondary theory",
          "Option C: The tertiary hypothesis",
          "Option D: None of the above"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        text: `Which of the following best describes the application of ${subject}?`,
        options: [
          "Option A: Practical application in daily life",
          "Option B: Theoretical framework only",
          "Option C: Limited to academic settings",
          "Option D: No real-world application"
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        text: `How would you explain the importance of ${subject} to a beginner?`,
        options: [
          "Option A: It's essential for understanding the world",
          "Option B: It's only for specialists",
          "Option C: It's outdated and irrelevant",
          "Option D: It's too complex to learn"
        ],
        correctAnswer: 0
      }
    ];
    
    return {
      title: `AI-Generated Quiz: ${subject}`,
      description: `This quiz was automatically generated based on your prompt: "${prompt}"`,
      subject: subject,
      standard: standard,
      level: level,
      difficulty: "Medium",
      timeLimit: 30,
      isActive: true,
      questions: questions
    };
  };

  const handleUseGeneratedQuiz = () => {
    if (aiGeneratedQuiz) {
      setCurrentQuiz({
        ...aiGeneratedQuiz,
        id: Date.now() // Generate new ID
      });
      setIsEditing(false);
      setOpenAIDialog(false);
      setOpenDialog(true);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: currentQuiz.questions.length + 1,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: [...currentQuiz.questions, newQuestion]
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...currentQuiz.questions];
    
    if (field === "text") {
      updatedQuestions[index].text = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.replace("option", ""));
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = parseInt(value);
    }
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: updatedQuestions
    });
  };

  const handleRemoveQuestion = (index) => {
    if (currentQuiz.questions.length <= 1) {
      setError("A quiz must have at least one question.");
      return;
    }
    
    const updatedQuestions = currentQuiz.questions.filter((_, i) => i !== index);
    
    setCurrentQuiz({
      ...currentQuiz,
      questions: updatedQuestions
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
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
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Educational Management System
            </Typography>
          </Box>
          
          <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                p: 2, 
                mb: 1, 
                borderRadius: 2, 
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" }, 
                cursor: "pointer" 
              }}
              onClick={() => navigate("/admin/dashboard")}
            >
              <BackIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Dashboard</Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 2, 
              mb: 1, 
              borderRadius: 2, 
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" }, 
              cursor: "pointer" 
              }}
              onClick={() => navigate("/admin/materials")}
            >
              <QuizIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Manage Materials</Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 2, 
              mb: 1, 
              borderRadius: 2, 
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" }, 
              cursor: "pointer" 
              }}
              onClick={() => navigate("/admin/students")}
            >
              <QuizIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Manage Students</Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 2, 
              mb: 1, 
              borderRadius: 2, 
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" }, 
              cursor: "pointer" 
              }}
              onClick={() => navigate("/admin/attendance")}
            >
              <QuizIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Manage Attendance</Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 2, 
              mb: 1, 
              borderRadius: 2, 
              bgcolor: "rgba(106, 17, 203, 0.08)" 
            }}>
              <QuizIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1" fontWeight={500}>Add Quizzes (ML)</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, overflow: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                AI-Powered Quiz Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, manage, and deploy intelligent quizzes with machine learning capabilities.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddQuiz}
              >
                Create Quiz
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<AIIcon />}
                onClick={handleOpenAIDialog}
              >
                Generate with AI
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Tabs for different views */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="quiz tabs">
              <Tab label="All Quizzes" id="quiz-tab-0" />
              <Tab label="Active Quizzes" id="quiz-tab-1" />
              <Tab label="Draft Quizzes" id="quiz-tab-2" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            {/* All Quizzes */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : quizzes.length > 0 ? (
              <Grid container spacing={3}>
                {quizzes.map((quiz) => (
                  <Grid item xs={12} md={6} lg={4} key={quiz.id}>
                    <Card 
                      sx={{ 
                        height: "100%", 
                        display: "flex", 
                        flexDirection: "column" 
                      }}
                    >
                      <CardContent sx={{ p: 3, flexGrow: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: quiz.isActive ? "primary.main" : "text.disabled",
                              mr: 2 
                            }}
                          >
                            <QuizIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {quiz.title}
                            </Typography>
                            <Chip 
                              label={quiz.subject}
                              size="small" 
                              color="primary"
                              sx={{ fontWeight: 500, mb: 1 }}
                            />
                            <Chip 
                              label={`Std ${quiz.standard || "N/A"}`}
                              size="small" 
                              color="info"
                              sx={{ fontWeight: 500, mb: 1 }}
                            />
                            <Chip 
                              label={quiz.level || "N/A"}
                              size="small" 
                              color={quiz.level === "Beginner" ? "success" : quiz.level === "Medium" ? "warning" : "error"}
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {quiz.description}
                        </Typography>
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                          <Typography variant="caption" color="text.secondary">
                            {quiz.questions?.length || 0} questions • {quiz.timeLimit} min
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton 
                              color="primary"
                              onClick={() => handleEditQuiz(quiz)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 8 }}>
                  <QuizIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No quizzes available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first quiz or generate one with AI to get started
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddQuiz}
                    >
                      Create Quiz
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      startIcon={<AIIcon />}
                      onClick={handleOpenAIDialog}
                    >
                      Generate with AI
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {/* Active Quizzes */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : quizzes.filter(q => q.isActive).length > 0 ? (
              <Grid container spacing={3}>
                {quizzes.filter(q => q.isActive).map((quiz) => (
                  <Grid item xs={12} md={6} lg={4} key={quiz.id}>
                    <Card 
                      sx={{ 
                        height: "100%", 
                        display: "flex", 
                        flexDirection: "column" 
                      }}
                    >
                      <CardContent sx={{ p: 3, flexGrow: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: "primary.main",
                              mr: 2 
                            }}
                          >
                            <QuizIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {quiz.title}
                            </Typography>
                            <Chip 
                              label={quiz.subject}
                              size="small" 
                              color="primary"
                              sx={{ fontWeight: 500, mb: 1 }}
                            />
                            <Chip 
                              label={`Std ${quiz.standard || "N/A"}`}
                              size="small" 
                              color="info"
                              sx={{ fontWeight: 500, mb: 1 }}
                            />
                            <Chip 
                              label={quiz.level || "N/A"}
                              size="small" 
                              color={quiz.level === "Beginner" ? "success" : quiz.level === "Medium" ? "warning" : "error"}
                              sx={{ fontWeight: 500 }}
                            />
                            <Chip 
                              label="Active"
                              size="small" 
                              color="success"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {quiz.description}
                        </Typography>
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                          <Typography variant="caption" color="text.secondary">
                            {quiz.questions?.length || 0} questions • {quiz.timeLimit} min
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton 
                              color="primary"
                              onClick={() => handleEditQuiz(quiz)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 8 }}>
                  <QuizIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No active quizzes available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Activate some quizzes or create new ones to get started
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddQuiz}
                  >
                    Create Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {/* Draft Quizzes */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : quizzes.filter(q => !q.isActive).length > 0 ? (
              <Grid container spacing={3}>
                {quizzes.filter(q => !q.isActive).map((quiz) => (
                  <Grid item xs={12} md={6} lg={4} key={quiz.id}>
                    <Card 
                      sx={{ 
                        height: "100%", 
                        display: "flex", 
                        flexDirection: "column" 
                      }}
                    >
                      <CardContent sx={{ p: 3, flexGrow: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: "text.disabled",
                              mr: 2 
                            }}
                          >
                            <QuizIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {quiz.title}
                            </Typography>
                            <Chip 
                              label={quiz.subject}
                              size="small" 
                              color="primary"
                              sx={{ fontWeight: 500, mb: 1 }}
                            />
                            <Chip 
                              label={`Std ${quiz.standard || "N/A"}`}
                              size="small" 
                              color="info"
                              sx={{ fontWeight: 500, mb: 1 }}
                            />
                            <Chip 
                              label={quiz.level || "N/A"}
                              size="small" 
                              color={quiz.level === "Beginner" ? "success" : quiz.level === "Medium" ? "warning" : "error"}
                              sx={{ fontWeight: 500 }}
                            />
                            <Chip 
                              label="Draft"
                              size="small" 
                              color="default"
                              sx={{ fontWeight: 500 }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {quiz.description}
                        </Typography>
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                          <Typography variant="caption" color="text.secondary">
                            {quiz.questions?.length || 0} questions • {quiz.timeLimit} min
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton 
                              color="primary"
                              onClick={() => handleEditQuiz(quiz)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 8 }}>
                  <QuizIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No draft quizzes available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create some draft quizzes to get started
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddQuiz}
                  >
                    Create Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabPanel>
        </Box>
      </Box>

      {/* Add/Edit Quiz Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? "Edit Quiz" : "Create New Quiz"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label="Quiz Title"
                fullWidth
                variant="outlined"
                value={currentQuiz.title}
                onChange={(e) => setCurrentQuiz({...currentQuiz, title: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={currentQuiz.description}
                onChange={(e) => setCurrentQuiz({...currentQuiz, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Subject"
                fullWidth
                variant="outlined"
                value={currentQuiz.subject}
                onChange={(e) => setCurrentQuiz({...currentQuiz, subject: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Standard</InputLabel>
                <Select
                  value={currentQuiz.standard || "10"}
                  onChange={(e) => setCurrentQuiz({...currentQuiz, standard: e.target.value})}
                  label="Standard"
                >
                  <MenuItem value="5">5th Standard</MenuItem>
                  <MenuItem value="6">6th Standard</MenuItem>
                  <MenuItem value="7">7th Standard</MenuItem>
                  <MenuItem value="8">8th Standard</MenuItem>
                  <MenuItem value="9">9th Standard</MenuItem>
                  <MenuItem value="10">10th Standard</MenuItem>
                  <MenuItem value="11">11th Standard</MenuItem>
                  <MenuItem value="12">12th Standard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Level</InputLabel>
                <Select
                  value={currentQuiz.level || "Medium"}
                  onChange={(e) => setCurrentQuiz({...currentQuiz, level: e.target.value})}
                  label="Level"
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={currentQuiz.difficulty}
                  onChange={(e) => setCurrentQuiz({...currentQuiz, difficulty: e.target.value})}
                  label="Difficulty"
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Time Limit (minutes)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentQuiz.timeLimit}
                onChange={(e) => setCurrentQuiz({...currentQuiz, timeLimit: parseInt(e.target.value) || 30})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentQuiz.isActive}
                    onChange={(e) => setCurrentQuiz({...currentQuiz, isActive: e.target.checked})}
                    color="primary"
                  />
                }
                label="Active Quiz"
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Quiz Questions</Typography>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              size="small"
            >
              Add Question
            </Button>
          </Box>
          
          {currentQuiz.questions.map((question, index) => (
            <Accordion key={question.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandIcon />}>
                <Typography>Question {index + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Question Text"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      value={question.text}
                      onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                    />
                  </Grid>
                  {question.options.map((option, optIndex) => (
                    <Grid item xs={12} key={optIndex}>
                      <TextField
                        label={`Option ${String.fromCharCode(65 + optIndex)}`}
                        fullWidth
                        variant="outlined"
                        value={option}
                        onChange={(e) => handleQuestionChange(index, `option${optIndex}`, e.target.value)}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Correct Answer</InputLabel>
                      <Select
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                        label="Correct Answer"
                      >
                        {question.options.map((_, optIndex) => (
                          <MenuItem key={optIndex} value={optIndex}>
                            Option {String.fromCharCode(65 + optIndex)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleRemoveQuestion(index)}
                      size="small"
                    >
                      Remove Question
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveQuiz} variant="contained" color="primary">
            {isEditing ? "Update Quiz" : "Create Quiz"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Quiz Generation Dialog */}
      <Dialog open={openAIDialog} onClose={() => setOpenAIDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AIIcon sx={{ mr: 1, color: "secondary.main" }} />
            Generate Quiz with AI
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Describe the quiz you want to create. The AI will generate questions and answers based on your description.
          </Typography>
          
          <TextField
            label="Quiz Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            placeholder="e.g., Create a math quiz about algebra for 8th grade students with 5 questions of medium difficulty."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {aiGenerating ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2 }}>
                AI is generating your quiz...
              </Typography>
            </Box>
          ) : aiGeneratedQuiz ? (
            <Card sx={{ mt: 2, bgcolor: "rgba(37, 117, 252, 0.05)" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Generated Quiz Preview
                </Typography>
                <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
                  {aiGeneratedQuiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {aiGeneratedQuiz.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Chip label={aiGeneratedQuiz.subject} color="primary" />
                  <Chip label={`Std ${aiGeneratedQuiz.standard}`} color="info" />
                  <Chip label={aiGeneratedQuiz.level} color={aiGeneratedQuiz.level === "Beginner" ? "success" : aiGeneratedQuiz.level === "Medium" ? "warning" : "error"} />
                  <Chip label={`${aiGeneratedQuiz.questions.length} questions`} />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Sample Question:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 3 }}>
                  {aiGeneratedQuiz.questions[0]?.text || "No questions available"}
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleUseGeneratedQuiz}
                  fullWidth
                >
                  Use This Quiz
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAIDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGenerateAIQuiz} 
            variant="contained" 
            color="secondary"
            disabled={aiGenerating}
          >
            Generate Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default ManageQuizzes;