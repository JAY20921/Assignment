# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication Flow

1. Register or Login to get JWT token
2. Include token in Authorization header for all protected routes
3. Token expires after 7 days (configurable)

## Endpoints

### Authentication

#### Register New User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### Tasks (All endpoints require authentication)

**Authentication Header Required:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Get All Tasks
**Endpoint:** `GET /api/tasks`

**Query Parameters:**
- `status` (optional): Filter by status ("To Do", "In Progress", "Done")

**Example:** `GET /api/tasks?status=To Do`

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API docs",
      "status": "In Progress",
      "user": "65f0987654321abcdef67890",
      "createdAt": "2026-02-03T10:00:00.000Z",
      "updatedAt": "2026-02-03T11:30:00.000Z"
    },
    {
      "_id": "65f1234567890abcdef12346",
      "title": "Deploy to production",
      "description": "Configure and deploy application",
      "status": "To Do",
      "user": "65f0987654321abcdef67890",
      "createdAt": "2026-02-03T09:00:00.000Z",
      "updatedAt": "2026-02-03T09:00:00.000Z"
    }
  ]
}
```

#### Get Single Task
**Endpoint:** `GET /api/tasks/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "status": "In Progress",
    "user": "65f0987654321abcdef67890",
    "createdAt": "2026-02-03T10:00:00.000Z",
    "updatedAt": "2026-02-03T11:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to view this task"
}
```

#### Create Task
**Endpoint:** `POST /api/tasks`

**Request Body:**
```json
{
  "title": "New Task Title",
  "description": "Detailed description of the task",
  "status": "To Do"
}
```

**Field Requirements:**
- `title`: Required, string, max 100 characters
- `description`: Required, string, max 500 characters
- `status`: Optional, enum ["To Do", "In Progress", "Done"], default: "To Do"

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12347",
    "title": "New Task Title",
    "description": "Detailed description of the task",
    "status": "To Do",
    "user": "65f0987654321abcdef67890",
    "createdAt": "2026-02-03T12:00:00.000Z",
    "updatedAt": "2026-02-03T12:00:00.000Z"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

#### Update Task
**Endpoint:** `PUT /api/tasks/:id`

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "In Progress"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "title": "Updated Task Title",
    "description": "Updated description",
    "status": "In Progress",
    "user": "65f0987654321abcdef67890",
    "createdAt": "2026-02-03T10:00:00.000Z",
    "updatedAt": "2026-02-03T13:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to update this task"
}
```

#### Delete Task
**Endpoint:** `DELETE /api/tasks/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task removed"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to delete this task"
}
```

---

## HTTP Status Codes

- `200` - OK: Successful GET, PUT, DELETE
- `201` - Created: Successful POST
- `400` - Bad Request: Validation error or malformed request
- `401` - Unauthorized: Missing or invalid authentication token
- `404` - Not Found: Resource doesn't exist
- `500` - Internal Server Error: Server error

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional, for validation errors
}
```

## Rate Limiting

- **Limit:** 100 requests per 10 minutes per IP address
- **Response when exceeded (429):**
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

## CORS

Configured to accept requests from:
- Development: `http://localhost:3000`
- Production: Set via `CLIENT_URL` environment variable

## Example Usage

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create Task (use token from login response)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My Task","description":"Task description","status":"To Do"}'

# Get All Tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Task
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"status":"Done"}'

# Delete Task
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript Fetch

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
const token = data.token;

// Create Task
const taskResponse = await fetch('http://localhost:5000/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Task',
    description: 'Task description',
    status: 'To Do'
  })
});
const taskData = await taskResponse.json();
```

## Postman Collection

Import this JSON into Postman for easy API testing:

```json
{
  "info": {
    "name": "Task Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

For more information, see the main [README.md](README.md)
