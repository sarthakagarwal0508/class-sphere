import {
  Home, BookOpen, FileText, ClipboardList, CircleHelp,
  Sparkles, Layers, Award, BarChart3, Megaphone, MessageSquare,
  LayoutDashboard, Plus, Users, Upload, FileCheck2, Bell,
} from "lucide-react";

export const studentLinks = [
  { label: "Dashboard", to: "/student/dashboard", icon: Home },
  { label: "My Classes", to: "/student/classes", icon: BookOpen },
  { label: "Study Material", to: "/student/materials", icon: FileText },
  { label: "Assignments", to: "/student/assignments", icon: ClipboardList },
  { label: "Quizzes", to: "/student/quizzes", icon: CircleHelp },
  { label: "Notes AI", to: "/student/notes-ai", icon: Sparkles },
  { label: "Flashcards", to: "/student/flashcards", icon: Layers },
  { label: "My Grades", to: "/student/grades", icon: Award },
  { label: "Progress", to: "/student/progress", icon: BarChart3 },
  { label: "Announcements", to: "/student/announcements", icon: Megaphone },
  { label: "Doubt Forum", to: "/student/doubts", icon: MessageSquare },
];

export const teacherLinks = [
  { label: "Dashboard", to: "/teacher/dashboard", icon: LayoutDashboard },
  { label: "Create Classroom", to: "/teacher/create-classroom", icon: Plus },
  { label: "Members", to: "/teacher/members", icon: Users },
  { label: "Upload Material", to: "/teacher/upload-material", icon: Upload },
  { label: "Create Assignment", to: "/teacher/create-assignment", icon: FileText },
  { label: "Submissions", to: "/teacher/submissions", icon: FileCheck2 },
  { label: "Create Quiz", to: "/teacher/create-quiz", icon: CircleHelp },
  { label: "Quiz Results", to: "/teacher/quiz-results", icon: Award },
  { label: "Analytics", to: "/teacher/analytics", icon: BarChart3 },
  { label: "Announcements", to: "/teacher/announcements", icon: Bell },
  { label: "Doubt Forum", to: "/teacher/doubt-forum", icon: MessageSquare },
];

export const linksByRole = { student: studentLinks, teacher: teacherLinks };