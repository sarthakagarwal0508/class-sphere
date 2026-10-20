import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest, googleAuthRequest } from "../services/authService";

const AuthContext = createContext(null);
const STORAGE_KEY = "classsphere_auth";

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // auth = { user, token } ya null (logged out)
  const [auth, setAuth] = useState(readStored);

  const save = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAuth(data);
    return data.user;
  };

  const login = async (credentials) => save(await loginRequest(credentials));
  const register = async (details) => save(await registerRequest(details));
  const loginWithGoogle = async (role) => save(await googleAuthRequest(role));

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  const value = {
    user: auth?.user ?? null,
    token: auth?.token ?? null,
    isAuthenticated: Boolean(auth),
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}