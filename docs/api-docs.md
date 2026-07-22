# MentorMate API Documentation

Base URL: `http://localhost:8080`

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication

### POST /api/auth/signup
Register a new user.

**Request**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "MENTOR"
}
```
**Response `200`**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "MENTOR" }
}
```

### POST /api/auth/login
```json
{ "email": "jane@example.com", "password": "secret123" }
```

### GET /api/auth/me
Returns the authenticated user's profile.

---

## Sessions

### POST /api/sessions  *(MENTOR)*
```json
{ "title": "React Hooks Deep Dive", "language": "typescript" }
```
**Response:** `SessionDTO`

### GET /api/sessions/mine
Returns all sessions where the user is mentor or student.

### GET /api/sessions/{id}
Returns a single session by ID.

### POST /api/sessions/{id}/join  *(STUDENT)*
Student joins a pending/active session via its ID (extracted from share link).

### POST /api/sessions/{id}/start  *(MENTOR)*
Transitions session from `PENDING` → `ACTIVE`.
Broadcasts updated `SessionDTO` to `/topic/session/{id}/status`.

### POST /api/sessions/{id}/end  *(MENTOR)*
Transitions session to `ENDED`.
Broadcasts updated `SessionDTO` to `/topic/session/{id}/status`.

---

## Messages

### GET /api/messages/{sessionId}
Returns full chat history for a session, ordered by timestamp ascending.

---

## WebSocket Events

Connect endpoint: `http://localhost:8080/ws` (SockJS)
STOMP connect headers: `{ Authorization: "Bearer <token>" }`

### Code Sync

**Send** to `/app/code`:
```json
{
  "sessionId": "uuid",
  "code": "const x = 1;",
  "language": "javascript",
  "senderId": 42
}
```
**Subscribe** `/topic/session/{id}/code` — receives same payload.
Strategy: last-write-wins, frontend throttles at 200ms.

### Chat

**Send** to `/app/chat`:
```json
{
  "sessionId": "uuid",
  "message": "Hello!",
  "type": "TEXT"
}
```
Type options: `TEXT | CODE | SYSTEM`

**Subscribe** `/topic/session/{id}/chat` — receives `MessageDTO`:
```json
{
  "id": 1,
  "sessionId": "uuid",
  "senderId": 42,
  "senderName": "Bob",
  "message": "Hello!",
  "type": "TEXT",
  "timestamp": "2025-01-01T10:00:00"
}
```

### WebRTC Signaling

**Send** to `/app/signal`:
```json
{
  "type": "offer",
  "from": 1,
  "to": 2,
  "sessionId": "uuid",
  "payload": { "type": "offer", "sdp": "..." }
}
```
`type` options: `offer | answer | ice-candidate`

**Subscribe** `/topic/session/{id}/signal` — receives `SignalMessageDTO`.
Clients filter by `signal.to === user.id`.

### Session Status

**Subscribe** `/topic/session/{id}/status` — receives `SessionDTO` on any status change (join, start, end).
