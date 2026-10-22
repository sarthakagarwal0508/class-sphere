

export function toApiError(error) {
  const body = error?.response?.data;

  let message =
    typeof body === "string"
      ? body
      : body?.message ?? body?.error ?? body?.errors?.[0]?.message;
  if (!message) {
    if (error?.code === "ECONNABORTED") {
      message = "The server took too long to respond. Please try again.";
    } else if (error?.request && !error?.response) {
      message = "Cannot reach the server. Check your internet connection and try again.";
    } else if (error?.response?.status) {
      message = `The server returned an error (${error.response.status}). Please try again.`;
    } else {
      message = error?.message || "Something went wrong. Please try again.";
    }
  }

  const apiError = new Error(message);
  apiError.code = body?.code ?? error?.code;
  apiError.status = error?.response?.status;
  return apiError;
}
