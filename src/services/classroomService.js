import api from "./api";

export const fetchMyClassrooms = async () => {
  const res = await api.get("/api/classrooms");
  return res.data;
};


export const createClassroom = async ({ name, description }) => {
  const res = await api.post("/api/classrooms", { name, description });
  return res.data;
};


export const fetchClassroomDetails = async (classroomId) => {
  const res = await api.get(`/api/classrooms/${classroomId}`);
  return res.data;
};


export const updateClassroom = async (classroomId, data) => {
  const res = await api.patch(`/api/classrooms/${classroomId}`, data);
  return res.data;
};


export const removeStudentFromClassroom = async (classroomId, studentId) => {
  const res = await api.delete(`/api/classrooms/${classroomId}/students/${studentId}`);
  return res.data;
};


export const deleteClassroom = async (classroomId) => {
  const res = await api.delete(`/api/classrooms/${classroomId}`);
  return res.data;
};