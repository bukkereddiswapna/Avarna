import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AdminUser } from "../types";

/**
 * DEMO ADMIN AUTH LAYER — frontend only, and intentionally separate from
 * the customer-facing AuthContext so a logged-in customer never has admin
 * access and vice versa.
 *
 * A single seeded admin account is created on first run (see ADMIN_SEED
 * below) so the admin login page is usable immediately. Like AuthContext,
 * this stores a plaintext password in localStorage purely for demo
 * purposes — replace with real backend authentication (hashed passwords,
 * sessions/JWT) before going live, keeping this context's shape the same
 * so the rest of the admin module doesn't need to change.
 */

const ADMIN_USERS_KEY = "arvana_admin_users";
const ADMIN_SESSION_KEY = "arvana_admin_session";
const ADMIN_REMEMBER_KEY = "arvana_admin_remember";

const ADMIN_SEED: AdminUser = {
  id: "admin_1",
  name: "Arvana Admin",
  email: "admin@arvana.co.in",
  password: "Arvana@Admin123",
};

function loadAdmins(): AdminUser[] {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    return raw ? JSON.parse(raw) : [ADMIN_SEED];
  } catch {
    return [ADMIN_SEED];
  }
}

interface AdminAuthContextValue {
  admin: Omit<AdminUser, "password"> | null;
  login: (email: string, password: string, rememberMe: boolean) => { success: boolean; error?: string };
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admins] = useState<AdminUser[]>(() => loadAdmins());
  const [adminId, setAdminId] = useState<string | null>(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) ?? localStorage.getItem(ADMIN_REMEMBER_KEY)
  );

  useEffect(() => {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(admins));
  }, [admins]);

  const login: AdminAuthContextValue["login"] = (email, password, rememberMe) => {
    const match = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) return { success: false, error: "Invalid admin email or password." };
    setAdminId(match.id);
    // "Remember me" persists across browser restarts (localStorage); otherwise
    // the session only lasts the current tab (sessionStorage).
    if (rememberMe) {
      localStorage.setItem(ADMIN_REMEMBER_KEY, match.id);
    } else {
      sessionStorage.setItem(ADMIN_SESSION_KEY, match.id);
    }
    return { success: true };
  };

  const logout = () => {
    setAdminId(null);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_REMEMBER_KEY);
  };

  const current = admins.find((a) => a.id === adminId) ?? null;
  const admin = current ? { id: current.id, name: current.name, email: current.email } : null;

  return <AdminAuthContext.Provider value={{ admin, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
