# Authentication APIs

Base URL: `http://localhost:5000`

## Health check
**GET** `/api/health` — no auth required.

## Register
**POST** `/api/auth/register`
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "YourStrongPassword",
  "role": "student"
}
```
Role must be `student` or `teacher`. Registration initiates email OTP verification.

## Verify OTP
**POST** `/api/auth/verify-otp`
```json
{
  "email": "aarav@example.com",
  "otp": "123456"
}
```

## Resend OTP
**POST** `/api/auth/resend-otp`
```json
{
  "email": "aarav@example.com"
}
```

## Login
**POST** `/api/auth/login`
```json
{
  "email": "aarav@example.com",
  "password": "YourStrongPassword"
}
```
Use the returned access token for protected endpoints.

## Google sign-in
**POST** `/api/auth/google`
```json
{
  "idToken": "<GOOGLE_ID_TOKEN>",
  "role": "student"
}
```

## Refresh token
**POST** `/api/auth/refresh`
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

## Logout
**POST** `/api/auth/logout`
```json
{
  "refreshToken": "<REFRESH_TOKEN>"
}
```

## Current user
**GET** `/api/auth/me` — protected.

For all protected requests, send the Bearer access token.
