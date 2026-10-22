import { createContext, useContext, useEffect, useState } from "react";
import {
  loginRequest,
  googleAuthRequest,
  fetchMe,
  logoutRequest,
} from "../services/authService";
import { tokenStorage, AUTH_EXPIRED_EVENT } from "../services/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize user from localStorage so there's no flicker on reload
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [initializing, setInitializing] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    if (!tokenStorage.get()) {
      setInitializing(false);
      return undefined;
    }

    let ignore = false;
    fetchMe()
      .then((me) => {
        if (!ignore && me) {
          // Preserve the selected role from localStorage so backend doesn't overwrite teacher with student
          const persistedRole = localStorage.getItem("role") || me.role || "student";
          const updatedUser = { ...me, role: persistedRole };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      })
      .catch(() => {
        tokenStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setUser(null);
      })
      .finally(() => {
        if (!ignore) setInitializing(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => {
      tokenStorage.clear();
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setUser(null);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  // 🌟 Key Fix: Accepts requestedRole and persists it
  const startSession = (authData, requestedRole) => {
    const nextUser = authData?.user || authData;
    const tokens = authData?.tokens;

    if (tokens) {
      tokenStorage.set(tokens);
    }

    // Prioritize explicitly requested role (e.g. 'teacher' or 'student')
    const effectiveRole = requestedRole || nextUser?.role || localStorage.getItem("role") || "student";
    const userWithRole = { ...nextUser, role: effectiveRole };

    localStorage.setItem("role", effectiveRole);
    localStorage.setItem("user", JSON.stringify(userWithRole));

    setUser(userWithRole);
    return userWithRole;
  };

  const login = async (credentials, role) => {
    const res = await loginRequest(credentials);
    return startSession(res, role);
  };

  const loginWithGoogle = async (idToken, role) => {
    const res = await googleAuthRequest(idToken, role);
    return startSession(res, role);
  };

  const logout = async () => {
    const tokens = tokenStorage.get();
    try {
      if (tokens?.refreshToken) await logoutRequest(tokens.refreshToken);
    } catch {
      // ignore
    }
    tokenStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    initializing,
    isAuthenticated: Boolean(user),
    login,
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