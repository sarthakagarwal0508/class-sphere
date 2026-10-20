// Axios ke kisi bhi error ko ek saaf Error mein badalta hai:
//   error.message = backend ka "message" (ya ek friendly fallback)
//   error.code    = backend ka optional "code"
//   error.status  = HTTP status
export function toApiError(error) {
  const body = error?.response?.data;

  let message = body?.message;
  if (!message) {
    if (error?.code === "ECONNABORTED") {
      message = "The server took too long to respond. Please try again.";
    } else if (error?.request && !error?.response) {
      message = "Cannot reach the server. Check your internet connection and try again.";
    } else {
      message = "Something went wrong. Please try again.";
    }
  }

  const apiError = new Error(message);
  apiError.code = body?.code ?? error?.code;
  apiError.status = error?.response?.status;
  return apiError;
}