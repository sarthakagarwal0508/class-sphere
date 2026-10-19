# Announcements & In-App Notifications APIs

Base URL: `http://localhost:5000`.

## Create announcement
**POST** `/api/classrooms/CLASSROOM_ID/announcements` — classroom owner teacher.
```json
{
  "title": "Tomorrow's Assignment",
  "content": "Please submit your assignment by 5 PM tomorrow."
}
```
Returns `201 Created`. Creates one notification for each enrolled student.

## List classroom announcements
**GET** `/api/classrooms/CLASSROOM_ID/announcements` — classroom owner teacher or enrolled student.

## Update announcement
**PATCH** `/api/announcements/ANNOUNCEMENT_ID` — teacher who created it.
```json
{
  "title": "Updated Assignment Notice",
  "content": "Submit your assignment by 6 PM tomorrow."
}
```

## Delete announcement
**DELETE** `/api/announcements/ANNOUNCEMENT_ID` — teacher who created it. Deletes related notification records too.

## Get my notifications
**GET** `/api/notifications` — returns only the current user's notifications.

## Mark notification as read
**PATCH** `/api/notifications/NOTIFICATION_ID/read` — notification recipient only. No body required.

Notifications are stored in MongoDB. There is no Socket.IO/realtime transport; the frontend must fetch the list or implement polling.
