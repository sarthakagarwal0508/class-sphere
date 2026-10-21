import {
  Home, BookOpen, FileText, ClipboardList, CircleHelp,
  Sparkles, Layers, Award, BarChart3, Megaphone, MessageSquare,
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
  { label: "Doubt Forum", to: "/doubts", icon: MessageSquare },
];

export const teacherLinks = []; // teammate yahan teacher ke links bharega

export const linksByRole = { student: studentLinks, teacher: teacherLinks };