import api from "./api";
import { toApiError } from "./apiError";

export const uploadMaterial = async (classroomId, { file, title, description }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (description) formData.append("description", description);

    const res = await api.post(`/classrooms/${classroomId}/materials`, formData);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw toApiError(error);
  }
};


export const fetchClassroomMaterials = async (classroomId) => {
  try {
    const res = await api.get(`/classrooms/${classroomId}/materials`);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const fetchMaterialFile = async (materialId) => {
  try {
    const response = await api.get(`/materials/${materialId}/download`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const downloadMaterial = async (materialId, filename = "class-notes.pdf") => {
  try {
    const file = await fetchMaterialFile(materialId);
    const objectUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (error) {
    throw toApiError(error);
  }
};

export const updateMaterial = async (materialId, { title, description }) => {
  try {
    const res = await api.patch(`/materials/${materialId}`, { title, description });
    return res.data?.data ?? res.data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const deleteMaterial = async (materialId) => {
  try {
    const res = await api.delete(`/materials/${materialId}`);
    return res.data?.data ?? res.data;
  } catch (error) {
    throw toApiError(error);
  }
};