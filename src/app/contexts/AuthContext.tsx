import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginRequest, registerRequest, LoginData, RegisterData } from "../lib/auth";

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  faculty?: string;
  department?: string;
  academicYear?: string;
  clubName?: string;
};

type AuthContextState = {
  user: AuthUser | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

const USER_STORAGE_KEY = "uniClubUser";
const TOKEN_STORAGE_KEY = "authToken";

const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => (typeof window !== "undefined" ? getStoredUser() : null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        setLoading(true);
        fetchMe()
          .then((data) => {
            setUser(data.user);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
          })
          .catch(() => {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [user]);

  const login = async (data: LoginData) => {
    setLoading(true);
    const response = await loginRequest(data);
    const token = response.token;
    if (!token) {
      throw new Error("Login failed");
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    setUser(response.user);
    setLoading(false);
    return response;
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    const response = await registerRequest(data);
    const token = response.token;
    if (!token) {
      throw new Error("Registration failed");
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
    setUser(response.user);
    setLoading(false);
    return response;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
