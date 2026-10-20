// MOCK auth service. Backend ready hone par sirf is file ke andar ka code badlega
// (api.post("/auth/login", ...) jaisa), baaki app (context, pages) same rahega.

const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

function nameFromEmail(email) {
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function loginRequest({ email, role }) {
  await delay();
  
  // Real: const { data } = await api.post("/auth/login", { email, password, role });
  return {
    token: "mock-token",
    user: { id: Date.now(), name: nameFromEmail(email), email, role },
  };
}

export async function registerRequest({ name, email, role }) {
  await delay();
  // Real: const { data } = await api.post("/auth/register", { name, email, password, role });
  return {
    token: "mock-token",
    user: { id: Date.now(), name, email, role },
  };
}

export async function googleAuthRequest(role) {
  await delay();
  // Real: Google se ID token lo, backend ko bhejo, backend apna token wapas deta hai.
  return {
    token: "mock-token",
    user: { id: Date.now(), name: "Google User", email: "google.user@gmail.com", role },
  };
}