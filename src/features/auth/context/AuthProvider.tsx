import { LocalStorageUserType } from "@/types";
import { useAuthStore } from "../store/authStore";

export interface AuthContextType {
  user: LocalStorageUserType | null;
  login: (user: LocalStorageUserType) => void;
  logout: () => void;
}

export function useAuth(): AuthContextType {
  return useAuthStore();
}
