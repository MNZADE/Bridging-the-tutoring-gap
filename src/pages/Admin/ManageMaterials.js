import React, { useEffect, useState, useRef } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Tab,
  Tabs,
  Dialog as MuiDialog
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  MenuBook as MaterialsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FileIcon,
  PictureAsPdf as PdfIcon,
  VideoLibrary as VideoIcon,
  Link as LinkIcon,
  ExpandMore as ExpandMoreIcon,
  School as StandardIcon,
  Subject as SubjectIcon,
  CloudUpload as UploadIcon,
  YouTube as YouTubeIcon,
  Close as CloseIcon
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

function ManageMaterials() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState({
    id: null,
    title: "",
    description: "",
    type: "pdf",
    url: "",
    standard: "Std 5",
    subject: "English",
    stream: "",
    date: new Date().toISOString().split('T')[0],
    file: null,
    videoSource: "youtube"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [expandedStandard, setExpandedStandard] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [expandedStream, setExpandedStream] = useState(null);
  const [uploadTab, setUploadTab] = useState(0);
  const fileInputRef = useRef(null);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdf, setCurrentPdf] = useState(null);

  // Fetch materials from localStorage
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    try {
      setLoading(true);
      const materialsData = JSON.parse(localStorage.getItem("studyMaterials")) || [];
      setMaterials(materialsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading materials:", err);
      setError("Failed to load materials. Please try again.");
      setLoading(false);
    }
  };

  const saveMaterials = (materialsToSave) => {
    try {
      localStorage.setItem("studyMaterials", JSON.stringify(materialsToSave));
      // Trigger a custom event to update the dashboard
      window.dispatchEvent(new Event('dataUpdated'));
    } catch (err) {
      console.error("Error saving materials:", err);
      setError("Failed to save materials. Please try again.");
    }
  };

  const handleAddMaterial = () => {
    setCurrentMaterial({
      id: Date.now(), // Simple ID generation
      title: "",
      description: "",
      type: "pdf",
      url: "",
      standard: "Std 5",
      subject: "English",
      stream: "",
      date: new Date().toISOString().split('T')[0],
      file: null,
      videoSource: "youtube"
    });
    setIsEditing(false);
    setUploadTab(0);
    setOpenDialog(true);
  };

  const handleEditMaterial = (material) => {
    setCurrentMaterial(material);
    setIsEditing(true);
    setUploadTab(material.type === "pdf" ? 0 : 1);
    setOpenDialog(true);
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      const updatedMaterials = materials.filter(material => material.id !== id);
      setMaterials(updatedMaterials);
      saveMaterials(updatedMaterials);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (currentMaterial.type === "pdf" && file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    if (currentMaterial.type === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a video file");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Create a URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    setCurrentMaterial({
      ...currentMaterial,
      file: file,
      url: fileUrl
    });
  };

  const handleSaveMaterial = () => {
    if (!currentMaterial.title || !currentMaterial.description || !currentMaterial.standard || !currentMaterial.subject) {
      setError("Please fill in all required fields.");
      return;
    }

    // For standards 11-12, stream is also required
    if ((currentMaterial.standard === "Std 11" || currentMaterial.standard === "Std 12") && !currentMaterial.stream) {
      setError("Please select a stream for standards 11 and 12.");
      return;
    }

    // Validate URL or file based on type
    if (currentMaterial.type === "pdf") {
      if (!currentMaterial.file && !currentMaterial.url) {
        setError("Please upload a PDF file or provide a URL");
        return;
      }
    } else if (currentMaterial.type === "video") {
      if (currentMaterial.videoSource === "youtube" && !currentMaterial.url) {
        setError("Please provide a YouTube URL");
        return;
      } else if (currentMaterial.videoSource === "upload" && !currentMaterial.file) {
        setError("Please upload a video file");
        return;
      }
    } else {
      if (!currentMaterial.url) {
        setError("Please provide a URL");
        return;
      }
    }

    // Create a copy of the material to save
    const materialToSave = { ...currentMaterial };
    
    // For uploaded files, convert to base64 for storage
    if (currentMaterial.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        materialToSave.url = base64;
        
        let updatedMaterials;
        if (isEditing) {
          updatedMaterials = materials.map(material => 
            material.id === currentMaterial.id ? materialToSave : material
          );
        } else {
          updatedMaterials = [...materials, materialToSave];
        }

        setMaterials(updatedMaterials);
        saveMaterials(updatedMaterials);
        setOpenDialog(false);
      };
      reader.readAsDataURL(currentMaterial.file);
    } else {
      // For external URLs, save directly
      let updatedMaterials;
      if (isEditing) {
        updatedMaterials = materials.map(material => 
          material.id === currentMaterial.id ? materialToSave : material
        );
      } else {
        updatedMaterials = [...materials, materialToSave];
      }

      setMaterials(updatedMaterials);
      saveMaterials(updatedMaterials);
      setOpenDialog(false);
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

  // Get subjects based on standard and stream
  const getSubjectsForStandard = (standard, stream = "") => {
    if (standard === "Std 11" || standard === "Std 12") {
      return streamSubjects[standard][stream] || [];
    } else {
      return baseSubjects;
    }
  };

  // Group materials by standard, stream (for 11-12), and subject
  const groupMaterialsByStandardAndSubject = () => {
    const grouped = {};
    
    standards.forEach(standard => {
      grouped[standard] = {};
      
      if (standard === "Std 11" || standard === "Std 12") {
        // For standards 11-12, group by stream first
        Object.keys(streamSubjects[standard]).forEach(stream => {
          grouped[standard][stream] = {};
          const subjectsForStream = streamSubjects[standard][stream];
          
          subjectsForStream.forEach(subject => {
            grouped[standard][stream][subject] = materials.filter(
              material => material.standard === standard && 
                         material.subject === subject && 
                         material.stream === stream
            );
          });
        });
      } else {
        // For standards 5-10, group by subject directly
        baseSubjects.forEach(subject => {
          grouped[standard][subject] = materials.filter(
            material => material.standard === standard && material.subject === subject
          );
        });
      }
    });
    
    return grouped;
  };

  const groupedMaterials = groupMaterialsByStandardAndSubject();

  const handleStandardChange = (standard) => {
    setExpandedStandard(expandedStandard === standard ? null : standard);
    setExpandedSubject(null);
    setExpandedStream(null);
  };

  const handleStreamChange = (stream) => {
    setExpandedStream(expandedStream === stream ? null : stream);
    setExpandedSubject(null);
  };

  const handleSubjectChange = (subject) => {
    setExpandedSubject(expandedSubject === subject ? null : subject);
  };

  const handleTabChange = (event, newValue) => {
    setUploadTab(newValue);
    // Reset file and URL when switching tabs
    setCurrentMaterial({
      ...currentMaterial,
      file: null,
      url: ""
    });
  };

  const handleVideoSourceChange = (event) => {
    setCurrentMaterial({
      ...currentMaterial,
      videoSource: event.target.value,
      url: ""
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
              bgcolor: "rgba(106, 17, 203, 0.08)" 
            }}>
              <MaterialsIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1" fontWeight={500}>Manage Materials</Typography>
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
              <MaterialsIcon sx={{ color: "primary.main", mr: 2 }} />
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
              <MaterialsIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Manage Attendance</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, overflow: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                Manage Study Materials
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Add, edit, and organize educational resources by standard and subject.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddMaterial}
            >
              Add Material
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Materials List */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {standards.map(standard => (
                <Accordion 
                  key={standard} 
                  expanded={expandedStandard === standard}
                  onChange={() => handleStandardChange(standard)}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StandardIcon sx={{ color: "primary.main", mr: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {standard}
                      </Typography>
                      <Chip 
                        label={
                          standard === "Std 11" || standard === "Std 12"
                            ? Object.values(groupedMaterials[standard])
                                .reduce((acc, stream) => acc + Object.values(stream).flat().length, 0)
                            : Object.values(groupedMaterials[standard]).flat().length
                        } 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ width: "100%" }}>
                      {standard === "Std 11" || standard === "Std 12" ? (
                        // For standards 11-12, show streams first
                        Object.keys(streamSubjects[standard]).map(stream => (
                          <Accordion 
                            key={`${standard}-${stream}`}
                            expanded={expandedStream === stream && expandedStandard === standard}
                            onChange={() => handleStreamChange(stream)}
                            sx={{ mb: 1 }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <SubjectIcon sx={{ color: "secondary.main", mr: 2 }} />
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {stream} Stream
                                </Typography>
                                <Chip 
                                  label={Object.values(groupedMaterials[standard][stream]).flat().length} 
                                  size="small" 
                                  color="secondary" 
                                  sx={{ ml: 2 }}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              {streamSubjects[standard][stream].map(subject => (
                                <Accordion 
                                  key={`${standard}-${stream}-${subject}`}
                                  expanded={expandedSubject === subject && expandedStream === stream}
                                  onChange={() => handleSubjectChange(subject)}
                                  sx={{ mb: 1 }}
                                >
                                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      <SubjectIcon sx={{ color: "info.main", mr: 2 }} />
                                      <Typography variant="subtitle2" fontWeight={500}>
                                        {subject}
                                      </Typography>
                                      <Chip 
                                        label={groupedMaterials[standard][stream][subject].length} 
                                        size="small" 
                                        color="info" 
                                        sx={{ ml: 2 }}
                                      />
                                    </Box>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {groupedMaterials[standard][stream][subject].length > 0 ? (
                                      <Grid container spacing={2}>
                                        {groupedMaterials[standard][stream][subject].map(material => (
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
                                                    variant="outlined" 
                                                    color="primary"
                                                    onClick={() => openMaterial(material)}
                                                    size="small"
                                                    sx={{ flexGrow: 1, fontSize: "0.75rem" }}
                                                  >
                                                    Open
                                                  </Button>
                                                  <IconButton 
                                                    color="primary"
                                                    onClick={() => handleEditMaterial(material)}
                                                    size="small"
                                                  >
                                                    <EditIcon fontSize="small" />
                                                  </IconButton>
                                                  <IconButton 
                                                    color="error"
                                                    onClick={() => handleDeleteMaterial(material.id)}
                                                    size="small"
                                                  >
                                                    <DeleteIcon fontSize="small" />
                                                  </IconButton>
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
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        ))
                      ) : (
                        // For standards 5-10, show subjects directly
                        baseSubjects.map(subject => (
                          <Accordion 
                            key={`${standard}-${subject}`}
                            expanded={expandedSubject === subject && expandedStandard === standard}
                            onChange={() => handleSubjectChange(subject)}
                            sx={{ mb: 1 }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <SubjectIcon sx={{ color: "secondary.main", mr: 2 }} />
                                <Typography variant="subtitle1" fontWeight={500}>
                                  {subject}
                                </Typography>
                                <Chip 
                                  label={groupedMaterials[standard][subject].length} 
                                  size="small" 
                                  color="secondary" 
                                  sx={{ ml: 2 }}
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              {groupedMaterials[standard][subject].length > 0 ? (
                                <Grid container spacing={2}>
                                  {groupedMaterials[standard][subject].map(material => (
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
                                              variant="outlined" 
                                              color="primary"
                                              onClick={() => openMaterial(material)}
                                              size="small"
                                              sx={{ flexGrow: 1, fontSize: "0.75rem" }}
                                            >
                                              Open
                                            </Button>
                                            <IconButton 
                                              color="primary"
                                              onClick={() => handleEditMaterial(material)}
                                              size="small"
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                              color="error"
                                              onClick={() => handleDeleteMaterial(material.id)}
                                              size="small"
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
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
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {materials.length === 0 && !loading && (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 8 }}>
                <MaterialsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No study materials available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add your first study material to get started
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddMaterial}
                >
                  Add Material
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* PDF Viewer Dialog */}
      <MuiDialog
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
      </MuiDialog>

      {/* Add/Edit Material Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? "Edit Material" : "Add New Material"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={currentMaterial.title}
            onChange={(e) => setCurrentMaterial({...currentMaterial, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={currentMaterial.description}
            onChange={(e) => setCurrentMaterial({...currentMaterial, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Standard</InputLabel>
            <Select
              value={currentMaterial.standard}
              onChange={(e) => {
                const newStandard = e.target.value;
                // Reset stream and subject when standard changes
                setCurrentMaterial({
                  ...currentMaterial, 
                  standard: newStandard,
                  stream: "",
                  subject: ""
                });
              }}
              label="Standard"
            >
              {standards.map(standard => (
                <MenuItem key={standard} value={standard}>{standard}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* Show stream selection only for standards 11-12 */}
          {(currentMaterial.standard === "Std 11" || currentMaterial.standard === "Std 12") && (
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Stream</InputLabel>
              <Select
                value={currentMaterial.stream}
                onChange={(e) => {
                  const newStream = e.target.value;
                  // Reset subject when stream changes
                  setCurrentMaterial({
                    ...currentMaterial, 
                    stream: newStream,
                    subject: ""
                  });
                }}
                label="Stream"
              >
                {Object.keys(streamSubjects[currentMaterial.standard]).map(stream => (
                  <MenuItem key={stream} value={stream}>{stream}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={currentMaterial.subject}
              onChange={(e) => setCurrentMaterial({...currentMaterial, subject: e.target.value})}
              label="Subject"
              disabled={!currentMaterial.standard || (currentMaterial.standard === "Std 11" || currentMaterial.standard === "Std 12") && !currentMaterial.stream}
            >
              {getSubjectsForStandard(currentMaterial.standard, currentMaterial.stream).map(subject => (
                <MenuItem key={subject} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={currentMaterial.type}
              onChange={(e) => {
                setCurrentMaterial({
                  ...currentMaterial, 
                  type: e.target.value,
                  url: "",
                  file: null
                });
                setUploadTab(e.target.value === "pdf" ? 0 : 1);
              }}
              label="Type"
            >
              <MenuItem value="pdf">PDF Document</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="link">External Link</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          
          {/* Tabs for PDF and Video content */}
          {(currentMaterial.type === "pdf" || currentMaterial.type === "video") && (
            <Box sx={{ mb: 2 }}>
              <Tabs value={uploadTab} onChange={handleTabChange}>
                <Tab 
                  icon={<UploadIcon />} 
                  label="Upload File" 
                  id="upload-tab"
                />
                <Tab 
                  icon={currentMaterial.type === "video" ? <YouTubeIcon /> : <LinkIcon />} 
                  label={currentMaterial.type === "video" ? "YouTube URL" : "External URL"} 
                  id="url-tab"
                />
              </Tabs>
            </Box>
          )}
          
          {/* Upload content for PDF */}
          {currentMaterial.type === "pdf" && uploadTab === 0 && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
                sx={{ py: 2, mb: 1 }}
              >
                Upload PDF File
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
              </Button>
              {currentMaterial.file && (
                <Typography variant="body2" color="text.secondary">
                  Selected file: {currentMaterial.file.name}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Maximum file size: 10MB
              </Typography>
            </Box>
          )}
          
          {/* URL content for PDF */}
          {currentMaterial.type === "pdf" && uploadTab === 1 && (
            <TextField
              margin="dense"
              label="PDF URL"
              fullWidth
              variant="outlined"
              value={currentMaterial.url}
              onChange={(e) => setCurrentMaterial({...currentMaterial, url: e.target.value})}
              placeholder="https://example.com/document.pdf"
            />
          )}
          
          {/* Video content */}
          {currentMaterial.type === "video" && (
            <Box sx={{ mb: 2 }}>
              {uploadTab === 0 && (
                <Box>
                  <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend">Video Source</FormLabel>
                    <RadioGroup
                      row
                      value={currentMaterial.videoSource}
                      onChange={handleVideoSourceChange}
                    >
                      <FormControlLabel value="youtube" control={<Radio />} label="YouTube" />
                      <FormControlLabel value="upload" control={<Radio />} label="Upload File" />
                    </RadioGroup>
                  </FormControl>
                  
                  {currentMaterial.videoSource === "youtube" ? (
                    <TextField
                      margin="dense"
                      label="YouTube URL"
                      fullWidth
                      variant="outlined"
                      value={currentMaterial.url}
                      onChange={(e) => setCurrentMaterial({...currentMaterial, url: e.target.value})}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  ) : (
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        startIcon={<UploadIcon />}
                        sx={{ py: 2, mb: 1 }}
                      >
                        Upload Video File
                        <input
                          type="file"
                          hidden
                          accept="video/*"
                          onChange={handleFileUpload}
                          ref={fileInputRef}
                        />
                      </Button>
                      {currentMaterial.file && (
                        <Typography variant="body2" color="text.secondary">
                          Selected file: {currentMaterial.file.name}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Maximum file size: 10MB
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              
              {uploadTab === 1 && (
                <TextField
                  margin="dense"
                  label="Video URL"
                  fullWidth
                  variant="outlined"
                  value={currentMaterial.url}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, url: e.target.value})}
                  placeholder="https://example.com/video.mp4"
                />
              )}
            </Box>
          )}
          
          {/* URL for other types */}
          {(currentMaterial.type === "link" || currentMaterial.type === "other") && (
            <TextField
              margin="dense"
              label="URL"
              fullWidth
              variant="outlined"
              value={currentMaterial.url}
              onChange={(e) => setCurrentMaterial({...currentMaterial, url: e.target.value})}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveMaterial} variant="contained" color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default ManageMaterials;