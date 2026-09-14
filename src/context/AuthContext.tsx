// auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, saveToken, deleteToken, saveRefreshToken, deleteRefreshToken } from "../utils/tokenStorage";
import { setInMemoryToken, setSessionExpiredHandler } from "../api/authClient";
import { login as loginApi, getMe } from "../api/authApi";
import { User } from "../types/User";

type AuthContextType = {
  token: string | null;
  isBootstrapping: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setBootstrapping] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    // If a request 401s and a silent token refresh (see authClient.tsx) also
    // fails, this fires — the session is genuinely over, so drop back to a
    // clean logged-out state instead of leaving every screen stuck showing
    // its own "Something went wrong" with no way out.
    setSessionExpiredHandler(() => {
      if (!mounted) {
        return;
      }
      setToken(null);
      setUser(null);
    });

    const bootstrapAuth = async () => {
      const stored = await getToken();
      let me: User | null = null;

      if (stored) {
        setInMemoryToken(stored);
        try {
          // If this access token has expired, the interceptor in authClient.tsx
          // transparently refreshes it (using the stored refresh token) and
          // retries — so this only throws when there's truly no valid session.
          me = await getMe();
        } catch {
          await deleteToken();
          await deleteRefreshToken();
          setInMemoryToken(null);
        }
      }

      if (!mounted) {
        return;
      }
      if (stored && me) {
        setToken(stored);
        setUser(me);
      }
      setBootstrapping(false);
    };

    bootstrapAuth();

    return () => {
      mounted = false;
      setSessionExpiredHandler(null);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi({
      grant_type: "password",
      username: email,
      password,
    });
    await saveToken(res.access_token);
    await saveRefreshToken(res.refresh_token);
    setToken(res.access_token);
    setInMemoryToken(res.access_token);
    setUser(res.user);
  };

  const logout = async () => {
    await deleteToken();
    await deleteRefreshToken();
    setToken(null);
    setInMemoryToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const me = await getMe();
    setUser(me);
  };

  const value = useMemo(
    () => ({ token, isBootstrapping, user, login, logout, refreshUser }),
    [token, isBootstrapping, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
