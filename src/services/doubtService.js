
const STORAGE_KEY = "classsphere_doubts_v1";

const initialDoubts = [
  {
    id: "1",
    title: "Confusion in React Hooks",
    description: "Can someone explain how useEffect works?",
    subject: "Web Development",
    author: "Aarav",
    status: "open",
    createdAt: new Date().toISOString(),
    replies: [],
  },
  {
    id: "2",
    title: "Binary Search Tree",
    description: "How do we calculate the height of a BST?",
    subject: "Data Structures",
    author: "Priya",
    status: "resolved",
    createdAt: new Date().toISOString(),
    replies: [
      {
        id: "r1",
        author: "Teacher",
        message: "The height is the number of edges on the longest path from the root to a leaf.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

function readDoubts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDoubts));
  } catch (error) {
    console.error("Unable to load doubts:", error);
  }

  return initialDoubts;
}

function saveDoubts(doubts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doubts));
  window.dispatchEvent(new Event("doubts-updated"));
}

export function getDoubts() {
  return readDoubts();
}

export function subscribeToDoubts(callback) {
  const update = () => callback(getDoubts());

  window.addEventListener("doubts-updated", update);
  window.addEventListener("storage", update);

  return () => {
    window.removeEventListener("doubts-updated", update);
    window.removeEventListener("storage", update);
  };
}

export function createDoubt({ title, description, subject, author }) {
  const doubts = getDoubts();

  const newDoubt = {
    id: crypto.randomUUID(),
    title,
    description,
    subject,
    author,
    status: "open",
    createdAt: new Date().toISOString(),
    replies: [],
  };

  saveDoubts([newDoubt, ...doubts]);
  return newDoubt;
}

export function addDoubtReply(doubtId, author, message) {
  const doubts = getDoubts();

  const updated = doubts.map((doubt) =>
    doubt.id === doubtId
      ? {
          ...doubt,
          replies: [
            ...(doubt.replies || []),
            {
              id: crypto.randomUUID(),
              author,
              message,
              createdAt: new Date().toISOString(),
            },
          ],
        }
      : doubt
  );

  saveDoubts(updated);
}

export function setDoubtStatus(doubtId, status) {
  const updated = getDoubts().map((doubt) =>
    doubt.id === doubtId ? { ...doubt, status } : doubt
  );

  saveDoubts(updated);
}

export function formatDoubtTime(date) {
  return new Date(date).toLocaleString();
}
