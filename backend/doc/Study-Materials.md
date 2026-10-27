# Study Materials & Resources APIs

Base URL: `http://localhost:5000`

All protected endpoints require:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Study materials are stored in Cloudinary as authenticated PDF assets. The backend checks classroom access before listing or downloading files.

**Upload limit:** 10 MB per request, one PDF per request.

---

## 1. Upload PDF

**Method:** `POST`

**Endpoint:**

```text
/api/classrooms/:id/materials
```

**Access:** Teacher who owns the classroom.

### Request

Use `multipart/form-data`, not JSON.

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | PDF file, maximum 10 MB |
| `title` | Text | Yes | Material title, 3–150 characters |
| `description` | Text | No | Optional description, maximum 2000 characters |

### Postman setup

1. Select `POST`.
2. Enter `/api/classrooms/YOUR_CLASSROOM_ID/materials` after your backend base URL.
3. Under Authorization, select Bearer Token and enter the teacher access token.
4. Under Body, select `form-data`.
5. Add `file`, change its type to **File**, and select the PDF.
6. Add `title` and optionally `description` as text fields.
7. Click Send.

Do not manually set the multipart `Content-Type` header. Postman or the browser generates the required boundary.

### Successful response

Expected status: `201 Created`.

```json
{
  "success": true,
  "message": "Study material uploaded successfully.",
  "material": {
    "_id": "<MATERIAL_ID>",
    "title": "Unit 2 Notes",
    "description": "Trees and graphs lecture notes",
    "classroom": "<CLASSROOM_ID>",
    "uploadedBy": "<TEACHER_ID>",
    "cloudinaryPublicId": "classsphere/study-materials/example.pdf",
    "originalName": "unit-2.pdf",
    "fileSize": 245760,
    "mimeType": "application/pdf",
    "createdAt": "2026-10-22T10:00:00.000Z",
    "updatedAt": "2026-10-22T10:00:00.000Z"
  }
}
```

The IDs, file metadata and timestamps above are illustrative. Your actual response will contain the saved document values.

The current upload controller response includes `cloudinaryPublicId`. The list endpoint intentionally omits this field.

---

## 2. List Classroom Materials

**Method:** `GET`

**Endpoint:**

```text
/api/classrooms/:id/materials
```

**Access:** Owning teacher or enrolled student.

### Request

Replace `:id` with the actual classroom ObjectId.

No request body is required.

### Successful response

Expected status: `200 OK`.

```json
{
  "success": true,
  "count": 1,
  "materials": [
    {
      "_id": "<MATERIAL_ID>",
      "title": "Unit 2 Notes",
      "description": "Trees and graphs lecture notes",
      "classroom": "<CLASSROOM_ID>",
      "uploadedBy": {
        "_id": "<TEACHER_ID>",
        "name": "Teacher Name",
        "email": "teacher@example.com"
      },
      "originalName": "unit-2.pdf",
      "fileSize": 245760,
      "mimeType": "application/pdf",
      "downloadUrl": "/api/materials/<MATERIAL_ID>/download",
      "createdAt": "2026-10-22T10:00:00.000Z"
    }
  ]
}
```

This response is illustrative. The real response depends on the materials stored in the classroom.

The current list controller removes `cloudinaryPublicId` from each returned material.

---

## 3. Download a PDF

**Method:** `GET`

**Endpoint:**

```text
/api/materials/:id/download
```

**Access:** Owning teacher or enrolled student.

### Request

Replace `:id` with the material ObjectId.

No request body is required. Include the user's access token.

### Successful response

The endpoint returns the PDF as binary data with:

```http
Content-Type: application/pdf
```

It does **not** return JSON.

### Frontend integration

The frontend must send the access token and handle a binary/blob response. It can then create a download link or display the PDF, depending on the user experience.

### Potential errors

- `400`: Invalid material ID.
- `403`: User does not have access to the classroom.
- `404`: Material not found.
- `500`: The controller could not complete the retrieval operation.

The precise response depends on the operation that failed.

---

## 4. Update Material Metadata

**Method:** `PATCH`

**Endpoint:**

```text
/api/materials/:id
```

**Access:** Owning teacher only.

### Request body

Send one or both fields:

```json
{
  "title": "Updated Lecture Notes",
  "description": "Revised notes for Unit 2"
}
```

The example values are for demonstration only.

### Successful response

Expected status: `200 OK`.

```json
{
  "success": true,
  "message": "Study material updated successfully.",
  "material": {
    "_id": "<MATERIAL_ID>",
    "title": "Updated Lecture Notes",
    "description": "Revised notes for Unit 2",
    "classroom": "<CLASSROOM_ID>",
    "uploadedBy": "<TEACHER_ID>",
    "cloudinaryPublicId": "classsphere/study-materials/example.pdf",
    "originalName": "unit-2.pdf",
    "fileSize": 245760,
    "mimeType": "application/pdf",
    "createdAt": "2026-10-22T10:00:00.000Z",
    "updatedAt": "2026-10-22T10:30:00.000Z"
  }
}
```

The current update controller returns the material document, including `cloudinaryPublicId`.

### Validation

- Provide at least one of `title` or `description`.
- `title` must be 3–150 characters.
- `description` must not exceed 2000 characters.
- An invalid material ID, missing material, or non-owner access should be rejected.

Note: The upload/update responses expose `cloudinaryPublicId`, while the list response omits it. For consistent response privacy, the controller could be updated later to remove that field from the upload/update responses as well. It is not a Cloudinary API secret, but it is an internal storage identifier.

---

## 5. Delete a Material

**Method:** `DELETE`

**Endpoint:**

```text
/api/materials/:id
```

**Access:** Owning teacher only.

### Request

Replace `:id` with the material ObjectId.

No request body is required.

### Successful response

Expected status: `200 OK`.

```json
{
  "success": true,
  "message": "Study material deleted successfully."
}
```

The current controller deletes the Cloudinary file and then the MongoDB record.

If the storage deletion fails, the endpoint returns an error. When troubleshooting, verify both Cloudinary and MongoDB because remote storage deletion and database deletion are not one atomic transaction.

---

## StudyMaterial Schema

The current Mongoose model contains:

| Field | Purpose |
|---|---|
| `title` | Material title |
| `description` | Optional material description |
| `classroom` | Reference to the Classroom |
| `uploadedBy` | Reference to the uploading User |
| `cloudinaryPublicId` | Identifier for the stored Cloudinary asset |
| `originalName` | Original filename |
| `fileSize` | File size in bytes |
| `mimeType` | Content type; defaults to `application/pdf` |
| `createdAt` | Creation timestamp |
| `updatedAt` | Last update timestamp |

`cloudinaryPublicId` is required and unique. The model also has a compound index on `{ classroom: 1, createdAt: -1 }` for classroom material retrieval.

---

## Important Notes

1. Use the actual classroom and material ObjectIds in requests.
2. Only the classroom-owning teacher can upload, update or delete materials.
3. Only a classroom member can list or download materials.
4. Upload PDFs using `multipart/form-data`; do not send the file as JSON.
5. Download responses contain PDF bytes, so the frontend must not assume JSON.
6. Never expose Cloudinary credentials or other environment secrets to the frontend.
7. Classroom deletion and Cloudinary storage cleanup should be verified separately because they are not a single atomic operation.

For all available backend endpoints, see `API-Index.md`. For the model definitions and indexes, see `Data-Schemas.md`.