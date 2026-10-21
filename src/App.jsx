import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public & Auth Pages
import LandingPage from "./LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

// Student Portal
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudyMaterial from "./pages/student/StudyMaterial";
import Assignments from "./pages/student/Assignments";
import Quizzes from "./pages/student/Quizzes";
import AttemptQuiz from "./pages/student/AttemptQuiz";
import NotesAI from "./pages/student/NotesAI";
import Flashcards from "./pages/student/Flashcards";
import Grades from "./pages/student/Grades";

// Teacher Portal
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateClassroom from "./pages/teacher/CreateClassroom";
import ManageMembers from "./pages/teacher/ManageMembers";
import UploadMaterial from "./pages/teacher/UploadMaterial";
import CreateAssignment from "./pages/teacher/CreateAssignment";
import StudentSubmissions from "./pages/teacher/StudentSubmissions";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import QuizResults from "./pages/teacher/QuizResults";
import ClassAnalytics from "./pages/teacher/ClassAnalytics";
import Announcements from "./pages/teacher/Announcements";
import DoubtForum from "./pages/teacher/DoubtForum";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* 🎓 Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="materials" element={<StudyMaterial />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/:quizId" element={<AttemptQuiz />} />
          <Route path="notes-ai" element={<NotesAI />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="grades" element={<Grades />} />
        </Route>

        {/* 🍎 Teacher Routes */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="create-class" element={<CreateClassroom />} />
          <Route path="members" element={<ManageMembers />} />
          <Route path="upload-material" element={<UploadMaterial />} />
          <Route path="create-assignment" element={<CreateAssignment />} />
          <Route path="submissions" element={<StudentSubmissions />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="quiz-results" element={<QuizResults />} />
          <Route path="analytics" element={<ClassAnalytics />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="doubts" element={<DoubtForum />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}