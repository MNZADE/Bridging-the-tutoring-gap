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
  ListItemIcon,  // Added this import
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
  TableRow,
  CalendarMonth,
  PieChart,
  BarChart
} from "@mui/material";
import { 
  ArrowBack as BackIcon,
  EventNote as AttendanceIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  CalendarToday as CalendarIcon,
  TrendingUp
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

function Attendance() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch attendance from localStorage
  useEffect(() => {
    const attendanceData = JSON.parse(localStorage.getItem("attendance")) || [
      { id: 1, date: "2023-09-01", subject: "Mathematics", status: "Present" },
      { id: 2, date: "2023-09-02", subject: "Science", status: "Present" },
      { id: 3, date: "2023-09-03", subject: "English", status: "Absent" },
      { id: 4, date: "2023-09-04", subject: "History", status: "Present" },
      { id: 5, date: "2023-09-05", subject: "Mathematics", status: "Present" },
      { id: 6, date: "2023-09-06", subject: "Science", status: "Present" },
      { id: 7, date: "2023-09-07", subject: "English", status: "Present" },
      { id: 8, date: "2023-09-08", subject: "History", status: "Absent" },
      { id: 9, date: "2023-09-09", subject: "Mathematics", status: "Present" },
      { id: 10, date: "2023-09-10", subject: "Science", status: "Present" },
    ];
    setAttendance(attendanceData);
  }, []);

  // Calculate statistics
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === "Present").length;
  const absentDays = attendance.filter(a => a.status === "Absent").length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Group attendance by subject
  const attendanceBySubject = {};
  attendance.forEach(record => {
    if (!attendanceBySubject[record.subject]) {
      attendanceBySubject[record.subject] = {
        total: 0,
        present: 0
      };
    }
    attendanceBySubject[record.subject].total += 1;
    if (record.status === "Present") {
      attendanceBySubject[record.subject].present += 1;
    }
  });

  // Filter attendance based on status
  const filteredAttendance = filter === "all" 
    ? attendance 
    : attendance.filter(record => record.status === filter);

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
                { text: "Study Materials", icon: <AttendanceIcon />, path: "/materials" },
                { text: "Quizzes", icon: <AttendanceIcon />, path: "/select-standard" },
                { text: "Results", icon: <AttendanceIcon />, path: "/quiz-results" },
                { text: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
                { text: "Educators", icon: <AttendanceIcon />, path: "/educators" },
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
              Attendance
            </Typography>
          </Box>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TrendingUp sx={{ color: "primary.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Overall Attendance
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
                    <PresentIcon sx={{ color: "success.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Days Present
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mr: 2 }}>
                      {presentDays}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      of {totalDays} days
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AbsentIcon sx={{ color: "error.main", mr: 2, fontSize: 28 }} />
                    <Typography variant="h6" component="h3">
                      Days Absent
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mr: 2 }}>
                      {absentDays}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      of {totalDays} days
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filter Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                  Filter by status:
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
                  variant={filter === "Present" ? "contained" : "outlined"}
                  color="success"
                  size="small"
                  onClick={() => setFilter("Present")}
                  sx={{ mr: 1 }}
                >
                  Present
                </Button>
                <Button 
                  variant={filter === "Absent" ? "contained" : "outlined"}
                  color="error"
                  size="small"
                  onClick={() => setFilter("Absent")}
                >
                  Absent
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Attendance Records
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {filteredAttendance.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <AttendanceIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No attendance records available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendance records will appear here once available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Attendance by Subject */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Attendance by Subject
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {Object.keys(attendanceBySubject).length > 0 ? (
                <Grid container spacing={2}>
                  {Object.entries(attendanceBySubject).map(([subject, data]) => {
                    const percentage = Math.round((data.present / data.total) * 100);
                    return (
                      <Grid item xs={12} md={6} key={subject}>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body1" fontWeight={500}>
                              {subject}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: "rgba(106, 17, 203, 0.1)"
                            }} 
                          />
                          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Present: {data.present}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Total: {data.total}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No subject data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Attendance;