# Classroom Management APIs

Base URL: `http://localhost:5000`. All endpoints require a valid ClassSphere access token. Create/update/delete actions are teacher-only; join/leave are student-only.

## Classroom schema

A classroom contains `name`, `description`, `subject`, `semesterSection`, `classCode`, `teacher`, `students`, and timestamps. `subject` and `semesterSection` are the fields added in the recent schema change. Existing documents may not contain these fields; treat missing values as empty until migrated/backfilled.

The class-code generator now produces six uppercase hexadecimal characters for **new** classrooms. Existing codes are not automatically rewritten.

## 1. Create classroom

**POST** `/api/classrooms` — teacher only.

Request:
```json
{
  "name": "Data Structures",
  "description": "DSA class and resources",
  "subject": "DSA",
  "semesterSection": "3rd / A"
}
```
`name` must be 3–100 characters; `description` at most 500 characters; `subject` at most 100; `semesterSection` at most 50. The last two fields may be empty.

Success `201`:
```json
{
  "success": true,
  "message": "Classroom created successfully.",
  "data": {
    "classroom": {
      "_id": "671234567890abcdef123456",
      "name": "Data Structures",
      "description": "DSA class and resources",
      "subject": "DSA",
      "semesterSection": "3rd / A",
      "classCode": "A7C91F",
      "teacher": "671234567890abcdef123457",
      "students": [],
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:00:00.000Z"
    }
  }
}
```
IDs and timestamps above are examples. The exact response contains the saved Mongoose document.

## 2. List my classrooms

**GET** `/api/classrooms` — teacher or student.

No body. Teachers receive classrooms they own; students receive classrooms they joined.

Response `200`:
```json
{
  "success": true,
  "count": 1,
  "data": {
    "classrooms": [
      {
        "_id": "671234567890abcdef123456",
        "name": "Data Structures",
        "description": "DSA class and resources",
        "subject": "DSA",
        "semesterSection": "3rd / A",
        "classCode": "A7C91F",
        "teacher": { "_id": "671234567890abcdef123457", "name": "Teacher Name", "email": "teacher@example.com" },
        "students": [],
        "createdAt": "2026-10-22T10:00:00.000Z",
        "updatedAt": "2026-10-22T10:00:00.000Z"
      }
    ]
  }
}
```

## 3. Join classroom

**POST** `/api/classrooms/join` — student only.

Request:
```json
{ "classCode": "A7C91F" }
```
Code is normalized to uppercase. Duplicate membership returns `409`.

Success `200`:
```json
{
  "success": true,
  "message": "Classroom joined successfully.",
  "data": { "classroom": { "_id": "671234567890abcdef123456", "classCode": "A7C91F" } }
}
```
The real response includes the full saved classroom document.

## 4. Get classroom details

**GET** `/api/classrooms/CLASSROOM_ID` — classroom teacher or enrolled student.

No body. Response `200`:
```json
{
  "success": true,
  "data": {
    "classroom": {
      "_id": "671234567890abcdef123456",
      "name": "Data Structures",
      "subject": "DSA",
      "semesterSection": "3rd / A",
      "teacher": { "_id": "671234567890abcdef123457", "name": "Teacher Name", "email": "teacher@example.com" },
      "students": []
    }
  }
}
```

## 5. Update classroom

**PATCH** `/api/classrooms/CLASSROOM_ID` — owning teacher only. Send only fields being changed.

Request:
```json
{
  "subject": "Data Structures and Algorithms",
  "semesterSection": "3rd / Section B"
}
```
Supported fields: `name`, `description`, `subject`, `semesterSection`.

Success `200`:
```json
{
  "success": true,
  "message": "Classroom updated successfully.",
  "data": { "classroom": { "_id": "671234567890abcdef123456", "subject": "Data Structures and Algorithms", "semesterSection": "3rd / Section B" } }
}
```
The actual response includes the full classroom document.

## 6. Remove a student

**DELETE** `/api/classrooms/CLASSROOM_ID/students/STUDENT_ID` — owning teacher only. No body.

Success `200`:
```json
{ "success": true, "message": "Student removed successfully." }
```
Student submissions are preserved by this operation.

## 7. Leave classroom

**POST** `/api/classrooms/CLASSROOM_ID/leave` — student only. No body.

Success `200`:
```json
{ "success": true, "message": "You have left the classroom successfully." }
```
Previous submissions are preserved.

## 8. Delete classroom

**DELETE** `/api/classrooms/CLASSROOM_ID` — owning teacher only. No body.

The recent controller change attempts to delete authenticated Cloudinary PDFs and related notifications, announcements, submissions, assignments, study-material records, then the classroom.

Success `200`:
```json
{
  "success": true,
  "message": "Classroom and its related records deleted successfully."
}
```

**Destructive operation:** the cleanup is not a single atomic transaction. If an external or database operation fails partway through, partial cleanup may have occurred. Test only on disposable data and keep backups.
