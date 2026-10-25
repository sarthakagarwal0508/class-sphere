import api from "./api";
import { toApiError } from "./apiError";


export async function createAssignment(classroomId, { title, description, dueDate, maxMarks }) {
  try {
    const response = await api.post(`/classrooms/${classroomId}/assignments`, {
      title,
      description,
      dueDate,
      maxMarks: Number(maxMarks ?? 20),
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

export async function submitAssignment(assignmentId, { answerText, submissionUrl }) {
  try {
    const response = await api.post(`/assignments/${assignmentId}/submit`, {
      answerText,
      submissionUrl,
    });
    return response.data?.data?.submission ?? response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getMyAssignmentSubmission(assignmentId) {
  try {
    const response = await api.get(`/assignments/${assignmentId}/my-submission`);
    return response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getAssignmentSubmissions(assignmentId) {
  try {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : payload?.submissions ?? [];
  } catch (error) {
    throw toApiError(error);
  }
}

export async function gradeAssignmentSubmission(
  assignmentId,
  submissionId,
  { marksObtained, feedback }
) {
  try {
    const response = await api.patch(
      `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      { marksObtained: Number(marksObtained), feedback }
    );
    return response.data?.data?.submission ?? response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}