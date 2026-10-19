# Assignments & Grading APIs

Base URL: `http://localhost:5000`.

## Create assignment
**POST** `/api/classrooms/CLASSROOM_ID/assignments` — teacher who owns the classroom.
```json
{
  "title": "Binary Trees Worksheet",
  "description": "Solve the attached questions.",
  "dueDate": "2026-11-05T18:00:00.000Z",
  "maxMarks": 20
}
```

## List classroom assignments
**GET** `/api/classrooms/CLASSROOM_ID/assignments` — classroom owner teacher or enrolled student.

## Submission and grading fields
Submission model fields include `assignment`, `student`, `answerText`, `submissionUrl`, `submittedAt`, `status` (`submitted` or `graded`), `marksObtained`, `feedback`, and `gradedAt`.

The implementation includes student submission, teacher viewing submissions, grading, and fetching the student's own submission. Verify their exact URLs in `src/routes/assignmentRoutes.js` before frontend integration; those exact paths are not confirmed here.
