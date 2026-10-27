class AIServiceError extends Error {
  constructor(message, code, statusCode = 502) {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const getBaseUrl = (envName) => {
  const value = process.env[envName];
  if (!value) {
    throw new AIServiceError(`${envName} is not configured.`, "AI_SERVICE_NOT_CONFIGURED", 503);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new AIServiceError(`${envName} is not a valid URL.`, "AI_SERVICE_URL_INVALID", 503);
  }

  const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocal)) {
    throw new AIServiceError(`${envName} must use HTTPS outside localhost.`, "AI_SERVICE_URL_INSECURE", 503);
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new AIServiceError(
      `${envName} must contain only the service base URL, without an API path, query, or hash.`,
      "AI_SERVICE_URL_INVALID",
      503
    );
  }

  return url.origin;
};

const requestService = async ({ envName, path, method = "POST", body, contentType, timeoutMs = 120000 }) => {
  const baseUrl = getBaseUrl(envName);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      ...(body === undefined ? {} : { body }),
      signal: controller.signal,
      headers: { Accept: "application/json", ...(contentType ? { "Content-Type": contentType } : {}) },
    });

    const raw = await response.text();
    const responseContentType = response.headers.get("content-type") || "unknown content type";
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      // A deployed Flask host may return an HTML 404/502 page instead of JSON.
      // Do not return upstream HTML or request details to the browser.
      console.error(`${envName} returned non-JSON content (HTTP ${response.status}, ${responseContentType}).`);
      const message = response.ok
        ? "The AI service returned an unreadable response. Check that the configured URL points to the quiz API service."
        : `The AI service returned a non-JSON error response (HTTP ${response.status}). Check the service URL and deployment logs.`;
      throw new AIServiceError(message, "AI_INVALID_RESPONSE", 502);
    }

    if (!response.ok) {
      const message = typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string" ? data.message : "The AI service could not process the request.";
      // Avoid logging prompts, PDFs, API keys, or student content.
      console.error(`${envName} responded with HTTP ${response.status}.`);
      throw new AIServiceError(message, "AI_SERVICE_REQUEST_FAILED", response.status >= 400 && response.status < 500 ? response.status : 502);
    }

    return data;
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    if (error.name === "AbortError") {
      throw new AIServiceError("The AI service timed out. Please retry.", "AI_SERVICE_TIMEOUT", 504);
    }
    throw new AIServiceError("The AI service is unreachable. Please retry later.", "AI_SERVICE_UNAVAILABLE", 502);
  } finally {
    clearTimeout(timeout);
  }
};

const makePdfForm = (file, extraFields = {}) => {
  const form = new FormData();
  form.append("file", new Blob([file.buffer], { type: "application/pdf" }), file.originalname);
  for (const [key, value] of Object.entries(extraFields)) {
    if (value !== undefined && value !== null && value !== "") form.append(key, String(value));
  }
  return form;
};

const summarizePdf = (file) => requestService({
  envName: "AI_SERVICE_URL",
  path: "/summarize",
  body: makePdfForm(file),
});

const generateQuiz = (payload) => requestService({
  envName: "QUIZ_SERVICE_URL",
  path: "/generate-quiz",
  body: JSON.stringify(payload),
  contentType: "application/json",
  timeoutMs: 120000,
}).then((data) => data);

const generateQuizFromPdf = (file, extraFields) => requestService({
  envName: "QUIZ_SERVICE_URL",
  path: "/generate-quiz-from-pdf",
  body: makePdfForm(file, extraFields),
  timeoutMs: 120000,
});

module.exports = { AIServiceError, summarizePdf, generateQuiz, generateQuizFromPdf };
