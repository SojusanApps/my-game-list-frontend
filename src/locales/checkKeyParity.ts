function collectMissingKeys(en: Record<string, unknown>, pl: Record<string, unknown>, prefix: string): string[] {
  const missing: string[] = [];
  for (const key of Object.keys(en)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!(key in pl)) {
      missing.push(path);
    } else if (typeof en[key] === "object" && en[key] !== null && typeof pl[key] === "object" && pl[key] !== null) {
      missing.push(...collectMissingKeys(en[key] as Record<string, unknown>, pl[key] as Record<string, unknown>, path));
    }
  }
  return missing;
}

export function checkKeyParity(en: Record<string, unknown>, pl: Record<string, unknown>): string[] {
  return collectMissingKeys(en, pl, "");
}
