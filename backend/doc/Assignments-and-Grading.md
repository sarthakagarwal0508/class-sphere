# Assignments & Grading APIs

Base URL: `http://localhost:5000`. Protected endpoints use `Authorization: Bearer <ACCESS_TOKEN>`.

## Assignment schema

`title` (3–150 chars), `description` (max 5000, default empty), `classroom` (Classroom ObjectId), `teacher` (User ObjectId), `dueDate` (Date), `maxMarks` (number >= 1), timestamps.

## 1. Create assignment

**POST** `/api/classrooms/CLASSROOM_ID/assignments` — owning teacher only.

Request:
```json
{
  "title": "Binary Trees Worksheet",
  "description": "Solve the attached questions.",
  "dueDate": "2026-11-05T18:00:00.000Z",
  "maxMarks": 20
}
```
`dueDate` must be a valid future date. `maxMarks` must be a JSON number between 1 and 10000.

Success `201`:
```json
{
  "success": true,
  "message": "Assignment created successfully.",
  "data": {
    "assignment": {
      "_id": "671234567890abcdef123456",
      "title": "Binary Trees Worksheet",
      "description": "Solve the attached questions.",
      "classroom": "671234567890abcdef123457",
      "teacher": "671234567890abcdef123458",
      "dueDate": "2026-11-05T18:00:00.000Z",
      "maxMarks": 20,
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:00:00.000Z"
    }
  }
}
```

## 2. List assignments for a classroom

**GET** `/api/classrooms/CLASSROOM_ID/assignments` — classroom owner or enrolled student.

Response `200`:
```json
{
  "success": true,
  "count": 1,
  "data": {
    "assignments": [
      {
        "_id": "671234567890abcdef123456",
        "title": "Binary Trees Worksheet",
        "description": "Solve the attached questions.",
        "classroom": "671234567890abcdef123457",
        "teacher": { "_id": "671234567890abcdef123458", "name": "Teacher Name", "email": "teacher@example.com" },
        "dueDate": "2026-11-05T18:00:00.000Z",
        "maxMarks": 20
      }
    ]
  }
}
```

## 3. Submit assignment

**POST** `/api/assignments/ASSIGNMENT_ID/submit` — enrolled student only; before deadline.

Request (provide text, URL, or both):
```json
{
  "answerText": "My solution is explained here...",
  "submissionUrl": "https://example.com/my-work.pdf"
}
```
`answerText` max 10000 chars. `submissionUrl` max 2048 chars and must be HTTP(S). A student can resubmit while the existing submission is not graded; graded submissions cannot be changed through this endpoint.

Success `201`:
```json
{
  "success": true,
  "message": "Assignment submitted successfully.",
  "data": {
    "submission": {
      "_id": "671234567890abcdef123459",
      "assignment": "671234567890abcdef123456",
      "student": "671234567890abcdef123460",
      "answerText": "My solution is explained here...",
      "submissionUrl": "https://example.com/my-work.pdf",
      "status": "submitted",
      "marksObtained": null,
      "feedback": "",
      "submittedAt": "2026-10-22T10:00:00.000Z"
    }
  }
}
```

## 4. View submissions for an assignment

**GET** `/api/assignments/ASSIGNMENT_ID/submissions` — assignment's teacher only.

Response `200`:
```json
{
  "success": true,
  "count": 1,
  "data": {
    "submissions": [
      {
        "_id": "671234567890abcdef123459",
        "assignment": "671234567890abcdef123456",
        "student": { "_id": "671234567890abcdef123460", "name": "Student Name", "email": "student@example.com" },
        "status": "submitted",
        "marksObtained": null,
        "feedback": ""
      }
    ]
  }
}
```

## 5. Grade a submission

**PATCH** `/api/assignments/ASSIGNMENT_ID/submissions/SUBMISSION_ID/grade` — assignment's teacher only.

Request:
```json
{
  "marksObtained": 18,
  "feedback": "Good work; review the deletion case in your tree traversal."
}
```
`marksObtained` must be a JSON number between 0 and assignment `maxMarks`; feedback max 3000 characters.

Success `200`:
```json
{
  "success": true,
  "message": "Submission graded successfully.",
  "data": {
    "submission": {
      "_id": "671234567890abcdef123459",
      "status": "graded",
      "marksObtained": 18,
      "feedback": "Good work; review the deletion case in your tree traversal.",
      "gradedAt": "2026-10-22T10:30:00.000Z"
    }
  }
}
```
The real response contains the full submission document.

## 6. Get my submission and grade

**GET** `/api/assignments/ASSIGNMENT_ID/my-submission` — enrolled student only.

Response `200`:
```json
{
  "success": true,
  "data": {
    "assignment": {
      "_id": "671234567890abcdef123456",
      "title": "Binary Trees Worksheet",
      "dueDate": "2026-11-05T18:00:00.000Z",
      "maxMarks": 20
    },
    "submission": null
  }
}
```
`submission` is `null` when the student has not submitted. Otherwise it contains the student's submission, status, marks and feedback.

## Submission schema

- `assignment`: Assignment ObjectId
- `student`: User ObjectId
- `answerText`: string, max 10000, default empty
- `submissionUrl`: HTTP(S) URL string, max 2048, default empty
- `submittedAt`: Date
- `status`: `submitted` or `graded`
- `marksObtained`: number or null
- `feedback`: string, max 3000
- `gradedAt`: Date or null
- Unique index: one submission record per student per assignment
