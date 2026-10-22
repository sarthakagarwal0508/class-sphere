import api from "./api";
import { toApiError } from "./apiError";


export async function createAssignment(classroomId, { title, description, dueDate, maxMarks }) {
  try {
    const response = await api.post(`/classrooms/${classroomId}/assignments`, {
      title,
      description,
      dueDate,
      maxMarks: Number(maxMarks) || 20,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}


export async function getClassroomAssignments(classroomId) {
  try {
    const response = await api.get(`/classrooms/${classroomId}/assignments`);
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : payload?.assignments ?? [];
  } catch (error) {
    throw toApiError(error);
  }
}