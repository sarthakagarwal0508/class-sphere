# Study Materials & Resources APIs

Base URL: `http://localhost:5000`.

## Upload PDF
**POST** `/api/classrooms/CLASSROOM_ID/materials` — classroom owner teacher.

Use `multipart/form-data`:
- `file`: PDF (required, maximum 10 MB)
- `title`: string
- `description`: optional string

## List classroom materials
**GET** `/api/classrooms/CLASSROOM_ID/materials` — classroom owner teacher or enrolled student.

## Download material
**GET** `/api/materials/MATERIAL_ID/download` — classroom owner teacher or enrolled student.

## Update material details
**PATCH** `/api/materials/MATERIAL_ID` — classroom owner teacher.
```json
{
  "title": "Updated Lecture Notes",
  "description": "Revised notes for Unit 2"
}
```

## Delete material
**DELETE** `/api/materials/MATERIAL_ID` — classroom owner teacher.

Frontend upload must use `FormData`. In browser requests, let the browser set the multipart `Content-Type` boundary.
