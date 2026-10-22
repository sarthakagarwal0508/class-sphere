# ClassSphere Backend API Documentation

**Version:** updated after the October 2026 backend changes  
**Base URL (local):** `http://localhost:5000`  
**Content type:** JSON unless an endpoint explicitly uses `multipart/form-data` or returns a PDF file.

> This documentation combines the existing `doc/` documentation with the routes/controllers/models in the latest available `class-sphere(2).zip` and the changes discussed in this chat: notification route mount, classroom `subject` and `semesterSection` fields, six-character class codes, and classroom-related cleanup on deletion. Confirm the changes are present in the running/deployed backend before treating them as live.

## Start here

1. Register using `POST /api/auth/register`.
2. Verify email with `POST /api/auth/verify-otp`.
3. Log in using `POST /api/auth/login`, or use Google sign-in.
4. For protected routes, send `Authorization: Bearer <ACCESS_TOKEN>`.
5. Refresh access tokens using `POST /api/auth/refresh`. Replace **both** access and refresh tokens after a successful refresh because refresh-token rotation is enabled.
6. A classroom is created by a `teacher`; students join using the six-character `classCode`.

## Roles

- `student`
- `teacher`

There is no `admin` role in the current User schema. The backend loads the user from the database on protected requests and checks the database role.

## Documentation files

- `Authentication.md` — register, OTP, login, Google auth, refresh, logout, current user.
- `Classroom-Management.md` — create/list/join/update/delete classrooms and members.
- `Assignments-and-Grading.md` — assignment creation, submissions, grading, and student submission lookup.
- `Study-Materials.md` — PDF upload, list, download, update, delete.
- `Announcements-and-Notifications.md` — announcements and in-app notifications.
- `Analytics.md` — student and teacher analytics endpoints.
- `Data-Schemas.md` — MongoDB/Mongoose schema reference and relationships.
- `CHANGELOG-and-Testing.md` — changes in this documentation update and Postman checklist.

## Common headers

Protected JSON request:
```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

For PDF upload, use `multipart/form-data` and let Postman/browser generate the multipart boundary. For PDF download, the response is `application/pdf`, not JSON.

## Common errors

```json
{
  "success": false,
  "message": "Invalid or expired access token."
}
```

- `400` — invalid/missing input.
- `401` — missing, invalid, or expired authentication token.
- `403` — authenticated user lacks the required role or resource access.
- `404` — resource not found or not accessible under the endpoint's checks.
- `409` — duplicate account, duplicate membership, or similar conflict.
- `413` — PDF upload exceeds 10 MB.
- `429` — rate limit or OTP cooldown/attempt limit.
- `500` — server-side failure.
- `502` — external email/Cloudinary download service failure in relevant endpoints.

## Important integration notes

- IDs such as `CLASSROOM_ID`, `ASSIGNMENT_ID`, and `MATERIAL_ID` must be MongoDB ObjectId strings.
- Do not send refresh tokens as bearer access tokens.
- Never expose assignment/quiz answer keys or secrets to a student-facing response.
- A `GET /api/health` response confirms the API process responds; it does not prove MongoDB, email, or Cloudinary operations are all healthy.
- Classroom deletion is destructive. Test it only on a disposable classroom and keep a backup. Database and Cloudinary deletion are not one atomic transaction.
