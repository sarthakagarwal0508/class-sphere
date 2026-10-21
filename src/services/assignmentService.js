import api from "./api";
import { toApiError } from "./apiError";
import { assignmentsData } from "../data/assignmentsData";
import { formatDayMonth } from "../utils/date";


const store = assignmentsData ? assignmentsData.map((a) => ({ ...a })) : [];


export async function createAssignment(classroomId, { title, description, dueDate, maxMarks }) {
  try {
    const response = await api.post(`/api/classrooms/${classroomId}/assignments`, {
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
    const response = await api.get(`/api/classrooms/${classroomId}/assignments`);
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : payload.assignments ?? [];
  } catch (error) {
    throw toApiError(error);
  }
}


export async function getAssignments(classroomId) {
  if (classroomId) {
    return getClassroomAssignments(classroomId);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(store.map((a) => ({ ...a })));
    }, 400);
  });
}

export async function submitAssignment({ assignmentId, answerText, file }) {
  try {
    
    if (file) {
      const form = new FormData();
      if (answerText) form.append("answerText", answerText);
      form.append("file", file);
      const res = await api.post(`/api/assignments/${assignmentId}/submit`, form);
      return res.data?.data ?? res.data;
    }
  } catch {
   
  }

  const index = store.findIndex((a) => a.id === assignmentId);
  if (index !== -1) {
    store[index] = { ...store[index], status: "submitted", submittedOn: formatDayMonth() };
    return { ...store[index] };
  }
  return { id: assignmentId, status: "submitted" };
}