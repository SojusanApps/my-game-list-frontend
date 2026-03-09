/**
 * Parses a date string based on simple format tokens.
 * Currently supports extracting parts from common formats like "YYYY-MM-DD".
 */
export function parseDate(dateStr?: string | null, format = "YYYY-MM-DD"): Date | null {
  if (!dateStr) return null;

  if (format === "YYYY-MM-DD" && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const [year, month, day] = dateStr.split("T")[0].split("-");
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Fallback for general strings
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Formats a Date object using simple format tokens.
 * Supports: YYYY, MM, DD
 */
export function formatDate(date?: Date | null, format = "YYYY-MM-DD"): string | null {
  if (!date || Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let result = format;
  result = result.replace("YYYY", year);
  result = result.replace("MM", month);
  result = result.replace("DD", day);

  return result;
}
