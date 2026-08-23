import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "./api";

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: "resident" | "admin";
  flat_number?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<UserInfo>;
  register: (data: { username: string; password: string; email: string; flat_number?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      })
      .finally(() => setLoading(false));
  }, []);

async function login(username: string, password: string) {
  const { data } = await api.post("/auth/login/", { username, password });
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  const me = await api.get("/auth/me/");
  setUser(me.data);
  return me.data;
}

  async function register(payload: { username: string; password: string; email: string; flat_number?: string }) {
    await api.post("/auth/register/", payload);
    await login(payload.username, payload.password);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}