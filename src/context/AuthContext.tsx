// auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, saveToken, deleteToken } from "../utils/tokenStorage";
import { setInMemoryToken } from "../api/authClient";
import { login as loginApi } from "../api/authApi";

type AuthContextType = {
  token: string | null;
  isBootstrapping: boolean;
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setBootstrapping] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      const stored = await getToken();
      if (!mounted) {
        return;
      }
      setToken(stored);
      setInMemoryToken(stored);
      setBootstrapping(false);
    };

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi({
      grant_type: "password",
      username: email,
      password,
    });
    await saveToken(res.access_token);
    setToken(res.access_token);
    setInMemoryToken(res.access_token);
    setUser(email);
  };

  const logout = async () => {
    await deleteToken();
    setToken(null);
    setInMemoryToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, isBootstrapping, user, login, logout }), [token, isBootstrapping, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
