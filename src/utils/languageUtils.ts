const LANGUAGE_KEY = "language";

export type Language = "en" | "pl";

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return stored === "pl" ? "pl" : "en";
}

export function setStoredLanguage(language: Language): void {
  localStorage.setItem(LANGUAGE_KEY, language);
}
