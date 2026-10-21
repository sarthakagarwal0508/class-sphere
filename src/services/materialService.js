import api from "./api";

export const uploadMaterial = async (classroomId, { file, title, description }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  if (description) formData.append("description", description);

  
  const res = await api.post(`/api/classrooms/${classroomId}/materials`, formData);
  return res.data;
};


export const fetchClassroomMaterials = async (classroomId) => {
  const res = await api.get(`/api/classrooms/${classroomId}/materials`);
  return res.data;
};


export const getDownloadMaterialUrl = (materialId) => {
  const root = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${root.replace(/\/+$/, "")}/api/materials/${materialId}/download`;
};


export const updateMaterial = async (materialId, { title, description }) => {
  const res = await api.patch(`/api/materials/${materialId}`, { title, description });
  return res.data;
};

export const deleteMaterial = async (materialId) => {
  const res = await api.delete(`/api/materials/${materialId}`);
  return res.data;
};