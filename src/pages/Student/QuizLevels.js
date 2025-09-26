import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Typography, 
  Card, 
  CardContent, 
  Container,
  Grid,
  Chip,
  Box  // Added missing Box import
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
        },
      },
    },
  },
});

function QuizLevels() {
  const navigate = useNavigate();
  const location = useLocation();
  const { standard, subject } = location.state;
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const getLevelColor = (level) => {
    switch(level) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "error";
      default: return "primary";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          textAlign="center"
          fontWeight={600}
        >
          Select Quiz Level
        </Typography>
        
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {subject} - Std {standard}
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {levels.map((level, index) => (
            <Grid item xs={12} key={index}>
              <Card 
                onClick={() => navigate("/quiz-play", { state: { standard, subject, level } })}
                sx={{ 
                  p: 3, 
                  textAlign: "center",
                  background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight={500}>
                    {level}
                  </Typography>
                </CardContent>
                <Box sx={{ pr: 2 }}>
                  <Chip 
                    label={level} 
                    color={getLevelColor(level)} 
                    size="medium"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default QuizLevels;