# API Documentation - VedaAI

All API requests should be prefixed with `/api`.

## 📋 Assignments API

### 1. List All Assignments
- **Endpoint**: `GET /assignments`
- **Response**:
  ```json
  {
    "success": true,
    "data": [ { "title": "...", "subject": "...", "status": "..." } ]
  }
  ```

### 2. Create Assignment
- **Endpoint**: `POST /assignments`
- **Body**:
  ```json
  {
    "title": "Algebra Quiz",
    "subject": "Mathematics",
    "classLevel": "10",
    "dueDate": "2026-12-01",
    "questionConfigs": [ { "type": "MCQ", "count": 10, "marks": 1 } ]
  }
  ```
- **Response**: `201 Created` with `assignmentId`.

### 3. Delete Assignment
- **Endpoint**: `DELETE /assignments/:id`
- **Action**: Removes assignment and all associated results.

### 4. Regenerate Assignment
- **Endpoint**: `POST /assignments/:id/regenerate`
- **Action**: Clears previous results and re-triggers the AI worker for the same config.

## 📊 Results API

### 1. Get Generated Result
- **Endpoint**: `GET /results/:assignmentId`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "schoolName": "...",
      "sections": [ ... ]
    }
  }
  ```
- **Note**: This endpoint uses a Redis cache for optimized performance during high traffic.

## 🧪 Testing with cURL
```bash
curl -X GET https://veda-ai-assessment.onrender.com/api/assignments
```
