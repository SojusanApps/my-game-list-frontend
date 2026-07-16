export class ApiError extends Error {
  status: number;
  response: Response;
  /**
   * DRF-style per-field validation errors ({ "field": ["msg", ...] }), when the
   * error body was shaped that way. Undefined for {detail: ...}, plain-string,
   * or non-JSON bodies — callers that want inline field errors must check for it.
   */
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, response: Response, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
    this.fieldErrors = fieldErrors;
  }
}

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
  let fieldErrors: Record<string, string[]> | undefined;

  try {
    const data = await response.json();

    if (data) {
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === "object") {
        // Handle DRF validation errors: { "field": ["error"] }
        fieldErrors = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? value.map(String) : [String(value)]]),
        );
        const messages = Object.entries(fieldErrors).map(([key, value]) => `${key}: ${value.join(", ")}`);
        if (messages.length > 0) {
          errorMessage = messages.join(" | ");
        }
      }
    }
  } catch {
    // If response is not JSON or parsing fails, stick with default message or status text
    errorMessage = response.statusText || defaultMessage;
  }

  throw new ApiError(errorMessage, response.status, response, fieldErrors);
}
