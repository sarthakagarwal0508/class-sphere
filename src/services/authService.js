import api from "./api";
import { toApiError } from "./apiError";

const AUTH_REQUEST_TIMEOUT = 120_000;

// Backend ka data kabhi { data: {...} } ke andar hota hai, kabhi seedha. Dono chalega.
const unwrap = (response) => response.data?.data ?? response.data;

async function call(request) {
  try {
    return await request();
  } catch (error) {
    throw toApiError(error);
  }
}

// Backend ke user ko app ke format mein badalna. Field ke naam alag hon to sirf yahan badlo.
function normalizeUser(raw = {}) {
  return {
    id: raw.id ?? raw._id,
    name: raw.name ?? raw.fullName ?? "",
    email: raw.email ?? "",
    role: String(raw.role ?? "student").toLowerCase(),
  };
}

function normalizeSession(payload) {
  return {
    user: normalizeUser(payload.user ?? payload),
    tokens: {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    },
  };
}

export async function registerRequest({ name, email, password, role }) {
  const response = await call(() =>
    api.post("/auth/register", { name, email, password, role }, { timeout: AUTH_REQUEST_TIMEOUT })
  );
  return { message: response.data?.message };
}

export async function verifyOtpRequest({ email, otp }) {
  const response = await call(() =>
    api.post("/auth/verify-otp", { email, otp }, { timeout: AUTH_REQUEST_TIMEOUT })
  );
  return { message: response.data?.message };
}

export async function resendOtpRequest({ email }) {
  const response = await call(() =>
    api.post("/auth/resend-otp", { email }, { timeout: AUTH_REQUEST_TIMEOUT })
  );
  return { message: response.data?.message };
}

export async function loginRequest({ email, password }) {
  const response = await call(() => api.post("/auth/login", { email, password }));
  return normalizeSession(unwrap(response));
}

export async function googleAuthRequest(idToken, role) {
  const response = await call(() => api.post("/auth/google", { idToken, role }));
  return normalizeSession(unwrap(response));
}

export async function fetchMe() {
  const response = await call(() => api.get("/auth/me"));
  const payload = unwrap(response);
  return normalizeUser(payload.user ?? payload);
}

export async function logoutRequest(refreshToken) {
  await call(() => api.post("/auth/logout", { refreshToken }));
}