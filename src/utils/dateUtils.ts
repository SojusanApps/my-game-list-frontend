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

const TIME_INTERVALS = [
  { seconds: 31536000, label: "year" },
  { seconds: 2592000, label: "month" },
  { seconds: 86400, label: "day" },
  { seconds: 3600, label: "hour" },
  { seconds: 60, label: "minute" },
];

/**
 * Returns a relative time string (e.g., "5 minutes ago", "just now").
 */
export function timeAgo(dateInput?: Date | string | number | null): string | null {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  for (const { seconds: intervalSeconds, label } of TIME_INTERVALS) {
    const count = Math.floor(seconds / intervalSeconds);
    if (count >= 1) {
      return `${count} ${label}${count === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}
