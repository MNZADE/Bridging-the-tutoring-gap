import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Container,
  Chip,
  Button,
  Box,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { Visibility as ViewIcon, Search as SearchIcon } from '@mui/icons-material';

const QuizResultsViewer = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/quiz-results');
        const data = await response.json();
        setResults(data);
        setFilteredResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    // Filter results based on search term
    if (searchTerm === '') {
      setFilteredResults(results);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = results.filter(result => 
        (result.studentId?.name && result.studentId.name.toLowerCase().includes(term)) ||
        (result.quizId?.title && result.quizId.title.toLowerCase().includes(term)) ||
        (result.subject && result.subject.toLowerCase().includes(term))
      );
      setFilteredResults(filtered);
    }
  }, [searchTerm, results]);

  const viewResultDetails = (resultId) => {
    navigate(`/admin/quiz-result-details/${resultId}`);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        All Quiz Results
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by student, quiz, or subject..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Quiz</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Correct Answers</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow key={result._id}>
                <TableCell>{result.studentId?.name || 'Unknown'}</TableCell>
                <TableCell>{result.quizId?.title || 'Unknown'}</TableCell>
                <TableCell>{result.subject}</TableCell>
                <TableCell>{result.quizId?.level || 'Unknown'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {result.score}%
                    </Typography>
                    <Chip 
                      label={result.score >= 70 ? "Pass" : "Fail"} 
                      color={result.score >= 70 ? "success" : "error"} 
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>{result.correctAnswers}/{result.totalQuestions}</TableCell>
                <TableCell>{new Date(result.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => viewResultDetails(result._id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default QuizResultsViewer;