import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LocalStorageUserType } from "@/types";

interface AuthState {
  user: LocalStorageUserType | null;
  login: (user: LocalStorageUserType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      login: user => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user",
    },
  ),
);
