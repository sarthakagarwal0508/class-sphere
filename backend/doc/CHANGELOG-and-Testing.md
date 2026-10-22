# Changelog and Postman Testing Checklist

## Updates captured in this documentation

1. **Notifications route mount:** use `app.use("/api/notifications", notificationRoutes)` so the router's `GET /` and `PATCH /:id/read` become `/api/notifications` and `/api/notifications/:id/read`.
2. **Classroom metadata:** added `subject` and `semesterSection` to the classroom schema and create/update API contract.
3. **Six-character join code:** new codes use three random bytes encoded as uppercase hex. Existing codes remain unchanged.
4. **Collision retry:** classroom creation retries a small number of times if the unique `classCode` index reports a collision.
5. **Classroom deletion cleanup:** attempts to remove authenticated Cloudinary study-material files and related Notification, Announcement, Submission, Assignment and StudyMaterial records before deleting the Classroom.
6. **Docs corrected:** assignment submission/grading endpoints now listed exactly as declared in `src/routes/assignmentRoutes.js`; analytics, notifications and Google sign-in documented.

## Before testing

- Use a local test database or disposable demo records.
- Never test classroom deletion against real classes unless you intentionally want the data permanently deleted and have a backup.
- Confirm the changed `Classroom.js`, `classroomController.js`, and `src/app.js` are the versions running locally.
- Ensure environment variables for MongoDB, JWT, Gmail and Cloudinary are configured; never put secret values into documentation or Git.

## Suggested Postman test sequence

1. `GET /api/health` — expect `200`.
2. Register a test teacher: `POST /api/auth/register`.
3. Verify OTP: `POST /api/auth/verify-otp`.
4. Login as teacher: `POST /api/auth/login`; copy `data.accessToken`.
5. `GET /api/auth/me` with the same token; verify `data.user.role` is `teacher`.
6. Create classroom with `name`, `description`, `subject`, `semesterSection`; expect `201` and six-character `classCode`.
7. `GET /api/classrooms`; verify classroom and new metadata are returned.
8. `PATCH /api/classrooms/CLASSROOM_ID`; update subject or semester/section.
9. Register/verify/login a student test account; join classroom with `POST /api/classrooms/join` and `classCode`.
10. Create assignment, submit as student, view submissions as teacher, grade as teacher, and fetch the student's own submission.
11. Upload a PDF as the teacher, list materials as teacher/student, download it with the access token, update metadata and delete a disposable material.
12. Create an announcement; log in as the enrolled student and call `GET /api/notifications`; mark one notification read.
13. Test the four analytics endpoints with the correct roles.
14. Only after all prior tests, create a **disposable** classroom with dependent test records and exercise `DELETE /api/classrooms/CLASSROOM_ID`; verify MongoDB records and Cloudinary objects.

## Common troubleshooting

### “You do not have permission to access this resource.”

A protected route's role middleware returned `403`. Call `GET /api/auth/me` using the exact bearer token the frontend is sending. Classroom creation requires a database user whose role is `teacher`. Do not remove role middleware to bypass the error.

### `Cannot GET /api/notifications`

Check the mount in `src/app.js`: `app.use("/api/notifications", notificationRoutes)`. Restart the server and redeploy the backend if needed.

### Classroom subject/semester values missing

Confirm frontend JSON keys are exactly `subject` and `semesterSection`, the schema includes both fields, controller reads/saves them, and frontend is calling the updated server. Old documents may not contain these fields.

### A 6-character code is not shown

Only newly created classrooms use the new generator. Old database codes remain their original length unless intentionally migrated.

### Classroom deletion returns 500

The cleanup performs operations across MongoDB and Cloudinary without a shared transaction. Check server logs, inspect which resources were deleted, and reconcile leftovers before retrying. Repeated deletion may encounter already-missing Cloudinary files or records.

## Validation boundary

These documents describe the route/controller/schema contracts reviewed from the available backend ZIP plus the changes discussed in this chat. Examples are illustrative; IDs, dates, array sizes and token values vary. The live deployed environment was not called from this documentation build, so run the checklist before treating every endpoint as production-verified.
