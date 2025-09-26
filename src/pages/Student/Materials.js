import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Button, 
  Divider,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  Book as BookIcon,
  Description as FileIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  Link as LinkIcon,
  Dashboard as DashboardIcon, 
  MenuBook as MaterialsIcon, 
  Quiz as QuizIcon, 
  Assessment as ResultsIcon, 
  EventNote as AttendanceIcon, 
  School as EducatorsIcon,
  ExpandMore as ExpandMoreIcon,
  Subject as SubjectIcon,
  Close as CloseIcon
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

// Available standards
const standards = ["Std 5", "Std 6", "Std 7", "Std 8", "Std 9", "Std 10", "Std 11", "Std 12"];

// Subjects for standards 5-10
const baseSubjects = ["English", "Mathematics", "Science", "History", "Geography", "Computer Science"];

// Stream-specific subjects for standards 11-12
const streamSubjects = {
  "Std 11": {
    "Science": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"],
    "Commerce": ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
    "Arts": ["History", "Geography", "Political Science", "Psychology", "Sociology", "English"]
  },
  "Std 12": {
    "Science": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science", "English"],
    "Commerce": ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
    "Arts": ["History", "Geography", "Political Science", "Psychology", "Sociology", "English"]
  }
};

function Materials() {
  const navigate = useNavigate();
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    name: "Student Name",
    standard: "Std 5",
    stream: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch study materials from localStorage and student info
  useEffect(() => {
    loadMaterials();
    loadStudentInfo();
    
    // Listen for data updates from admin
    const handleDataUpdate = () => {
      loadMaterials();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const loadMaterials = () => {
    try {
      setLoading(true);
      const materialsData = JSON.parse(localStorage.getItem("studyMaterials")) || [];
      setStudyMaterials(materialsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading materials:", err);
      setLoading(false);
    }
  };

  const loadStudentInfo = () => {
    try {
      const savedStudentInfo = JSON.parse(localStorage.getItem("studentInfo"));
      if (savedStudentInfo) {
        setStudentInfo(savedStudentInfo);
      }
    } catch (err) {
      console.error("Error loading student info:", err);
    }
  };

  // Filter materials by type and student info
  useEffect(() => {
    let materials = studyMaterials;
    
    // Filter by student's standard and stream
    materials = materials.filter(material => {
      if (material.standard !== studentInfo.standard) {
        return false;
      }
      
      if (studentInfo.standard === "Std 11" || studentInfo.standard === "Std 12") {
        return material.stream === studentInfo.stream;
      }
      
      return true;
    });
    
    // Then filter by type if needed
    if (filter !== "all") {
      materials = materials.filter(material => material.type === filter);
    }
    
    setFilteredMaterials(materials);
  }, [filter, studyMaterials, studentInfo]);

  // Get subjects based on student's standard and stream
  const getSubjectsForStudent = () => {
    if (studentInfo.standard === "Std 11" || studentInfo.standard === "Std 12") {
      return streamSubjects[studentInfo.standard][studentInfo.stream] || [];
    } else {
      return baseSubjects;
    }
  };

  // Group materials by subject
  const groupMaterialsBySubject = () => {
    const grouped = {};
    const subjects = getSubjectsForStudent();
    
    subjects.forEach(subject => {
      grouped[subject] = filteredMaterials.filter(
        material => material.subject === subject
      );
    });
    
    return grouped;
  };

  const groupedMaterials = groupMaterialsBySubject();

  const handleSubjectChange = (subject) => {
    setExpandedSubject(expandedSubject === subject ? null : subject);
  };

  // Get appropriate icon based on material type
  const getMaterialIcon = (type) => {
    switch (type) {
      case "pdf":
        return <PdfIcon color="error" />;
      case "video":
        return <VideoIcon color="secondary" />;
      case "link":
        return <LinkIcon color="primary" />;
      default:
        return <FileIcon color="action" />;
    }
  };

  // Get appropriate color based on material type
  const getMaterialColor = (type) => {
    switch (type) {
      case "pdf":
        return "error";
      case "video":
        return "secondary";
      case "link":
        return "primary";
      default:
        return "default";
    }
  };

  const openMaterial = (material) => {
    if (material.type === "pdf") {
      // Check if it's a base64 encoded PDF
      if (material.url.startsWith("data:application/pdf")) {
        setCurrentPdf(material);
        setPdfViewerOpen(true);
      } else {
        // External PDF URL
        window.open(material.url, '_blank');
      }
    } else if (material.type === "video") {
      // For videos, open in new tab
      window.open(material.url, '_blank');
    } else {
      // For other types, open in new tab
      window.open(material.url, '_blank');
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
                    },
                    ...(item.text === "Study Materials" && {
                      bgcolor: "rgba(106, 17, 203, 0.08)"
                    })
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
              Study Materials
            </Typography>
          </Box>

          {/* Student Info Banner */}
          <Card 
            sx={{ 
              mb: 3, 
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              color: "white",
              borderRadius: 4,
              overflow: "hidden"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar 
                  sx={{ 
                    bgcolor: "rgba(255, 255, 255, 0.2)", 
                    width: 56, 
                    height: 56, 
                    mr: 3 
                  }}
                >
                  {studentInfo.name ? studentInfo.name.charAt(0) : "S"}
                </Avatar>
                <Box>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {studentInfo.name}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {studentInfo.standard} {studentInfo.stream ? `(${studentInfo.stream} Stream)` : ""}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Filter Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                  Filter by type:
                </Typography>
                <Button 
                  variant={filter === "all" ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => setFilter("all")}
                  sx={{ mr: 1 }}
                >
                  All
                </Button>
                <Button 
                  variant={filter === "pdf" ? "contained" : "outlined"}
                  color="error"
                  size="small"
                  onClick={() => setFilter("pdf")}
                  sx={{ mr: 1 }}
                >
                  PDFs
                </Button>
                <Button 
                  variant={filter === "video" ? "contained" : "outlined"}
                  color="secondary"
                  size="small"
                  onClick={() => setFilter("video")}
                  sx={{ mr: 1 }}
                >
                  Videos
                </Button>
                <Button 
                  variant={filter === "link" ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => setFilter("link")}
                >
                  Links
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Materials List */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <LinearProgress sx={{ width: '50%' }} />
            </Box>
          ) : Object.keys(groupedMaterials).length > 0 ? (
            Object.keys(groupedMaterials).map(subject => (
              <Accordion 
                key={subject}
                expanded={expandedSubject === subject}
                onChange={() => handleSubjectChange(subject)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SubjectIcon sx={{ color: "secondary.main", mr: 2 }} />
                    <Typography variant="h6" fontWeight={500}>
                      {subject}
                    </Typography>
                    <Chip 
                      label={groupedMaterials[subject].length} 
                      size="small" 
                      color="secondary" 
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {groupedMaterials[subject].length > 0 ? (
                    <Grid container spacing={2}>
                      {groupedMaterials[subject].map(material => (
                        <Grid item xs={12} sm={6} md={4} key={material.id}>
                          <Card 
                            sx={{ 
                              height: "100%", 
                              display: "flex", 
                              flexDirection: "column" 
                            }}
                          >
                            <CardContent sx={{ p: 2, flexGrow: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: "rgba(106, 17, 203, 0.1)", 
                                    mr: 1 
                                  }}
                                >
                                  {getMaterialIcon(material.type)}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {material.title}
                                  </Typography>
                                  <Chip 
                                    label={material.type.toUpperCase()} 
                                    size="small" 
                                    color={getMaterialColor(material.type)}
                                    sx={{ fontWeight: 500, fontSize: "0.7rem" }}
                                  />
                                </Box>
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.85rem" }}>
                                {material.description}
                              </Typography>
                              
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                Added: {material.date || "Unknown date"}
                              </Typography>
                              
                              <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                                <Button 
                                  variant="contained" 
                                  color="primary"
                                  onClick={() => openMaterial(material)}
                                  size="small"
                                  sx={{ flexGrow: 1, fontSize: "0.75rem" }}
                                >
                                  Open
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box textAlign="center" py={2}>
                      <Typography variant="body2" color="text.secondary">
                        No materials available for this subject
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 8 }}>
                <MaterialsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No study materials available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Check back later for new materials
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* PDF Viewer Dialog */}
      <Dialog
        open={pdfViewerOpen}
        onClose={() => setPdfViewerOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{ height: "90vh" }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">{currentPdf?.title || "PDF Viewer"}</Typography>
          <IconButton onClick={() => setPdfViewerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: "calc(90vh - 64px)" }}>
          {currentPdf && (
            <iframe
              src={currentPdf.url}
              width="100%"
              height="100%"
              title={currentPdf.title}
              frameBorder="0"
            />
          )}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default Materials;