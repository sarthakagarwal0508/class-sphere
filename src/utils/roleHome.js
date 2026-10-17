export const homeByRole = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
};

export const getHomePath = (role) => homeByRole[role] ?? "/";