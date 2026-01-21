/**
 * Utility to handle API errors consistently across the application.
 * Parses backend error responses (e.g. from Django REST Framework)
 * and returns a standard Error object with a user-friendly message.
 */
export async function handleApiError(response: Response | undefined, defaultMessage: string): Promise<never> {
  if (!response) {
    throw new Error(defaultMessage || "Network error or no response received");
  }
  let errorMessage = defaultMessage;

  try {
    const data = await response.json();

    if (data) {
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === "object") {
        // Handle DRF validation errors: { "field": ["error"] }
        const messages = Object.entries(data).map(([key, value]) => {
          const val = Array.isArray(value) ? value.join(", ") : value;
          return `${key}: ${val}`;
        });
        if (messages.length > 0) {
          errorMessage = messages.join(" | ");
        }
      }
    }
  } catch {
    // If response is not JSON or parsing fails, stick with default message or status text
    errorMessage = response.statusText || defaultMessage;
  }

  throw new Error(errorMessage);
}
