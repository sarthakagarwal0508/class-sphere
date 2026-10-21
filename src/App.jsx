
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudyMaterial from "./pages/student/StudyMaterial";
import Assignments from "./pages/student/Assignments";
import Quizzes from "./pages/student/Quizzes";
import AttemptQuiz from "./pages/student/AttemptQuiz";
import NotesAI from "./pages/student/NotesAI";
import Flashcards from "./pages/student/Flashcards";
import Grades from "./pages/student/Grades";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route
            path="dashboard"
            element={<StudentDashboard />}
          />
          <Route
            path="materials"
            element={<StudyMaterial />}
          />
          <Route
            path="assignments"
            element={<Assignments />}
          />
          <Route
            path="quizzes"
            element={<Quizzes />}
          />
          <Route
            path="quizzes/:quizId"
            element={<AttemptQuiz />}
          />
          <Route
            path="notes-ai"
            element={<NotesAI />}
          />
          <Route
            path="flashcards"
            element={<Flashcards />}
          />

        <Route
         path="grades" 
         element={<Grades />} 
         />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
