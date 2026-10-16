export const student = {
  firstName: "Mansi",
  name: "Mansi Singh",
  email: "mansi@college.edu",
  role: "student",
};

export const stats = { courses: 3, pendingWork: 2, averageScore: 82, dayStreak: 5 };

export const continueLearning = {
  title: "Linked Lists in C",
  course: "Data Structures",
  lesson: 6,
  totalLessons: 8,
};

export const courses = [
  { id: 1, name: "Data Structures", teacher: "Prof. Sharma", tag: "Semester 3", assignments: 4, quizzes: 3, progress: 75, color: "yellow", status: "active" },
  { id: 2, name: "Database Systems", teacher: "Prof. Verma", tag: "Semester 3", assignments: 2, quizzes: 5, progress: 30, color: "blue", status: "active" },
  { id: 3, name: "Web Development", teacher: "Prof. Gupta", tag: "Certified", assignments: 6, quizzes: 2, progress: 100, color: "green", status: "completed" },
];

export const assignments = [
  { id: 1, title: "Linked List Implementation", course: "Data Structures", due: "20 Oct", marks: 20, status: "pending" },
  { id: 2, title: "Stack and Queue Problems", course: "Data Structures", due: "25 Oct", marks: 10, status: "pending" },
  { id: 3, title: "ER Diagram Design", course: "Database Systems", due: "18 Oct", marks: 15, submittedOn: "17 Oct", status: "submitted" },
  { id: 4, title: "Portfolio Website", course: "Web Development", score: 22, marks: 25, feedback: "clean layout, improve mobile view", status: "graded" },
];

export const upNextQuiz = {
  due: "18 Oct",
  priority: "high priority",
  title: "Normalization Basics Quiz",
  description: "20 minute MCQ quiz on database design.",
};

export const flashcardsDue = { count: 5 };

export const schedule = [
  { id: 1, date: "17 Oct", time: "12:00", title: "Data Structures", detail: "Lecture, Prof. Sharma" },
  { id: 2, date: "18 Oct", time: "14:30", title: "DBMS Quiz", detail: "Normalization, 20 min" },
];

export const announcements = [
  { id: 1, title: "Lab moved to Friday", by: "Prof. Sharma, Data Structures" },
];

export const reminders = [
  { id: 1, title: "Linked List assignment", date: "20 Oct 2026, Tuesday" },
];