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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  EventNote as AttendanceIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  CalendarToday as CalendarIcon
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

function ManageAttendance() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({
    id: null,
    studentId: "",
    studentName: "",
    date: new Date().toISOString().split('T')[0],
    subject: "",
    status: "Present"
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch attendance and students from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      
      const attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
      const studentsData = JSON.parse(localStorage.getItem("students")) || [];
      
      setAttendance(attendanceData);
      setStudents(studentsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  const saveAttendance = (attendanceToSave) => {
    try {
      localStorage.setItem("attendance", JSON.stringify(attendanceToSave));
      // Trigger a custom event to update the dashboard
      window.dispatchEvent(new Event('dataUpdated'));
    } catch (err) {
      console.error("Error saving attendance:", err);
      setError("Failed to save attendance. Please try again.");
    }
  };

  const handleAddRecord = () => {
    setCurrentRecord({
      id: Date.now(), // Simple ID generation
      studentId: "",
      studentName: "",
      date: new Date().toISOString().split('T')[0],
      subject: "",
      status: "Present"
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEditRecord = (record) => {
    setCurrentRecord(record);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      const updatedAttendance = attendance.filter(record => record.id !== id);
      setAttendance(updatedAttendance);
      saveAttendance(updatedAttendance);
    }
  };

  const handleSaveRecord = () => {
    if (!currentRecord.studentId || !currentRecord.date || !currentRecord.subject) {
      setError("Please fill in all required fields.");
      return;
    }

    // Get student name from student ID
    const student = students.find(s => s.id === currentRecord.studentId); // Fixed: Changed == to ===
    if (student) {
      currentRecord.studentName = student.name;
    }

    let updatedAttendance;
    if (isEditing) {
      updatedAttendance = attendance.map(record => 
        record.id === currentRecord.id ? currentRecord : record
      );
    } else {
      updatedAttendance = [...attendance, currentRecord];
    }

    setAttendance(updatedAttendance);
    saveAttendance(updatedAttendance);
    setOpenDialog(false);
  };

  // Calculate attendance statistics
  const totalRecords = attendance.length;
  const presentRecords = attendance.filter(record => record.status === "Present").length;
  const attendancePercentage = totalRecords > 0 
    ? Math.round((presentRecords / totalRecords) * 100) 
    : 0;

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
              <AttendanceIcon sx={{ color: "primary.main", mr: 2 }} />
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
              <AttendanceIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Manage Students</Typography>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 2, 
              mb: 1, 
              borderRadius: 2, 
              bgcolor: "rgba(106, 17, 203, 0.08)" 
            }}>
              <AttendanceIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1" fontWeight={500}>Manage Attendance</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, overflow: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                Manage Attendance
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage student attendance records.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddRecord}
            >
              Add Record
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
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(106, 17, 203, 0.1)", 
                        color: "primary.main",
                        mr: 2
                      }}
                    >
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                        {totalRecords}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Records
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(76, 175, 80, 0.1)", 
                        color: "success.main",
                        mr: 2
                      }}
                    >
                      <PresentIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                        {presentRecords}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Present
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(244, 67, 54, 0.1)", 
                        color: "error.main",
                        mr: 2
                      }}
                    >
                      <AbsentIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                        {attendancePercentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Attendance Rate
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Attendance Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : attendance.length > 0 ? (
            <Card>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendance.map((record) => (
                        <TableRow key={record.id}>
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
                                {record.studentName ? record.studentName.charAt(0) : "S"}
                              </Avatar>
                              <Typography variant="body2" fontWeight={500}>
                                {record.studentName || "Unknown Student"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                              {record.date}
                            </Box>
                          </TableCell>
                          <TableCell>{record.subject}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={record.status}
                              size="small"
                              color={record.status === "Present" ? "success" : "error"}
                              icon={record.status === "Present" ? <PresentIcon /> : <AbsentIcon />}
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              color="primary"
                              onClick={() => handleEditRecord(record)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error"
                              onClick={() => handleDeleteRecord(record.id)}
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
                <AttendanceIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No attendance records found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add your first attendance record to get started
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddRecord}
                >
                  Add Record
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      {/* Add/Edit Attendance Record Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? "Edit Attendance Record" : "Add New Attendance Record"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Student</InputLabel>
                <Select
                  value={currentRecord.studentId}
                  onChange={(e) => setCurrentRecord({...currentRecord, studentId: e.target.value})}
                  label="Student"
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={currentRecord.date}
                onChange={(e) => setCurrentRecord({...currentRecord, date: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Subject"
                fullWidth
                variant="outlined"
                value={currentRecord.subject}
                onChange={(e) => setCurrentRecord({...currentRecord, subject: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentRecord.status}
                  onChange={(e) => setCurrentRecord({...currentRecord, status: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="Present">Present</MenuItem>
                  <MenuItem value="Absent">Absent</MenuItem>
                  <MenuItem value="Late">Late</MenuItem>
                  <MenuItem value="Excused">Excused</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRecord} variant="contained" color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default ManageAttendance;