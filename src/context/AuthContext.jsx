
import { createContext, useContext, useState } from "react";
import {
  loginRequest,
  registerRequest,
  googleAuthRequest,
  logoutRequest,
} from "../services/authService";

const AuthContext = createContext(null);
const STORAGE_KEY = "classsphere_auth";

function readStored() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored?.user || !stored?.accessToken) return null;
    return stored;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored);

  const save = (data) => {
    const session = {
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenType: data.tokenType || "Bearer",
      expiresIn: data.expiresIn,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAuth(session);
    return session.user;
  };

  const login = async (credentials) => {
    const session = await loginRequest(credentials);
    return save(session);
  };

  // Registration only starts the OTP flow.
  // It must not create a logged-in session.
  const register = async (details) => {
    return registerRequest(details);
  };

  // Google integration will be connected once the SDK
  // supplies a real Google ID token.
  const loginWithGoogle = async (idToken) => {
    const session = await googleAuthRequest(idToken);
    return save(session);
  };

  const logout = async () => {
    const refreshToken = auth?.refreshToken;

    // Clear local session even if the server logout fails.
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);

    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch (error) {
        console.error("Server logout failed:", error.message);
      }
    }
  };

  const value = {
    user: auth?.user ?? null,
    token: auth?.accessToken ?? null,
    accessToken: auth?.accessToken ?? null,
    refreshToken: auth?.refreshToken ?? null,
    isAuthenticated: Boolean(auth?.accessToken && auth?.user),
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
