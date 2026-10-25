const test = require("node:test");
const assert = require("node:assert/strict");
const { predictBatch, ModelServiceError } = require("../services/mlPredictionService");

const originalFetch = global.fetch;
const originalModelUrl = process.env.MODEL_API_URL;

test.after(() => {
  global.fetch = originalFetch;
  if (originalModelUrl === undefined) delete process.env.MODEL_API_URL;
  else process.env.MODEL_API_URL = originalModelUrl;
});

test("predictBatch posts the student array to /predict-batch and preserves response order", async () => {
  process.env.MODEL_API_URL = "https://ml-service.example";
  let receivedUrl;
  let receivedOptions;
  const expected = [
    { at_risk: false, risk_probability: 0.12, risk_level: "Low" },
    { at_risk: true, risk_probability: 0.71, risk_level: "High" },
  ];

  global.fetch = async (url, options) => {
    receivedUrl = url;
    receivedOptions = options;
    return new Response(JSON.stringify(expected), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const input = [{ student: 1 }, { student: 2 }];
  const result = await predictBatch(input);

  assert.equal(receivedUrl, "https://ml-service.example/predict-batch");
  assert.equal(receivedOptions.method, "POST");
  assert.equal(receivedOptions.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(receivedOptions.body), input);
  assert.deepEqual(result, expected);
});

test("predictBatch rejects a response whose count does not match the input", async () => {
  process.env.MODEL_API_URL = "https://ml-service.example";
  global.fetch = async () => new Response(JSON.stringify([]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  await assert.rejects(
    predictBatch([{ student: 1 }]),
    (error) => error instanceof ModelServiceError && error.code === "MODEL_RESPONSE_MISMATCH"
  );
});

test("predictBatch reports a missing MODEL_API_URL clearly", async () => {
  delete process.env.MODEL_API_URL;
  await assert.rejects(
    predictBatch([{ student: 1 }]),
    (error) => error instanceof ModelServiceError && error.code === "MODEL_URL_NOT_CONFIGURED"
  );
});
