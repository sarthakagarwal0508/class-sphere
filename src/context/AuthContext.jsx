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
  const [user, setUser] = useState(null);
  
  const [initializing, setInitializing] = useState(() => Boolean(tokenStorage.get()));


  useEffect(() => {
    if (!tokenStorage.get()) return undefined;

    let ignore = false;
    fetchMe()
      .then((me) => {
        if (!ignore) setUser(me);
      })
      .catch(() => {
        tokenStorage.clear();
      })
      .finally(() => {
        if (!ignore) setInitializing(false);
      });

    return () => {
      ignore = true;
    };
  }, []);


  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const startSession = ({ user: nextUser, tokens }) => {
    tokenStorage.set(tokens);
    setUser(nextUser);
    return nextUser;
  };

  const login = async (credentials) => startSession(await loginRequest(credentials));
  const loginWithGoogle = async (idToken, role) =>
    startSession(await googleAuthRequest(idToken, role));

  const logout = async () => {
    const tokens = tokenStorage.get();
    try {
      if (tokens?.refreshToken) await logoutRequest(tokens.refreshToken);
    } catch {
    
    }
    tokenStorage.clear();
    setUser(null);
  };

  const value = {
    user,
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