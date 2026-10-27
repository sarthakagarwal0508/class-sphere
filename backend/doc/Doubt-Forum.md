# ClassSphere — Doubt Discussion API

## Base URL

Local backend:

`http://localhost:5000`

All endpoints use the `/api/discussions` prefix.

All endpoints require authentication:

`Authorization: Bearer <ACCESS_TOKEN>`

Use a student access token for student actions and a teacher access token for teacher actions.

**Important:** For classroom doubt endpoints, the URL must contain `/classrooms/` before the classroom ID. Do not use `/api/discussions/:classroomId/doubts`.

---

## 1. Create Doubt

**Method:** POST

**Complete endpoint:**

`/api/discussions/classrooms/:classroomId/doubts`

**Example:**

`http://localhost:5000/api/discussions/classrooms/CLASSROOM_ID/doubts`

**Access:** Enrolled students only. Teachers cannot create doubts through this endpoint.

### Request body

```json
{
  "title": "Confusion in AVL tree rotations",
  "description": "Can someone explain LL and LR rotations?"
}
```

### Successful response

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "DOUBT_ID",
    "classroom": "CLASSROOM_ID",
    "student": "STUDENT_ID",
    "title": "Confusion in AVL tree rotations",
    "description": "Can someone explain LL and LR rotations?",
    "status": "open",
    "replies": [],
    "createdAt": "DATE",
    "updatedAt": "DATE"
  }
}
```

The IDs and dates are illustrative. The actual response contains values from the saved document.

---

## 2. Get Classroom Doubts

**Method:** GET

**Complete endpoint:**

`/api/discussions/classrooms/:classroomId/doubts`

**Example:**

`http://localhost:5000/api/discussions/classrooms/CLASSROOM_ID/doubts`

**Access:** Classroom-owning teacher or enrolled student.

### Optional query parameters

- `status=open` — return open doubts.
- `status=resolved` — return resolved doubts.
- `page=1` — page number; defaults to 1.
- `limit=20` — records per page; defaults to 20 and is capped at 50.

### Filtered request example

`http://localhost:5000/api/discussions/classrooms/CLASSROOM_ID/doubts?status=open&page=1&limit=20`

### Successful response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "DOUBT_ID",
      "classroom": "CLASSROOM_ID",
      "student": {
        "_id": "STUDENT_ID",
        "name": "Student Name",
        "email": "student@example.com"
      },
      "title": "Confusion in AVL tree rotations",
      "description": "Can someone explain LL and LR rotations?",
      "status": "open",
      "replies": [
        {
          "_id": "REPLY_ID",
          "author": {
            "_id": "USER_ID",
            "name": "User Name",
            "role": "teacher"
          },
          "message": "Explanation goes here",
          "createdAt": "DATE",
          "updatedAt": "DATE"
        }
      ],
      "createdAt": "DATE",
      "updatedAt": "DATE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

The `student` and `replies[].author` fields are populated by the backend. A reply author may be a student or a teacher.

---

## 3. Reply to a Doubt

**Method:** POST

**Complete endpoint:**

`/api/discussions/doubts/:doubtId/replies`

**Example:**

`http://localhost:5000/api/discussions/doubts/DOUBT_ID/replies`

**Access:**
- Enrolled students can reply.
- The teacher who owns the classroom can reply.
- The doubt must have `status: "open"`.

### Request body

```json
{
  "message": "LL rotation is used when the imbalance is in the left subtree of the left child."
}
```

### Successful response

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "_id": "DOUBT_ID",
    "classroom": "CLASSROOM_ID",
    "student": "STUDENT_ID",
    "title": "Confusion in AVL tree rotations",
    "description": "Can someone explain LL and LR rotations?",
    "status": "open",
    "replies": [
      {
        "author": "USER_ID",
        "message": "LL rotation is used when the imbalance is in the left subtree of the left child.",
        "_id": "REPLY_ID",
        "createdAt": "DATE",
        "updatedAt": "DATE"
      }
    ],
    "createdAt": "DATE",
    "updatedAt": "DATE"
  }
}
```

The example is illustrative. The current controller returns the updated doubt document, with the reply author's ID rather than the populated author object.

**Important:** Replies to resolved doubts are rejected with `400 Bad Request`.

---

## 4. Update Doubt Status

**Method:** PATCH

**Complete endpoint:**

`/api/discussions/doubts/:doubtId/status`

**Example:**

`http://localhost:5000/api/discussions/doubts/DOUBT_ID/status`

**Access:**
- The teacher who owns the classroom can resolve or reopen classroom doubts.
- A student can resolve or reopen their own doubt.
- Other students cannot change someone else's doubt status.

### Resolve a doubt

Request body:

```json
{
  "status": "resolved"
}
```

### Reopen a doubt

Request body:

```json
{
  "status": "open"
}
```

### Successful response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "DOUBT_ID",
    "status": "resolved"
  }
}
```

The current controller returns the complete doubt document in `data`; the example above shows only the relevant status field.

Only `open` and `resolved` are valid status values.

---

## Doubt Schema

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Doubt ID |
| `classroom` | ObjectId | Classroom ID |
| `student` | ObjectId | ID of the doubt's author |
| `title` | String | Required; maximum 150 characters |
| `description` | String | Required; maximum 5000 characters |
| `status` | String | `open` or `resolved`; defaults to `open` |
| `replies` | Array | Replies added by classroom members |
| `replies[].author` | ObjectId | Reply author's User ID |
| `replies[].message` | String | Required; maximum 3000 characters |
| `replies[].createdAt` | Date | Reply creation timestamp |
| `replies[].updatedAt` | Date | Reply update timestamp |
| `createdAt` | Date | Doubt creation timestamp |
| `updatedAt` | Date | Last update timestamp |

---

## Frontend Integration Notes

- Use the classroom ID from existing classroom data.
- Use the returned doubt `_id` for reply and status requests.
- Use the full endpoint paths listed above.
- Do not omit `/classrooms/` in the create/list endpoints.
- Send the current access token in the `Authorization` header for every endpoint.
- Students can create doubts. Teachers cannot create doubts through the current create endpoint.
- Both enrolled students and the classroom-owning teacher can reply while a doubt is open.
- Only the doubt author or the classroom-owning teacher can resolve/reopen it.
- Display `status` as an Open/Resolved badge.
- Handle loading, empty states, `400`, `401`, `403`, `404`, and unexpected server errors.
- Replies are embedded in the doubt document; there is no separate reply-list endpoint.
- The current feature does not include file attachments, upvotes, accepted answers, edit/delete doubt endpoints, notifications, search, or real-time updates.