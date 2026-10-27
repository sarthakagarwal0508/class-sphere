import api from "./api";
import { toApiError } from "./apiError";


export async function createAssignment(
  classroomId,
  { title, description, dueDate, maxMarks, questionPdf }
) {
  try {
    const payload = {
      title,
      description,
      dueDate,
      maxMarks: Number(maxMarks ?? 20),
    };
    const requestBody = questionPdf
      ? (() => {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => formData.append(key, String(value)));
        formData.append("file", questionPdf);
        return formData;
      })()
      : payload;
    const response = await api.post(
      `/classrooms/${classroomId}/assignments`,
      requestBody
    );
    return response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function fetchAssignmentPdf(assignmentId, submissionId) {
  const path = submissionId
    ? `/assignments/${assignmentId}/submissions/${submissionId}/file`
    : `/assignments/${assignmentId}/attachment`;
  try {
    const response = await api.get(path, { responseType: "blob" });
    return response.data;
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

export async function submitAssignment(
  assignmentId,
  { answerText, submissionUrl, solutionPdf }
) {
  try {
    const payload = { answerText, submissionUrl };
    let requestBody = payload;
    if (solutionPdf) {
      requestBody = new FormData();
      requestBody.append("answerText", answerText);
      requestBody.append("submissionUrl", submissionUrl);
      requestBody.append("file", solutionPdf);
    }
    const response = await api.post(
      `/assignments/${assignmentId}/submit`,
      requestBody
    );
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