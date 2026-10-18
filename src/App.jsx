import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 1. Landing & Auth
import LandingPage from "./LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// 2. Student Portal
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudyMaterial from "./pages/student/StudyMaterial";

// 3. Teacher Portal Layout & Pages
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
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Portal */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="materials" element={<StudyMaterial />} />
        </Route>

        {/* Teacher Portal */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="create-classroom" element={<CreateClassroom />} />
          <Route path="create-class" element={<CreateClassroom />} />
          <Route path="members" element={<ManageMembers />} />
          <Route path="upload-material" element={<UploadMaterial />} />
          <Route path="create-assignment" element={<CreateAssignment />} />
          <Route path="submissions" element={<StudentSubmissions />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="quiz-results" element={<QuizResults />} />
          <Route path="analytics" element={<ClassAnalytics />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="doubt-forum" element={<DoubtForum />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}