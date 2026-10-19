# Classroom Management APIs

Base URL: `http://localhost:5000`. All endpoints require authentication.

## Create classroom
**POST** `/api/classrooms` — teacher only.
```json
{
  "name": "Data Structures",
  "description": "DSA class and resources"
}
```

## List my classrooms
**GET** `/api/classrooms`

## Join classroom
**POST** `/api/classrooms/join` — student only.
```json
{
  "classCode": "CLASS_CODE_HERE"
}
```

## Get classroom details
**GET** `/api/classrooms/CLASSROOM_ID`

## Update classroom
**PATCH** `/api/classrooms/CLASSROOM_ID` — owner teacher.
```json
{
  "name": "Data Structures - Section A",
  "description": "Updated classroom details"
}
```

## Remove a student
**DELETE** `/api/classrooms/CLASSROOM_ID/students/STUDENT_ID` — owner teacher.

## Leave classroom
**POST** `/api/classrooms/CLASSROOM_ID/leave` — student.

## Delete classroom
**DELETE** `/api/classrooms/CLASSROOM_ID` — owner teacher.
