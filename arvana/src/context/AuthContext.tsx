import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../types";

/**
 * DEMO AUTH LAYER — frontend only.
 *
 * This simulates authentication using localStorage so the site is fully
 * navigable and persistent without a backend. Passwords are stored in plain
 * text here purely for demo purposes — a real implementation must replace
 * this with a proper backend (hashed passwords, sessions/JWT, etc.) and
 * simply swap out the functions below (login/register/logout) for real API
 * calls, keeping the same context shape so the rest of the app is unaffected.
 */

interface AuthContextValue {
  user: Omit<User, "password"> | null;
  users: User[];
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  register: (data: { name: string; email: string; mobile: string; password: string }) => {
    success: boolean;
    error?: string;
  };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USERS_KEY = "arvana_users";
const SESSION_KEY = "arvana_session";

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadUsers());
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (userId) localStorage.setItem(SESSION_KEY, userId);
    else localStorage.removeItem(SESSION_KEY);
  }, [userId]);

  const login: AuthContextValue["login"] = (identifier, password) => {
    const match = users.find(
      (u) =>
        (u.email.toLowerCase() === identifier.trim().toLowerCase() || u.mobile === identifier.trim()) &&
        u.password === password
    );
    if (!match) return { success: false, error: "Invalid email/mobile or password." };
    setUserId(match.id);
    return { success: true };
  };

  const register: AuthContextValue["register"] = ({ name, email, mobile, password }) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) return { success: false, error: "An account with this email already exists." };
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      password,
    };
    setUsers((prev) => [...prev, newUser]);
    setUserId(newUser.id);
    return { success: true };
  };

  const logout = () => setUserId(null);

  const resetPassword: AuthContextValue["resetPassword"] = (email, newPassword) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!exists) return { success: false, error: "No account found with this email." };
    setUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === email.trim().toLowerCase() ? { ...u, password: newPassword } : u))
    );
    return { success: true };
  };

  const current = users.find((u) => u.id === userId) ?? null;
  const user = current ? { id: current.id, name: current.name, email: current.email, mobile: current.mobile } : null;

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
