import api from "./api";
import { toApiError } from "./apiError";

export async function getAnnouncements() {
  try {
    const response = await api.get("/announcements");
    const payload = response.data?.data ?? response.data;

    return Array.isArray(payload)
      ? payload
      : payload.announcements ?? [];
  } catch (error) {
    throw toApiError(error);
  }
}