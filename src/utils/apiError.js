const GENERIC_API_ERRORS = new Set([
  "Bad Request",
  "Forbidden",
  "Internal Server Error",
  "Not Found",
  "Unauthorized",
]);

export const apiErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;
  const rawMessage = responseData?.error ?? responseData?.detail;
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

  if (!message || GENERIC_API_ERRORS.has(message)) return fallback;
  return message;
};
