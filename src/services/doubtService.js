import api from "./api";
import { toApiError } from "./apiError";

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

export function listFrom(response) {
  const data = unwrap(response);
  return Array.isArray(data) ? data : data?.doubts ?? [];
}

export async function fetchClassroomDoubts(
  classroomId,
  { status, page, limit } = {}
) {
  try {
    const response = await api.get(
      `/discussions/classrooms/${classroomId}/doubts`,
      { params: { status, page, limit } }
    );
    return listFrom(response);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function createDoubt(classroomId, { title, description }) {
  try {
    return unwrap(
      await api.post(`/discussions/classrooms/${classroomId}/doubts`, {
        title,
        description,
      })
    );
  } catch (error) {
    throw toApiError(error);
  }
}

export async function addDoubtReply(doubtId, message) {
  try {
    return unwrap(
      await api.post(`/discussions/doubts/${doubtId}/replies`, { message })
    );
  } catch (error) {
    throw toApiError(error);
  }
}

export async function setDoubtStatus(doubtId, status) {
  try {
    return unwrap(
      await api.patch(`/discussions/doubts/${doubtId}/status`, { status })
    );
  } catch (error) {
    throw toApiError(error);
  }
}

export function normalizeDoubt(doubt, classroomName) {
  const student = doubt.student;
  const author =
    typeof student === "string"
      ? doubt.studentName ?? "Student"
      : student?.name ?? student?.fullName ?? "Student";
  const classroom =
    typeof doubt.classroom === "object" ? doubt.classroom : null;
  const replies = Array.isArray(doubt.replies) ? doubt.replies : [];

  return {
    ...doubt,
    id: String(doubt._id ?? doubt.id),
    title: doubt.title ?? "",
    description: doubt.description ?? doubt.body ?? "",
    subject:
      classroom?.name ??
      classroom?.title ??
      classroomName ??
      doubt.subject ??
      "Classroom",
    author,
    status: doubt.status === "resolved" ? "resolved" : "open",
    createdAt: doubt.createdAt ?? doubt.created_at,
    replies: replies.map((reply, index) => {
      const replyAuthor = reply.author;
      return {
        ...reply,
        id: String(reply._id ?? reply.id ?? `${doubt._id ?? doubt.id}-reply-${index}`),
        author:
          typeof replyAuthor === "string"
            ? reply.authorName ?? "User"
            : replyAuthor?.name ?? replyAuthor?.fullName ?? "User",
        message: reply.message ?? reply.text ?? "",
        createdAt: reply.createdAt ?? reply.created_at,
      };
    }),
  };
}

export function formatDoubtTime(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toLocaleString();
}
