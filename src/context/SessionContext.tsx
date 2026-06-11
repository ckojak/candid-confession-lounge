import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: string;
  verified: boolean;
  createdAt: string;
}

interface SessionState {
  user: User | null;
  users: User[];
  register: (input: Omit<User, "id" | "verified" | "createdAt">) => { ok: true } | { ok: false; error: string };
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  setVerified: (verified: boolean) => void;
}

const SessionContext = createContext<SessionState | null>(null);

const USERS_KEY = "kojak.users";
const SESSION_KEY = "kojak.session";

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUsers(readLocal<User[]>(USERS_KEY, []));
    setUserId(readLocal<string | null>(SESSION_KEY, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(userId));
  }, [userId, hydrated]);

  const user = useMemo(() => users.find((u) => u.id === userId) ?? null, [users, userId]);

  const register: SessionState["register"] = useCallback((input) => {
    let result: { ok: true } | { ok: false; error: string } = { ok: true };
    setUsers((prev) => {
      if (prev.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        result = { ok: false, error: "Já existe uma conta com este e-mail" };
        return prev;
      }
      const newUser: User = {
        ...input,
        id: crypto.randomUUID(),
        verified: false,
        createdAt: new Date().toISOString(),
      };
      setUserId(newUser.id);
      return [...prev, newUser];
    });
    return result;
  }, []);

  const login: SessionState["login"] = useCallback(
    (email, password) => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );
      if (!found) return { ok: false, error: "E-mail ou senha incorretos" };
      setUserId(found.id);
      return { ok: true };
    },
    [users],
  );

  const logout = useCallback(() => setUserId(null), []);

  const setVerified = useCallback(
    (verified: boolean) => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verified } : u)));
    },
    [userId],
  );

  const value: SessionState = { user, users, register, login, logout, setVerified };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}