import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = "fv_token";
const STORAGE_USER_KEY = "fv_user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) || "");
  const [user, setUser] = useState(() => readStoredUser());
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function validate() {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("unauthorized");
        }

        const data = await res.json();
        if (!cancelled) {
          setUser(data.user);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
        }
      } catch {
        if (!cancelled) {
          setToken("");
          setUser(null);
          localStorage.removeItem(STORAGE_TOKEN_KEY);
          localStorage.removeItem(STORAGE_USER_KEY);
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    }

    validate();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      isAuthenticated: Boolean(token),
      login: (nextToken, nextUser) => {
        setToken(nextToken);
        setUser(nextUser);
        localStorage.setItem(STORAGE_TOKEN_KEY, nextToken);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
      },
      updateUser: (nextUser) => {
        setUser(nextUser);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
      },
      logout: () => {
        setToken("");
        setUser(null);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    }),
    [token, user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
