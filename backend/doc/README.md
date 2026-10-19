# ClassSphere API Documentation

Base URL: `http://localhost:5000`

Protected endpoints use:
```http
Authorization: Bearer <ACCESS_TOKEN>
```

Supported roles: `student`, `teacher`.

## Files
- `Authentication.md`
- `Classroom-Management.md`
- `Assignments-and-Grading.md`
- `Study-Materials.md`
- `Announcements-and-Notifications.md`

Only completed features are included. Assignment submission/grading routes should be checked against `src/routes/assignmentRoutes.js` before frontend integration because their exact route paths are not confirmed in this documentation.
