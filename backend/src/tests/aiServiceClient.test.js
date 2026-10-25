const test = require("node:test");
const assert = require("node:assert/strict");
const { summarizePdf, generateQuiz, AIServiceError } = require("../services/aiServiceClient");

const originalFetch = global.fetch;
const originalAiUrl = process.env.AI_SERVICE_URL;
const originalQuizUrl = process.env.QUIZ_SERVICE_URL;

test.after(() => {
  global.fetch = originalFetch;
  if (originalAiUrl === undefined) delete process.env.AI_SERVICE_URL;
  else process.env.AI_SERVICE_URL = originalAiUrl;
  if (originalQuizUrl === undefined) delete process.env.QUIZ_SERVICE_URL;
  else process.env.QUIZ_SERVICE_URL = originalQuizUrl;
});

test("summarizePdf forwards a PDF as multipart form data", async () => {
  process.env.AI_SERVICE_URL = "https://summarizer.example/";
  let url;
  let options;
  global.fetch = async (requestUrl, requestOptions) => {
    url = requestUrl;
    options = requestOptions;
    return new Response(JSON.stringify({ summary: "Summary", flashcards: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const result = await summarizePdf({
    buffer: Buffer.from("%PDF-1.4 test"),
    originalname: "notes.pdf",
  });
  assert.equal(url, "https://summarizer.example/summarize");
  assert.equal(options.method, "POST");
  assert.ok(options.body instanceof FormData);
  assert.equal(options.body.get("file").name, "notes.pdf");
  assert.equal(result.summary, "Summary");
});

test("generateQuiz sends JSON with content type to the configured quiz service", async () => {
  process.env.QUIZ_SERVICE_URL = "https://quiz.example";
  let options;
  global.fetch = async (_url, requestOptions) => {
    options = requestOptions;
    return new Response(JSON.stringify({ questions: [], returned: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  const payload = { topic: "Math", study_material: "", num_questions: 5, difficulty: "mixed" };
  await generateQuiz(payload);
  assert.equal(options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(options.body), payload);
});

test("AI service client reports a missing service URL clearly", async () => {
  delete process.env.AI_SERVICE_URL;
  await assert.rejects(
    summarizePdf({ buffer: Buffer.from("pdf"), originalname: "notes.pdf" }),
    (error) => error instanceof AIServiceError && error.code === "AI_SERVICE_NOT_CONFIGURED"
  );
});
