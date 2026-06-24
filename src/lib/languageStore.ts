import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "pl";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

function detectBrowserLanguage(): Language {
  const lang = navigator.language ?? navigator.languages?.[0] ?? "en";
  return lang.startsWith("pl") ? "pl" : "en";
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      language: detectBrowserLanguage(),
      setLanguage: language => set({ language }),
    }),
    {
      name: "language",
    },
  ),
);
