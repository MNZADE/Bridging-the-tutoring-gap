import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Box,
  Chip,
  Paper,
  Button
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScienceIcon from "@mui/icons-material/Science";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CalculateIcon from "@mui/icons-material/Calculate";
import PublicIcon from "@mui/icons-material/Public";
import BiotechIcon from "@mui/icons-material/Biotech";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ReceiptIcon from "@mui/icons-material/Receipt";

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
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
          },
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
      },
    },
  },
});

function QuizSubjects() {
  const navigate = useNavigate();
  const location = useLocation();
  const standard = location.state?.standard;
  const stream = location.state?.stream;
  
  // Define subjects based on standard and stream
  const getSubjects = () => {
    if (standard <= 10) {
      return [
        { id: "math", name: "Mathematics", icon: <CalculateIcon />, color: "#2196f3" },
        { id: "english", name: "English", icon: <MenuBookIcon />, color: "#4caf50" },
        { id: "science", name: "Science", icon: <ScienceIcon />, color: "#f44336" },
        { id: "social", name: "Social Studies", icon: <PublicIcon />, color: "#ff9800" }
      ];
    } else if (standard === 11 || standard === 12) {
      if (stream === "Science") {
        return [
          { id: "physics", name: "Physics", icon: <ScienceIcon />, color: "#2196f3" },
          { id: "chemistry", name: "Chemistry", icon: <LocalFireDepartmentIcon />, color: "#f44336" },
          { id: "biology", name: "Biology", icon: <BiotechIcon />, color: "#4caf50" },
          { id: "math", name: "Mathematics", icon: <CalculateIcon />, color: "#9c27b0" },
          { id: "english", name: "English", icon: <MenuBookIcon />, color: "#ff9800" }
        ];
      } else if (stream === "Arts") {
        return [
          { id: "history", name: "History", icon: <HistoryEduIcon />, color: "#2196f3" },
          { id: "economics", name: "Economics", icon: <AccountBalanceIcon />, color: "#4caf50" },
          { id: "math", name: "Mathematics", icon: <CalculateIcon />, color: "#f44336" },
          { id: "english", name: "English", icon: <MenuBookIcon />, color: "#ff9800" },
          { id: "social", name: "Social Studies", icon: <PublicIcon />, color: "#9c27b0" }
        ];
      } else if (stream === "Commerce") {
        return [
          { id: "accounts", name: "Accounts", icon: <ReceiptIcon />, color: "#2196f3" },
          { id: "economics", name: "Economics", icon: <AccountBalanceIcon />, color: "#4caf50" },
          { id: "math", name: "Business Mathematics", icon: <CalculateIcon />, color: "#f44336" },
          { id: "english", name: "English", icon: <MenuBookIcon />, color: "#ff9800" },
          { id: "social", name: "Business Studies", icon: <PublicIcon />, color: "#9c27b0" }
        ];
      }
    }
    
    // Default fallback
    return [
      { id: "math", name: "Mathematics", icon: <CalculateIcon />, color: "#2196f3" },
      { id: "english", name: "English", icon: <MenuBookIcon />, color: "#4caf50" },
      { id: "science", name: "Science", icon: <ScienceIcon />, color: "#f44336" },
      { id: "social", name: "Social Studies", icon: <PublicIcon />, color: "#ff9800" }
    ];
  };

  const subjects = getSubjects();

  const handleCardClick = (subject) => {
    navigate("/quiz-levels", { 
      state: { 
        standard, 
        stream,
        subject: subject.name 
      } 
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        py: 8
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={600}
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Select Subject
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {standard <= 10 
                ? `Standard ${standard}` 
                : `Standard ${standard} - ${stream} Stream`
              }
            </Typography>
          </Box>
          
          {standard > 10 && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                textAlign: "center"
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {stream === "Science" && "Science stream focuses on Physics, Chemistry, Biology, and advanced Mathematics"}
                {stream === "Arts" && "Arts stream focuses on History, Economics, Languages, and Social Sciences"}
                {stream === "Commerce" && "Commerce stream focuses on Accounts, Economics, Business Studies, and Applied Mathematics"}
              </Typography>
            </Paper>
          )}
          
          <Grid container spacing={3}>
            {subjects.map((subject) => (
              <Grid item xs={12} sm={6} md={4} key={subject.id}>
                <Card 
                  onClick={() => handleCardClick(subject)}
                  sx={{ 
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <Box 
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                          backgroundColor: `${subject.color}20`,
                        }}
                      >
                        <Box sx={{ color: subject.color }}>
                          {subject.icon}
                        </Box>
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {subject.name}
                      </Typography>
                      <Chip 
                        label={standard <= 10 ? "General" : stream}
                        size="small" 
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box textAlign="center" mt={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: "rgba(106, 17, 203, 0.05)",
                border: "1px dashed rgba(106, 17, 203, 0.2)"
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Not sure which subject to select? 
                <Button 
                  variant="text" 
                  color="primary"
                  sx={{ fontWeight: 500, ml: 0.5 }}
                  onClick={() => navigate("/help")}
                >
                  Get help
                </Button>
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default QuizSubjects;