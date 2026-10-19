
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

async function request(path, { method = "POST", body, token } = {}) {
  if (!BASE_URL) {
    throw new Error("API URL missing. Please configure VITE_API_BASE_URL in .env.");
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(" Please try again.");
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(`INVALID RESPONSE (${response.status}).`);
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status}).`);
  }

  return result;
}

function getPayload(result) {
  return result?.data ?? result;
}

export async function loginRequest({ email, password }) {
  const result = await request("/api/auth/login", {
    body: { email: email.trim(), password },
  });

  const data = getPayload(result);

  if (!data.accessToken || !data.refreshToken || !data.user) {
    throw new Error("Login response is missing ");
  }

  return {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
  };
}

export async function registerRequest({ name, email, password, role }) {
  return request("/api/auth/register", {
    body: {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    },
  });
}

export async function verifyOtpRequest({ email, otp }) {
  return request("/api/auth/verify-otp", {
    body: { email: email.trim(), otp },
  });
}

export async function resendOtpRequest({ email }) {
  return request("/api/auth/resend-otp", {
    body: { email: email.trim() },
  });
}

export async function googleAuthRequest(idToken) {
  const result = await request("/api/auth/google", {
    body: { idToken },
  });

  const data = getPayload(result);

  if (!data.accessToken || !data.refreshToken || !data.user) {
    throw new Error("Google login response is missing user or authentication tokens.");
  }

  return {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
  };
}

export async function getCurrentUser(accessToken) {
  return getPayload(
    await request("/api/auth/me", {
      method: "GET",
      token: accessToken,
    })
  );
}

export async function logoutRequest(refreshToken) {
  return request("/api/auth/logout", {
    body: { refreshToken },
  });
}

export async function refreshRequest(refreshToken) {
  const result = await request("/api/auth/refresh", {
    body: { refreshToken },
  });

  const data = getPayload(result);

  if (!data.accessToken || !data.refreshToken) {
    throw new Error("Refresh response is missing authentication tokens.");
  }

  return data;
}
