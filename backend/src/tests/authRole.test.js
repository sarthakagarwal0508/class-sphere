const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { login } = require("../controllers/authController");

const originalFindOne = User.findOne;
const originalJwtSecret = process.env.JWT_SECRET;
const originalRefreshSecret = process.env.JWT_REFRESH_SECRET;

const invokeLogin = async (body) => {
  const result = { statusCode: 200, body: null };
  const res = {
    status(code) { result.statusCode = code; return this; },
    json(value) { result.body = value; return this; },
  };
  await login({ body }, res);
  return result;
};

test.after(() => {
  User.findOne = originalFindOne;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
  if (originalRefreshSecret === undefined) delete process.env.JWT_REFRESH_SECRET;
  else process.env.JWT_REFRESH_SECRET = originalRefreshSecret;
});

test("login rejects a role different from the stored account role without issuing tokens", async () => {
  process.env.JWT_SECRET = "test-access-secret-at-least-32-characters";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-at-least-32-characters";
  const passwordHash = await bcrypt.hash("CorrectPassword123", 4);
  const user = {
    _id: { toString: () => "507f1f77bcf86cd799439011" },
    name: "Test Student",
    email: "student@example.com",
    password: passwordHash,
    role: "student",
    isEmailVerified: true,
    save: async () => {},
  };
  User.findOne = () => ({ select: async () => user });

  const response = await invokeLogin({
    email: "student@example.com",
    password: "CorrectPassword123",
    role: "teacher",
  });

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.code, "ROLE_MISMATCH");
  assert.equal(response.body.registeredRole, "student");
  assert.equal(response.body.data, undefined);
});

test("login rejects missing portal role instead of guessing a role", async () => {
  const response = await invokeLogin({
    email: "student@example.com",
    password: "CorrectPassword123",
  });
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.code, "LOGIN_FIELDS_INVALID");
});
