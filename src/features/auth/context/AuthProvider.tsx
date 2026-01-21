import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { LocalStorageUserType } from "@/types";
import { getStoredUser, setStoredUser, clearStoredUser } from "../utils/authUtils";

interface AuthContextType {
  user: LocalStorageUserType | null;
  login: (user: LocalStorageUserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<LocalStorageUserType | null>(() => getStoredUser());

  useEffect(() => {
    const handleAuthUpdate = () => {
      setUser(getStoredUser());
    };
    const handleLogout = () => {
      setUser(null);
    };

    globalThis.addEventListener("auth:updated", handleAuthUpdate);
    globalThis.addEventListener("auth:logout", handleLogout);

    return () => {
      globalThis.removeEventListener("auth:updated", handleAuthUpdate);
      globalThis.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const logout = React.useCallback(() => {
    clearStoredUser();
  }, []);

  const login = React.useCallback((userData: LocalStorageUserType) => {
    setStoredUser(userData);
  }, []);

  const authValue = React.useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
