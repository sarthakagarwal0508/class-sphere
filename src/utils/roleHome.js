export const homeByRole = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
};

export const getHomePath = (role) => {
  const normalized = String(role || "").trim().toLowerCase();
  if (normalized === "teacher") {
    return "/teacher/dashboard";
  }
  return "/student/dashboard";
};