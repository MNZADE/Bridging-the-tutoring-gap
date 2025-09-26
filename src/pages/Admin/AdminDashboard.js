import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Grid, Button, Paper, Avatar, ThemeProvider, createTheme, CircularProgress, Alert
} from "@mui/material";
import {
  People as StudentsIcon,
  EventNote as AttendanceIcon,
  MenuBook as MaterialsIcon,
  Quiz as QuizIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  BarChart as ChartIcon
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

// Analytics Page Component
function AnalyticsPage() {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Analytics Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/admin')}
        >
          Back to Dashboard
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Performance Trends</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Student performance over time
              </Typography>
              <Box sx={{ height: 200, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Chart Placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChartIcon color="secondary" sx={{ mr: 2 }} />
                <Typography variant="h6">Subject Analytics</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Performance by subject
              </Typography>
              <Box sx={{ height: 200, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Chart Placeholder</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Detailed Reports</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Generate and view comprehensive reports
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" color="primary" fullWidth>
                    Student Performance
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" color="secondary" fullWidth>
                    Attendance Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="outlined" color="primary" fullWidth>
                    Quiz Analytics
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgAttendance: 0,
    totalMaterials: 0,
    activeQuizzes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [debugInfo, setDebugInfo] = useState({});

  // Handle logout function
  const handleLogout = () => {
    // Clear any authentication tokens or user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Redirect to homepage
    navigate('/');
  };

  // Calculate statistics from localStorage data only (no API calls)
  const calculateStats = () => {
    try {
      console.log("Calculating stats from localStorage...");
      setLoading(true);
      setError(null);

      // Debug: Log all localStorage keys
      const localStorageKeys = Object.keys(localStorage);
      console.log("LocalStorage keys:", localStorageKeys);

      // Create debug info object
      const newDebugInfo = {};

      // Get students data - try multiple possible keys
      let students = [];
      const studentKeys = ["students", "users", "studentData", "userData"];

      for (const key of studentKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            students = JSON.parse(data);
            console.log(`Found ${students.length} students in key: ${key}`);
            newDebugInfo.studentsKey = key;
            newDebugInfo.studentsCount = students.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      const totalStudents = Array.isArray(students) ? students.length : 0;
      console.log("Total students:", totalStudents);

      // Get attendance data and calculate average
      let attendance = [];
      const attendanceKeys = ["attendance", "attendanceData"];

      for (const key of attendanceKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            attendance = JSON.parse(data);
            console.log(`Found ${attendance.length} attendance records in key: ${key}`);
            newDebugInfo.attendanceKey = key;
            newDebugInfo.attendanceCount = attendance.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      let totalAttendanceRecords = 0;
      let presentRecords = 0;

      if (Array.isArray(attendance)) {
        attendance.forEach(record => {
          totalAttendanceRecords++;
          if (record.status === "Present") {
            presentRecords++;
          }
        });
      }

      const avgAttendance = totalAttendanceRecords > 0
        ? Math.round((presentRecords / totalAttendanceRecords) * 100)
        : 0;
      console.log("Average attendance:", avgAttendance);
      newDebugInfo.avgAttendance = avgAttendance;

      // Get study materials count
      let materials = [];
      const materialKeys = ["studyMaterials", "materials", "resources"];

      for (const key of materialKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            materials = JSON.parse(data);
            console.log(`Found ${materials.length} materials in key: ${key}`);
            newDebugInfo.materialsKey = key;
            newDebugInfo.materialsCount = materials.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      const totalMaterials = Array.isArray(materials) ? materials.length : 0;
      console.log("Total materials:", totalMaterials);

      // Get quizzes data
      let quizzes = [];
      const quizKeys = ["quizzes", "quizData", "quizResults"];

      for (const key of quizKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            quizzes = JSON.parse(data);
            console.log(`Found ${quizzes.length} quizzes in key: ${key}`);
            newDebugInfo.quizzesKey = key;
            newDebugInfo.quizzesCount = quizzes.length;
            break;
          } catch (e) {
            console.error(`Error parsing ${key}:`, e);
          }
        }
      }

      const activeQuizzes = Array.isArray(quizzes)
        ? quizzes.filter(quiz => quiz.isActive !== false).length
        : 0;
      console.log("Active quizzes:", activeQuizzes);

      setStats({
        totalStudents,
        avgAttendance,
        totalMaterials,
        activeQuizzes
      });

      setDebugInfo(newDebugInfo);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error calculating stats:", error);
      setError("Failed to load statistics. Please try again.");
      setLoading(false);
    }
  };

  // Function to add sample data for testing
  const addSampleData = () => {
    try {
      // Add sample students
      const sampleStudents = [
        { id: 1, name: "John Doe", email: "john@example.com", grade: "10" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", grade: "11" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", grade: "9" }
      ];
      localStorage.setItem("students", JSON.stringify(sampleStudents));

      // Add sample attendance
      const sampleAttendance = [
        { id: 1, studentId: 1, date: "2023-09-01", subject: "Math", status: "Present" },
        { id: 2, studentId: 2, date: "2023-09-01", subject: "Math", status: "Present" },
        { id: 3, studentId: 3, date: "2023-09-01", subject: "Math", status: "Absent" }
      ];
      localStorage.setItem("attendance", JSON.stringify(sampleAttendance));

      // Add sample materials
      const sampleMaterials = [
        { id: 1, title: "Algebra Basics", type: "pdf", url: "#" },
        { id: 2, title: "Chemistry Lab Safety", type: "video", url: "#" }
      ];
      localStorage.setItem("studyMaterials", JSON.stringify(sampleMaterials));

      // Add sample quizzes
      const sampleQuizzes = [
        { id: 1, title: "Math Quiz 1", isActive: true },
        { id: 2, title: "Science Quiz 1", isActive: true }
      ];
      localStorage.setItem("quizzes", JSON.stringify(sampleQuizzes));

      // Trigger a refresh
      calculateStats();

      alert("Sample data has been added. Statistics should now update.");
    } catch (error) {
      console.error("Error adding sample data:", error);
      alert("Failed to add sample data.");
    }
  };

  useEffect(() => {
    calculateStats();

    // Set up a listener to update stats when data changes
    const handleStorageChange = (e) => {
      console.log("Storage change detected:", e);
      calculateStats();
    };

    // Also check for custom events that might be triggered by your app
    const handleCustomEvent = () => {
      console.log("Custom data change event detected");
      calculateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleCustomEvent);

    // Set up an interval to refresh data periodically (every 30 seconds)
    const intervalId = setInterval(calculateStats, 30000);

    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, []);

  const features = [
    {
      name: "Manage Students",
      route: "/admin/students",
      icon: <StudentsIcon />,
      description: "View, add, edit and remove student profiles",
      color: "primary"
    },
    {
      name: "Manage Attendance",
      route: "/admin/attendance",
      icon: <AttendanceIcon />,
      description: "Track and manage student attendance records",
      color: "secondary"
    },
    {
      name: "Manage Study Materials",
      route: "/admin/materials",
      icon: <MaterialsIcon />,
      description: "Upload and organize educational resources",
      color: "primary"
    },
    {
      name: "Add Quizzes (ML)",
      route: "/admin/quizzes",
      icon: <QuizIcon />,
      description: "Create AI-powered quizzes with machine learning",
      color: "secondary"
    }
  ];

  const statsData = [
    {
      title: "Total Students",
      value: loading ? "..." : stats.totalStudents,
      icon: <StudentsIcon />,
      color: "primary"
    },
    {
      title: "Avg. Attendance",
      value: loading ? "..." : `${stats.avgAttendance}%`,
      icon: <AttendanceIcon />,
      color: "secondary"
    },
    {
      title: "Materials",
      value: loading ? "..." : stats.totalMaterials,
      icon: <MaterialsIcon />,
      color: "primary"
    },
    {
      title: "Active Quizzes",
      value: loading ? "..." : stats.activeQuizzes,
      icon: <QuizIcon />,
      color: "secondary"
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        flexDirection: { xs: "column", md: "row" }
      }}>
        {/* Sidebar */}
        <Paper
          elevation={1}
          sx={{
            width: { xs: "100%", md: 260 },
            display: "flex",
            flexDirection: "column",
            borderRight: { md: "1px solid rgba(0, 0, 0, 0.08)" },
            borderBottom: { xs: "1px solid rgba(0, 0, 0, 0.08)", md: "none" },
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

          <Box sx={{ p: 2, flex: 1 }}>
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                p: 2, 
                mb: 1, 
                borderRadius: 2, 
                bgcolor: "rgba(106, 17, 203, 0.08)" 
              }}
            >
              <DashboardIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1" fontWeight={500}>Dashboard</Typography>
            </Box>

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
              onClick={() => navigate('/admin/analytics')}
            >
              <AnalyticsIcon sx={{ color: "primary.main", mr: 2 }} />
              <Typography variant="body1">Analytics</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
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
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflow: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to the administrative control panel. Manage your educational institution from here.
              </Typography>
              {lastUpdated && (
                <Typography variant="caption" color="text.secondary">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={calculateStats}
                disabled={loading}
              >
                Refresh Data
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addSampleData}
              >
                Add Sample Data
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Debug Information */}
          <Card sx={{ mb: 3, bgcolor: "rgba(0, 0, 0, 0.02)" }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Debug Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Students:</strong> {debugInfo.studentsKey || "Not found"} ({debugInfo.studentsCount || 0} items)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Attendance:</strong> {debugInfo.attendanceKey || "Not found"} ({debugInfo.attendanceCount || 0} items)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Materials:</strong> {debugInfo.materialsKey || "Not found"} ({debugInfo.materialsCount || 0} items)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Quizzes:</strong> {debugInfo.quizzesKey || "Not found"} ({debugInfo.quizzesCount || 0} items)
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsData.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: stat.color === "primary" ? "rgba(106, 17, 203, 0.1)" : "rgba(37, 117, 252, 0.1)",
                          color: stat.color === "primary" ? "primary.main" : "secondary.main",
                          mr: 2
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        {loading ? (
                          <CircularProgress size={24} thickness={4} />
                        ) : (
                          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                            {stat.value}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Features Grid */}
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
                    }
                  }}
                  onClick={() => navigate(feature.route)}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 2,
                        bgcolor: feature.color === "primary" ? "rgba(106, 17, 203, 0.1)" : "rgba(37, 117, 252, 0.1)",
                        color: feature.color === "primary" ? "primary.main" : "secondary.main",
                        fontSize: 28
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color={feature.color}
                      size="small"
                      sx={{ mt: "auto" }}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Card sx={{ mt: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => navigate('/admin/students')}
                  >
                    Add New Student
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    onClick={() => navigate('/admin/materials')}
                  >
                    Upload Material
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    onClick={() => navigate('/admin/analytics')}
                  >
                    View Reports
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth
                    onClick={() => navigate('/admin/quizzes')}
                  >
                    Create Quiz
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminDashboard;
export { AnalyticsPage };