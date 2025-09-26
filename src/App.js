import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Student pages
import Dashboard from "./pages/Student/Dashboard";
import Materials from "./pages/Student/Materials";
import Attendance from "./pages/Student/Attendance";
import Educators from "./pages/Student/Educators";
import SelectQuiz from "./pages/Student/SelectQuiz";
import SelectStandard from "./pages/Student/SelectStandard";
import QuizSubjects from "./pages/Student/QuizSubjects";
import QuizLevels from "./pages/Student/QuizLevels";
import QuizPlay from "./pages/Student/QuizPlay";
import QuizResults from "./pages/Student/QuizResults";
import QuizResultDetails from "./pages/Student/QuizResultDetails";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageAttendance from "./pages/Admin/ManageAttendance";
import ManageMaterials from "./pages/Admin/ManageMaterials";
import ManageStudents from "./pages/Admin/ManageStudents";
import ManageQuizzes from "./pages/Admin/ManageQuizzes";

// Components
import PrivateRoute from "./components/PrivateRoute";
import QuizResultsViewer from './components/QuizResultsViewer';
import QuizResultDetailsAdmin from './components/QuizResultDetails';

// NotFound Component
const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go to Home</a>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="student">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/materials"
          element={
            <PrivateRoute role="student">
              <Materials />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute role="student">
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/educators"
          element={
            <PrivateRoute role="student">
              <Educators />
            </PrivateRoute>
          }
        />
        <Route
          path="/select-quiz"
          element={
            <PrivateRoute role="student">
              <SelectQuiz />
            </PrivateRoute>
          }
        />
        <Route
          path="/select-standard"
          element={
            <PrivateRoute role="student">
              <SelectStandard />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz-subjects"
          element={
            <PrivateRoute role="student">
              <QuizSubjects />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz-levels"
          element={
            <PrivateRoute role="student">
              <QuizLevels />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz-play"
          element={
            <PrivateRoute role="student">
              <QuizPlay />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/quiz-results"
          element={
            <PrivateRoute role="student">
              <QuizResults />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/quiz-result"
          element={
            <PrivateRoute role="student">
              <QuizResultDetails />
            </PrivateRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <PrivateRoute role="admin">
              <ManageAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/materials"
          element={
            <PrivateRoute role="admin">
              <ManageMaterials />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <PrivateRoute role="admin">
              <ManageStudents />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <PrivateRoute role="admin">
              <ManageQuizzes />
            </PrivateRoute>
          }
        />
        
        {/* Quiz Results Viewer Routes - Admin Only */}
        <Route
          path="/admin/quiz-results"
          element={
            <PrivateRoute role="admin">
              <QuizResultsViewer />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quiz-result-details/:resultId"
          element={
            <PrivateRoute role="admin">
              <QuizResultDetailsAdmin />
            </PrivateRoute>
          }
        />
        
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;