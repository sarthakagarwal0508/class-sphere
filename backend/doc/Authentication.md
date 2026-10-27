# Authentication APIs

Base URL: `http://localhost:5000`.

## 1. Health check

**GET** `/api/health` — public; no request body.

Example response `200`:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "service": "ClassSphere API"
  }
}
```

## 2. Register

**POST** `/api/auth/register` — public. Starts email OTP verification. The role defaults to `student` if omitted.

Request:
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "YourStrongPassword",
  "role": "student"
}
```

Rules: name 2–80 characters; valid email; password at least 8 characters and at most 72 UTF-8 bytes; role must be `student` or `teacher`.

Response `201`:
```json
{
  "success": true,
  "message": "Registration successful. Verify your email using the OTP sent to you.",
  "data": {
    "userId": "671234567890abcdef123456",
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "role": "student",
    "isEmailVerified": false,
    "otpExpiresInMinutes": 10
  }
}
```
`otpExpiresInMinutes` is configuration-driven; the value above is illustrative.

## 3. Verify email OTP

**POST** `/api/auth/verify-otp` — public.

Request:
```json
{
  "email": "aarav@example.com",
  "otp": "123456"
}
```

Success `200`:
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}
```
OTP must be six digits. An expired/incorrect OTP returns `400`; excessive attempts can return `429`.

## 4. Resend OTP

**POST** `/api/auth/resend-otp` — public.

Request:
```json
{ "email": "aarav@example.com" }
```

Success `200`:
```json
{
  "success": true,
  "message": "A new OTP has been sent to your email.",
  "data": {
    "email": "aarav@example.com",
    "expiresInMinutes": 10,
    "resendCooldownSeconds": 60
  }
}
```
Timing values are configuration-driven/implementation constants; confirm the actual values in `src/utils/otp.js`.

## 5. Login

**POST** `/api/auth/login` — public; email must be verified.

Request (role is required and must match the role selected on the login screen):
```json
{
  "email": "aarav@example.com",
  "password": "YourStrongPassword",
  "role": "student"
}
```

If the account is stored as a different role, the API returns `403` with `code: "ROLE_MISMATCH"` and does not issue tokens. If role is missing or invalid, it returns `400` with `code: "LOGIN_FIELDS_INVALID"`. The role is compared to the database record; it is never updated by login.

Success `200`:
```json
{
  "success": true,
  "message": "Authentication successful.",
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "role": "student"
    },
    "accessToken": "<ACCESS_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>",
    "tokenType": "Bearer",
    "expiresIn": "15m"
  }
}
```

## 6. Google sign-in

**POST** `/api/auth/google` — public. Send the Google Identity SDK's **ID token**, not the ClassSphere access token.

Request for a new Google account:
```json
{
  "idToken": "<GOOGLE_ID_TOKEN>",
  "role": "student"
}
```
`role` is required for every Google login. For an existing account, the requested role must match the stored role; a mismatch returns `403 ROLE_MISMATCH` and no tokens. The backend never changes an existing account's role during login.

Success `200`:
```json
{
  "success": true,
  "message": "Google authentication successful.",
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "role": "student",
      "isEmailVerified": true
    },
    "accessToken": "<ACCESS_TOKEN>",
    "refreshToken": "<REFRESH_TOKEN>",
    "tokenType": "Bearer",
    "expiresIn": "15m"
  }
}
```

## 7. Refresh access token

**POST** `/api/auth/refresh` — public route, but requires a valid refresh token in the body.

Request:
```json
{ "refreshToken": "<CURRENT_REFRESH_TOKEN>" }
```
Success response has the same shape as login and returns a **new access token and new refresh token**. Replace both stored tokens. Reusing the old refresh token is rejected.

## 8. Logout

**POST** `/api/auth/logout` — public route; send the refresh token to revoke the current refresh-token session.

Request:
```json
{ "refreshToken": "<CURRENT_REFRESH_TOKEN>" }
```
Success `200`:
```json
{
  "success": true,
  "message": "Logged out. Discard tokens on the client."
}
```
Client should clear its local token state regardless of response.

## 9. Current user

**GET** `/api/auth/me` — protected.

Header:
```http
Authorization: Bearer <ACCESS_TOKEN>
```

Success `200`:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "671234567890abcdef123456",
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "role": "student"
    }
  }
}
```
Use this endpoint to debug role/token mismatches. A teacher-only endpoint requires `data.user.role` to be `teacher`.

## Security and rate limits

- Passwords are hashed with bcrypt; raw passwords are never returned.
- OTPs are stored as hashes and have expiry/attempt/cooldown rules.
- Access token default lifetime is `15m`; refresh token default lifetime is `7d`, configurable via environment variables.
- Authentication routes use rate limits. Respect `429` responses rather than retrying in a tight loop.
