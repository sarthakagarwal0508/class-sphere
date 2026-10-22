import api from "./api";
import { toApiError } from "./apiError";


export async function createAnnouncement(classroomId, { title, content }) {
  try {
    const response = await api.post(`/classrooms/${classroomId}/announcements`, {
      title,
      content,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}


export async function getClassroomAnnouncements(classroomId) {
  try {
    const response = await api.get(`/classrooms/${classroomId}/announcements`);
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : payload?.announcements ?? [];
  } catch (error) {
    throw toApiError(error);
  }
}

export async function updateAnnouncement(announcementId, { title, content }) {
  try {
    const response = await api.patch(`/announcements/${announcementId}`, {
      title,
      content,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}


export async function deleteAnnouncement(announcementId) {
  try {
    const response = await api.delete(`/announcements/${announcementId}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}


export async function getMyNotifications() {
  try {
    const response = await api.get("/notifications");
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : payload?.notifications ?? [];
  } catch (error) {
    throw toApiError(error);
  }
}


export async function markNotificationAsRead(notificationId) {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data?.data ?? response.data;
  } catch (error) {
    throw toApiError(error);
  }
}