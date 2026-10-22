# Complete API Endpoint Index

Base URL: `http://localhost:5000`. Use `Authorization: Bearer <ACCESS_TOKEN>` for protected endpoints. Roles: `student`, `teacher`.

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| GET | `/api/health` | Public | Health check; no body |
| POST | `/api/auth/register` | Public | `{name,email,password,role?}` |
| POST | `/api/auth/verify-otp` | Public | `{email,otp}` |
| POST | `/api/auth/resend-otp` | Public | `{email}` |
| POST | `/api/auth/login` | Public | `{email,password}` |
| POST | `/api/auth/google` | Public | `{idToken,role?}`; role required for new Google account |
| POST | `/api/auth/refresh` | Public route; refresh token required in body | `{refreshToken}` |
| POST | `/api/auth/logout` | Public route; refresh token optional in body | `{refreshToken}` |
| GET | `/api/auth/me` | Authenticated user | No body |
| POST | `/api/classrooms` | Teacher | `{name,description?,subject?,semesterSection?}` |
| GET | `/api/classrooms` | Teacher or student | No body; own classrooms / enrolled classrooms |
| POST | `/api/classrooms/join` | Student | `{classCode}` |
| GET | `/api/classrooms/:id` | Teacher or student; must own/be enrolled | No body |
| PATCH | `/api/classrooms/:id` | Owning teacher | Any of `{name,description,subject,semesterSection}` |
| DELETE | `/api/classrooms/:id/students/:studentId` | Owning teacher | No body; remove student |
| POST | `/api/classrooms/:id/leave` | Student | No body |
| DELETE | `/api/classrooms/:id` | Owning teacher | No body; destructive cleanup |
| POST | `/api/classrooms/:id/assignments` | Owning teacher | `{title,description?,dueDate,maxMarks}` |
| GET | `/api/classrooms/:id/assignments` | Owner or enrolled student | No body |
| POST | `/api/assignments/:id/submit` | Enrolled student | `{answerText?,submissionUrl?}`; at least one required |
| GET | `/api/assignments/:id/submissions` | Assignment teacher | No body |
| PATCH | `/api/assignments/:assignmentId/submissions/:submissionId/grade` | Assignment teacher | `{marksObtained,feedback?}` |
| GET | `/api/assignments/:id/my-submission` | Enrolled student | No body |
| POST | `/api/classrooms/:id/materials` | Owning teacher | `multipart/form-data`: `file`, `title`, `description?` |
| GET | `/api/classrooms/:id/materials` | Owner or enrolled student | No body |
| GET | `/api/materials/:id/download` | Owner or enrolled student | No body; returns PDF binary |
| PATCH | `/api/materials/:id` | Owning teacher | `{title?,description?}` |
| DELETE | `/api/materials/:id` | Owning teacher | No body |
| POST | `/api/classrooms/:id/announcements` | Owning teacher | `{title,content}` |
| GET | `/api/classrooms/:id/announcements` | Owner or enrolled student | No body |
| PATCH | `/api/announcements/:id` | Announcement creator teacher | `{title?,content?}` |
| DELETE | `/api/announcements/:id` | Announcement creator teacher | No body; deletes its notifications |
| GET | `/api/notifications` | Authenticated user | No body; own notifications |
| PATCH | `/api/notifications/:id/read` | Authenticated recipient | No body |
| GET | `/api/analytics/student/overview` | Student | No body |
| GET | `/api/analytics/student/classrooms/:id` | Enrolled student | No body |
| GET | `/api/analytics/teacher/classrooms/:id` | Owning teacher | No body |
| GET | `/api/analytics/teacher/classrooms/:id/students` | Owning teacher | No body |

## Notes

- `:id` means a path parameter, not a literal string. Replace it with the actual MongoDB ObjectId.
- Notification paths require `notificationRoutes` to be mounted at `/api/notifications` in `src/app.js`.
- The latest available ZIP did not contain an AI quiz route/controller/model. No AI quiz endpoint is documented here because its actual contract has not been supplied/verified.
