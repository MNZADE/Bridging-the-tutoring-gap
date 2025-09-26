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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  People as StudentsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
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

function ManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    grade: "",
    class: "",
    enrollmentDate: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch students from localStorage
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    try {
      setLoading(true);
      const studentsData = JSON.parse(localStorage.getItem("students")) || [];
      setStudents(studentsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading students:", err);
      setError("Failed to load students. Please try again.");
      setLoading(false);
    }
  };

  const saveStudents = (studentsToSave) => {
    try {
      localStorage.setItem("students", JSON.stringify(studentsToSave));
      // Trigger a custom event to update the dashboard
      window.dispatchEvent(new Event('dataUpdated'));
    } catch (err) {
      console.error("Error saving students:", err);
      setError("Failed to save students. Please try again.");
    }
  };

  const handleAddStudent = () => {
    setCurrentStudent({
      id: Date.now(), // Simple ID generation
      name: "",
      email: "",
      phone: "",
      grade: "",
      class: "",
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const updatedStudents = students.filter(student => student.id !== id);
      setStudents(updatedStudents);
      saveStudents(updatedStudents);
    }
  };

  const handleSaveStudent = () => {
    if (!currentStudent.name || !currentStudent.email) {
      setError("Please fill in all required fields.");
      return;
    }

    let updatedStudents;
    if (isEditing) {
      updatedStudents = students.map(student => 
        student.id === currentStudent.id ? currentStudent : student
      );
    } else {
      updatedStudents = [...students, currentStudent];
    }

    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    setOpenDialog(false);
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
              <StudentsIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Manage Materials</Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 2, 
              mb: 1, 
              borderRadius: 2, 
              bgcolor: "rgba(106, 17, 203, 0.08)" 
            }}>
              <StudentsIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1" fontWeight={500}>Manage Students</Typography>
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
              <StudentsIcon sx={{ color: "primary.main", mr: 2 }} />
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
                Manage Students
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Add, edit, and manage student profiles and information.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddStudent}
            >
              Add Student
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Students Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : students.length > 0 ? (
            <Card>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Enrollment Date</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: "primary.main", 
                                  mr: 2,
                                  width: 32, 
                                  height: 32 
                                }}
                              >
                                {student.name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {student.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                              {student.email}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                              {student.phone || "N/A"}
                            </Box>
                          </TableCell>
                          <TableCell>{student.grade || "N/A"}</TableCell>
                          <TableCell>{student.class || "N/A"}</TableCell>
                          <TableCell>{student.enrollmentDate || "N/A"}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              color="primary"
                              onClick={() => handleEditStudent(student)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteStudent(student.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: "center", py: 8 }}>
                <StudentsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No students registered
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add your first student to get started
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddStudent}
                >
                  Add Student
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? "Edit Student" : "Add New Student"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                label="Full Name"
                fullWidth
                variant="outlined"
                value={currentStudent.name}
                onChange={(e) => setCurrentStudent({...currentStudent, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={currentStudent.email}
                onChange={(e) => setCurrentStudent({...currentStudent, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Phone Number"
                fullWidth
                variant="outlined"
                value={currentStudent.phone}
                onChange={(e) => setCurrentStudent({...currentStudent, phone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Grade"
                fullWidth
                variant="outlined"
                value={currentStudent.grade}
                onChange={(e) => setCurrentStudent({...currentStudent, grade: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Class"
                fullWidth
                variant="outlined"
                value={currentStudent.class}
                onChange={(e) => setCurrentStudent({...currentStudent, class: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Enrollment Date"
                type="date"
                fullWidth
                variant="outlined"
                value={currentStudent.enrollmentDate}
                onChange={(e) => setCurrentStudent({...currentStudent, enrollmentDate: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveStudent} variant="contained" color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default ManageStudents;