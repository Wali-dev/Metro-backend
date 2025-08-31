# Metro API Documentation

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
   - [User Routes](#user-routes)
   - [Instruction Routes](#instruction-routes)
   - [Step Routes](#step-routes)
   - [Subscription Routes](#subscription-routes)
   - [Analytics Routes](#analytics-routes)
5. [Error Handling](#error-handling)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)
8. [Best Practices](#best-practices)

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Postman or similar API testing tool

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in your root directory:
   ```env
   DATABASE_URL=mongodb://localhost:27017/metro
   PORT=8000
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Verify Installation**
   ```bash
   curl http://localhost:8000/api/v1
   ```
   Expected response: `"This is the start of an epic journey."`

### Hello World Example

Create your first user:

```bash
curl -X POST http://localhost:8000/api/v1/user \
  -H "Content-Type: application/json" \
  -d '{
    "auth_provider": "local",
    "name": "John Doe",
    "email": "john@example.com",
    "password_hash": "mypassword123",
    "bio": "My first Metro user"
  }'
```

---

## Core Concepts

### Key Terminology

- **User**: A registered account holder who can create instructions and subscriptions
- **Instruction**: A structured guide or tutorial containing multiple steps (like a blog post or flowchart)
- **Step**: Individual components within an instruction, ordered sequentially
- **Subscription**: User's plan type and billing information (free, creator, pro, enterprise)
- **Analytics**: Event tracking data (views, likes, shares, step completions)

### Data Relationships

```
User (1) ──────── (many) Instructions
             │
             └── (many) Subscriptions
             └── (many) Analytics

Instruction (1) ─── (many) Steps
                └── (many) Analytics

Step (1) ────────── (many) Analytics
```

---

## Authentication

Currently, the API supports three authentication providers:

- **`local`**: Traditional email/password authentication
- **`clerk`**: Third-party authentication service
- **`google`**: Google OAuth integration

**Note**: No authentication middleware is currently implemented. All endpoints are publicly accessible.

---

## API Endpoints

### Base URL
```
http://localhost:8000/api/v1
```

---

## User Routes

### Create User
**`POST /user`**

Creates a new user account.

**Request Body:**
```json
{
  "auth_provider": "local",
  "name": "Charlie Brown",
  "email": "charlie@example.com",
  "password_hash": "mypassword123",
  "bio": "Testing bcrypt password hashing",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "68b31beb50e1757d8ddddb5b",
    "auth_provider": "local",
    "name": "Charlie Brown",
    "email": "charlie@example.com",
    "bio": "Testing bcrypt password hashing",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response (409):**
```json
{
  "message": "User with this email already exists"
}
```

### Update User
**`PUT /user/:id`**

Updates an existing user's information.

**Parameters:**
- `id` (string, required): User's MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Sam Samuel",
  "bio": "This is the beginning of an epic",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "userObj": {
    "_id": "68b31beb50e1757d8ddddb5b",
    "name": "Sam Samuel",
    "bio": "This is the beginning of an epic",
    "role": "admin"
  }
}
```

### Delete User
**`DELETE /user/:id`**

Permanently deletes a user account.

**Parameters:**
- `id` (string, required): User's MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Instruction Routes

### Create Instruction
**`POST /instruction`**

Creates a new instruction (guide/tutorial).

**Request Body:**
```json
{
  "user_id": "68b31beb50e1757d8ddddb5b",
  "title": "How to Learn Node.js",
  "description": "Step by step guide to learn Node.js from scratch.",
  "format_type": "blog",
  "is_published": false,
  "banner_image": "https://example.com/images/nodejs.png",
  "theme_settings": {
    "color": "blue",
    "font": "Arial"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Instruction created successfully",
  "instruction": {
    "_id": "68b324d52a6e2ce902034964",
    "user_id": "68b31beb50e1757d8ddddb5b",
    "title": "How to Learn Node.js",
    "description": "Step by step guide to learn Node.js from scratch.",
    "format_type": "blog",
    "is_published": false,
    "views_count": 0,
    "banner_image": "https://example.com/images/nodejs.png",
    "theme_settings": {
      "color": "blue",
      "font": "Arial"
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Update Instruction
**`PUT /instruction/:id`**

Updates an existing instruction.

**Parameters:**
- `id` (string, required): Instruction's MongoDB ObjectId

**Request Body:**
```json
{
  "title": "Updated Node.js Guide",
  "description": "Updated description for Node.js learning.",
  "is_published": true,
  "theme_settings": {
    "color": "green",
    "font": "Verdana"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Instruction updated successfully",
  "instruction": {
    "_id": "68b324d52a6e2ce902034964",
    "title": "Updated Node.js Guide",
    "description": "Updated description for Node.js learning.",
    "is_published": true,
    "theme_settings": {
      "color": "green",
      "font": "Verdana"
    }
  }
}
```

### Delete Instruction
**`DELETE /instruction/:id`**

Permanently deletes an instruction and all associated steps.

**Response (200):**
```json
{
  "success": true,
  "message": "Instruction deleted successfully"
}
```

### Get Instructions by User
**`GET /instruction/user/:userId`**

Retrieves all instructions created by a specific user, including their steps.

**Parameters:**
- `userId` (string, required): User's MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "message": "Instructions with steps fetched successfully",
  "instructions": [
    {
      "_id": "68b324d52a6e2ce902034964",
      "user_id": "68b31beb50e1757d8ddddb5b",
      "title": "How to Learn Node.js",
      "description": "Step by step guide to learn Node.js from scratch.",
      "format_type": "blog",
      "is_published": true,
      "views_count": 0,
      "steps": [
        {
          "_id": "68b32a47e19a40a94e8a9d66",
          "instruction_id": "68b324d52a6e2ce902034964",
          "step_order": 1,
          "title": "Install Node.js",
          "description": "Download and install Node.js from the official website."
        }
      ]
    }
  ]
}
```

---

## Step Routes

### Create Step
**`POST /step`**

Creates a new step within an instruction.

**Request Body:**
```json
{
  "instruction_id": "68b324d52a6e2ce902034964",
  "step_order": 1,
  "title": "Install Node.js",
  "description": "Download Node.js from the official website and install it.",
  "image_url": "https://example.com/images/install-node.png",
  "video_url": "https://example.com/videos/install-node.mp4"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Step created successfully",
  "step": {
    "_id": "68b32a47e19a40a94e8a9d66",
    "instruction_id": "68b324d52a6e2ce902034964",
    "step_order": 1,
    "title": "Install Node.js",
    "description": "Download Node.js from the official website and install it.",
    "image_url": "https://example.com/images/install-node.png",
    "video_url": "https://example.com/videos/install-node.mp4",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Update Step
**`PUT /step/:id`**

Updates an existing step.

**Parameters:**
- `id` (string, required): Step's MongoDB ObjectId

**Request Body:**
```json
{
  "title": "Setup Project Folder",
  "description": "Create a new folder, initialize npm, and install required packages.",
  "step_order": 2
}
```

**Error Response (400) - Duplicate Step Order:**
```json
{
  "success": false,
  "message": "Step order 2 already exists for this instruction"
}
```

### Delete Step
**`DELETE /step/:id`**

Permanently deletes a step.

**Response (200):**
```json
{
  "success": true,
  "message": "Step deleted successfully"
}
```

---

## Subscription Routes

### Create Subscription
**`POST /subscription`**

Creates a new subscription for a user.

**Request Body:**
```json
{
  "user_id": "68b32ef53848433e4377b98f",
  "plan_type": "creator",
  "status": "active",
  "current_period_start": "2025-08-01T00:00:00.000Z",
  "current_period_end": "2025-08-31T23:59:59.000Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "subscription": {
    "_id": "68b32f123848433e4377b990",
    "user_id": "68b32ef53848433e4377b98f",
    "plan_type": "creator",
    "status": "active",
    "current_period_start": "2025-08-01T00:00:00.000Z",
    "current_period_end": "2025-08-31T23:59:59.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get All Subscriptions
**`GET /subscription`**

Retrieves all subscriptions (admin usage).

**Response (200):**
```json
{
  "success": true,
  "message": "Subscriptions fetched successfully",
  "subscriptions": [...]
}
```

### Get Subscription by User
**`GET /subscription/user/:userId`**

Gets the most recent subscription for a specific user.

**Parameters:**
- `userId` (string, required): User's MongoDB ObjectId

**Response (200):**
```json
{
  "success": true,
  "message": "Subscription fetched successfully",
  "subscription": {
    "_id": "68b32f123848433e4377b990",
    "user_id": "68b32ef53848433e4377b98f",
    "plan_type": "creator",
    "status": "active"
  }
}
```

### Update Subscription
**`PUT /subscription/:id`**

Updates subscription details (plan changes, cancellations).

### Delete Subscription
**`DELETE /subscription/:id`**

Permanently deletes a subscription.

---

## Analytics Routes

### Create Analytics Event
**`POST /analytics`**

Records an analytics event.

**Request Body:**
```json
{
  "instruction_id": "68b324d52a6e2ce902034964",
  "user_id": "68b31beb50e1757d8ddddb5b",
  "event_type": "view",
  "step_id": "68b32a47e19a40a94e8a9d66"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Event created",
  "data": {
    "_id": "68b33012e19a40a94e8a9d70",
    "instruction_id": "68b324d52a6e2ce902034964",
    "user_id": "68b31beb50e1757d8ddddb5b",
    "event_type": "view",
    "step_id": "68b32a47e19a40a94e8a9d66",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get Analytics Events
**`GET /analytics`**

Retrieves analytics events with optional filtering.

**Query Parameters:**
- `event_type` (string, optional): Filter by event type (`view`, `share`, `like`, `step_complete`)
- `user_id` (string, optional): Filter by user
- `instruction_id` (string, optional): Filter by instruction

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "68b33012e19a40a94e8a9d70",
      "instruction_id": "68b324d52a6e2ce902034964",
      "user_id": "68b31beb50e1757d8ddddb5b",
      "event_type": "view",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Analytics by Instruction
**`GET /analytics/instruction/:instruction_id`**

### Get Analytics by User
**`GET /analytics/user/:user_id`**

### Get Instruction Statistics
**`GET /analytics/instruction/:instruction_id/stats`**

Returns aggregated statistics for an instruction.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "view": 150,
    "like": 23,
    "share": 8,
    "step_complete": 45
  }
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation errors, duplicate data)
- **404**: Resource not found
- **409**: Conflict (duplicate email, etc.)
- **500**: Internal server error

### Common Validation Errors

**Missing Required Fields:**
```json
{
  "success": false,
  "message": "instruction_id and event_type are required"
}
```

**Duplicate Step Order:**
```json
{
  "success": false,
  "message": "Step order 2 already exists for this instruction"
}
```

---

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```
Error connecting to database: MongoNetworkError
```
**Solution:** Verify your `DATABASE_URL` in `.env` and ensure MongoDB is running.

**2. Server Won't Start**
```
Server error: Error: listen EADDRINUSE: address already in use :::8000
```
**Solution:** Kill the process using port 8000 or change the `PORT` in your `.env` file.

**3. User Creation Fails with Duplicate Email**
**Solution:** Check if the email already exists in your database before creating.

**4. Invalid ObjectId Errors**
```
Cast to ObjectId failed for value "invalid-id"
```
**Solution:** Ensure all ID parameters are valid 24-character MongoDB ObjectIds.

### Debug Tips

1. **Enable Detailed Error Logging**: Check console output for detailed error messages
2. **Validate Request Bodies**: Use Postman's JSON validator before sending requests
3. **Check Database State**: Use MongoDB Compass or CLI to verify data integrity
4. **Test with curl**: Use simple curl commands to isolate issues

---

## FAQ

**Q: Do I need authentication to use these endpoints?**
A: Currently, no authentication is required. All endpoints are publicly accessible.

**Q: Can I change a user's password after creation?**
A: Yes, use the `PUT /user/:id` endpoint with `auth_provider: "local"` and a new `password_hash`.

**Q: What's the difference between `blog` and `flowchart` format types?**
A: These are UI presentation formats. `blog` displays steps sequentially, while `flowchart` shows them as interconnected nodes.

**Q: Can steps be reordered?**
A: Yes, update the `step_order` field, but ensure no duplicates exist for the same instruction.

**Q: How do I track user engagement?**
A: Use the analytics endpoints to record events like `view`, `like`, `share`, and `step_complete`.

**Q: What happens to steps when I delete an instruction?**
A: Currently, steps remain in the database. Consider implementing cascade deletion.

---

## Best Practices

### API Usage

1. **Always Validate Input**: Check required fields before making requests
2. **Handle Errors Gracefully**: Implement proper error handling in your client code
3. **Use Appropriate HTTP Methods**: POST for creation, PUT for updates, GET for retrieval
4. **Include Content-Type Headers**: Always set `Content-Type: application/json` for JSON requests

### Data Management

1. **Unique Step Orders**: Ensure each step within an instruction has a unique `step_order`
2. **Meaningful Titles**: Use descriptive titles for instructions and steps
3. **Consistent User IDs**: Always reference valid user ObjectIds when creating related records
4. **Image/Video URLs**: Use absolute URLs for media assets

### Performance

1. **Batch Analytics Events**: Consider batching multiple analytics events in a single request
2. **Index Important Fields**: The models already include proper indexes for common queries
3. **Pagination**: Implement pagination for large result sets (not currently built-in)
4. **Caching**: Consider caching frequently accessed instructions and user data

### Security (Future Considerations)

1. **Input Sanitization**: Validate and sanitize all user inputs
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Authentication**: Add proper authentication middleware before production
4. **HTTPS**: Use HTTPS in production environments

### Database

1. **Regular Backups**: Schedule regular MongoDB backups
2. **Monitor Performance**: Use MongoDB's built-in profiling tools
3. **Connection Pooling**: The app uses connection pooling (`maxPoolSize: 10`)
4. **Data Integrity**: Consider adding more robust validation and constraints