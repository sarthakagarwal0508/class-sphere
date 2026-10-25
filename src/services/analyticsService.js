import api from "./api";
import { toApiError } from "./apiError";

const unwrap = (response) => response?.data?.data ?? response?.data;

async function get(path) {
  try {
    return unwrap(await api.get(path));
  } catch (error) {
    throw toApiError(error);
  }
}

export const getStudentOverview = () =>
  get("/analytics/student/overview");

export const getStudentClassroomAnalytics = (classroomId) =>
  get(`/analytics/student/classrooms/${classroomId}`);

export const getTeacherClassroomAnalytics = (classroomId) =>
  get(`/analytics/teacher/classrooms/${classroomId}`);

export const getTeacherClassroomStudents = (classroomId) =>
  get(`/analytics/teacher/classrooms/${classroomId}/students`);

export const getTeacherRiskPredictions = (classroomId) =>
  get(`/analytics/teacher/classrooms/${classroomId}/risk-predictions`);

export async function updateTeacherStudentRiskProfile(classroomId, studentId, profile) {
  try {
    const response = await api.put(
      `/analytics/teacher/classrooms/${classroomId}/students/${studentId}/risk-profile`,
      profile
    );
    return unwrap(response);
  } catch (error) {
    throw toApiError(error);
  }
}
