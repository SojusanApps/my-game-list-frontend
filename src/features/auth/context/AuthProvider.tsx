import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { LocalStorageUserType } from "@/types";
import { getStoredUser, setStoredUser, clearStoredUser } from "../utils/authUtils";

interface AuthContextType {
  user: LocalStorageUserType | null;
  login: (user: LocalStorageUserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalStorageUserType | null>(() => getStoredUser());

  useEffect(() => {
    const handleAuthUpdate = () => {
      setUser(getStoredUser());
    };
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("auth:updated", handleAuthUpdate);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:updated", handleAuthUpdate);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const login = (userData: LocalStorageUserType) => {
    setStoredUser(userData);
  };

  const logout = () => {
    clearStoredUser();
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
