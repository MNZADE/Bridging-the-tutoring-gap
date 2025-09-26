import React from "react";
import { useNavigate } from "react-router-dom";
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
import { 
  Science as ScienceIcon,
  Palette as ArtsIcon,
  AccountBalance as CommerceIcon,
  School as SchoolIcon
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
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
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
        },
      },
    },
  },
});

function SelectStandard() {
  const navigate = useNavigate();
  
  // Standards 5-10 are simple numbers, 11-12 are objects with stream info
  const standards = [
    { id: 5, label: "5th Standard" },
    { id: 6, label: "6th Standard" },
    { id: 7, label: "7th Standard" },
    { id: 8, label: "8th Standard" },
    { id: 9, label: "9th Standard" },
    { id: 10, label: "10th Standard" },
    { id: 11, label: "11th Standard", streams: ["Science", "Arts", "Commerce"] },
    { id: 12, label: "12th Standard", streams: ["Science", "Arts", "Commerce"] },
  ];

  const handleCardClick = (standard, stream = null) => {
    navigate("/quiz-subjects", { 
      state: { 
        standard: standard.id,
        stream: stream
      } 
    });
  };

  const getStreamIcon = (stream) => {
    switch(stream) {
      case "Science": return <ScienceIcon fontSize="large" />;
      case "Arts": return <ArtsIcon fontSize="large" />;
      case "Commerce": return <CommerceIcon fontSize="large" />;
      default: return <SchoolIcon fontSize="large" />;
    }
  };

  const getStreamColor = (stream) => {
    switch(stream) {
      case "Science": return "#4caf50";
      case "Arts": return "#ff9800";
      case "Commerce": return "#2196f3";
      default: return "#9c27b0";
    }
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
              variant="h2" 
              component="h1" 
              fontWeight={600}
              gutterBottom
              sx={{
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Select Your Standard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Choose your educational level to begin your learning journey
            </Typography>
          </Box>

          {/* Standards 5-10 */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {standards.filter(s => !s.streams).map((standard) => (
              <Grid item xs={12} sm={6} md={4} key={standard.id}>
                <Card 
                  onClick={() => handleCardClick(standard)}
                  sx={{
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <Box 
                        sx={{ 
                          width: 70, 
                          height: 70, 
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 16px",
                          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                        }}
                      >
                        <SchoolIcon sx={{ fontSize: 36, color: "white" }} />
                      </Box>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        {standard.label}
                      </Typography>
                      <Chip 
                        label="General" 
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

          {/* Standards 11-12 with streams */}
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h4" 
              fontWeight={600} 
              mb={4}
              textAlign="center"
              sx={{ color: "primary.main" }}
            >
              Higher Secondary Standards
            </Typography>
            
            <Grid container spacing={6}>
              {standards.filter(s => s.streams).map((standard) => (
                <Grid item xs={12} md={6} key={standard.id}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 4, 
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      fontWeight={600} 
                      mb={3}
                      textAlign="center"
                      sx={{ color: "primary.main" }}
                    >
                      {standard.label}
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {standard.streams.map((stream) => (
                        <Grid item xs={12} key={`${standard.id}-${stream}`}>
                          <Card 
                            onClick={() => handleCardClick(standard, stream)}
                            sx={{
                              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                              border: "1px solid #e0e0e0",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "5px",
                                backgroundColor: getStreamColor(stream),
                              }}
                            />
                            <CardContent>
                              <Box textAlign="center">
                                <Box 
                                  sx={{ 
                                    width: 60, 
                                    height: 60, 
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 16px",
                                    backgroundColor: `${getStreamColor(stream)}20`,
                                  }}
                                >
                                  <Box sx={{ color: getStreamColor(stream) }}>
                                    {getStreamIcon(stream)}
                                  </Box>
                                </Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                  {stream}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {standard.label}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

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
                Not sure which standard to select? 
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

export default SelectStandard;