// MOCK service. Backend ready hone par sirf is file ke andar ka code badlega,
// Assignments page waisa hi rahega.
import { assignmentsData } from "../data/assignmentsData";
import { formatDayMonth } from "../utils/date";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock "database": page se bahar jaake wapas aao to bhi submit kiya hua yaad rahe
const store = assignmentsData.map((a) => ({ ...a }));

export async function getAssignments() {
  await delay(600);
  // Real: const { data } = await api.get("/assignments"); return data;
  return store.map((a) => ({ ...a }));
}

export async function submitAssignment({ assignmentId }) {
  await delay(900);
  // Real: file ke saath FormData bhejna padega:
  //   const form = new FormData();
  //   form.append("answer", answer);
  //   if (file) form.append("file", file);
  //   const { data } = await api.post(`/assignments/${assignmentId}/submit`, form);
  //   return data;
  const index = store.findIndex((a) => a.id === assignmentId);
  if (index === -1) throw new Error("Assignment not found.");

  store[index] = { ...store[index], status: "submitted", submittedOn: formatDayMonth() };
  return { ...store[index] };
}