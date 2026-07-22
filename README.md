# MentorMate

A production-ready, real-time 1-on-1 mentorship platform featuring collaborative code editing, WebRTC video calling, and live chat — all in a single, seamless workspace.

![Stack](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)
![Stack](https://img.shields.io/badge/Spring_Boot-3.2-brightgreen?logo=springboot)
![Stack](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Stack](https://img.shields.io/badge/WebRTC-enabled-orange)
![Stack](https://img.shields.io/badge/STOMP_WebSocket-enabled-purple)

---

## Features

| Feature | Details |
|---|---|
| **Auth** | JWT-based login & signup with role-based access (Mentor / Student) |
| **Sessions** | Create, join via share link, start, and end — full lifecycle |
| **Collaborative Editor** | Monaco Editor with real-time STOMP sync (200ms throttle, last-write-wins) |
| **Live Chat** | Persisted messages (text + code snippets), real-time broadcast |
| **Video Call** | WebRTC 1-on-1 with screen sharing, mute, and camera controls |
| **Resizable Workspace** | Split-pane session view — editor + chat or video, drag to resize |

---

## Tech Stack

**Frontend**
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS with custom dark design system
- Monaco Editor (`@monaco-editor/react`)
- STOMP over SockJS (`@stomp/stompjs` + `sockjs-client`)
- Zustand (global state)
- Framer Motion (animations)
- WebRTC (native browser API — no external SDK)

**Backend**
- Spring Boot 3.2 (Java 17)
- Spring Security with JWT (jjwt 0.11.5)
- Spring WebSocket with STOMP broker + SockJS endpoint
- Spring Data JPA + Hibernate
- PostgreSQL 16

---

## Project Structure

```
mentormate/
├── frontend/                        # Next.js (React + TypeScript)
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── (auth)/login/        # Login
│   │   │   ├── (auth)/signup/       # Signup
│   │   │   ├── dashboard/           # Session management
│   │   │   └── session/[id]/        # Live session workspace
│   │   ├── components/              # UI components
│   │   │   ├── ui/                  # Button, Input, Badge, Modal
│   │   │   ├── layout/              # Navbar, Footer
│   │   │   ├── editor/              # Monaco collaborative editor
│   │   │   ├── chat/                # Real-time chat panel
│   │   │   ├── video/               # WebRTC video panel
│   │   │   └── session/             # Session card, create modal
│   │   ├── hooks/                   # useAuth, useWebSocket, useEditorSync, useVideoCall
│   │   ├── lib/                     # api.ts, auth.ts, websocket.ts, webrtc.ts, utils.ts
│   │   ├── store/                   # Zustand sessionStore
│   │   └── types/                   # TypeScript interfaces
│   ├── .env.local                   # Local env vars (not committed)
│   └── .env.example                 # Template
│
├── backend/                         # Spring Boot (Java 17)
│   └── src/main/java/com/mentorplatform/
│       ├── config/                  # Security, JWT filter, WebSocket, CORS, exception handler
│       ├── controller/              # Auth, Session, Message REST + WebSocket controllers
│       ├── service/                 # Business logic
│       ├── repository/              # Spring Data JPA repositories
│       ├── model/                   # JPA entities (User, Session, Message, CodeSnapshot)
│       ├── dto/                     # Request/response DTOs
│       └── util/                    # JwtUtil, Constants
│
├── database/
│   ├── schema.sql                   # Full PostgreSQL schema with indexes
│   └── seed.sql                     # Development seed data
│
├── docs/
│   ├── api-docs.md                  # REST API reference
│   └── websocket-events.md         # WebSocket event diagram
│
├── docker-compose.yml               # Full stack: postgres + backend + frontend
├── .env.example                     # All required environment variables
└── README.md
```

---

## Quick Start

### Option A — Docker (recommended)

```bash
git clone <repo-url> && cd mentormate

# Copy env template and set a strong JWT secret
cp .env.example .env
# Edit .env — at minimum set JWT_SECRET and DB_PASSWORD

docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

### Option B — Local development

**Prerequisites:** Node.js 20+, Java 17+, Maven 3.9+, PostgreSQL 16

**1. Database**
```bash
psql -U postgres -c "CREATE DATABASE mentormate;"
psql -U postgres -d mentormate -f database/schema.sql
psql -U postgres -d mentormate -f database/seed.sql
```

**2. Backend**
```bash
cd backend

# Export environment variables (or set them in your shell profile)
export DB_URL=jdbc:postgresql://localhost:5432/mentormate
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=bWVudG9ybWF0ZS1zdXBlci1zZWNyZXQta2V5LWNoYW5nZS1pbi1wcm9kdWN0aW9u

mvn spring-boot:run
# API available at http://localhost:8080
```

**3. Frontend**
```bash
cd frontend
cp .env.example .env.local   # already configured for local dev
npm install
npm run dev
# App available at http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DB_URL` | ✓ | `jdbc:postgresql://localhost:5432/mentormate` | PostgreSQL JDBC URL |
| `DB_USERNAME` | ✓ | `postgres` | Database username |
| `DB_PASSWORD` | ✓ | — | Database password |
| `JWT_SECRET` | ✓ | — | Base64-encoded secret, min 32 chars |
| `JWT_EXPIRATION` | | `86400000` | Token lifetime in ms (default 24h) |
| `PORT` | | `8080` | Backend server port |
| `SPRING_PROFILES_ACTIVE` | | `dev` | Spring profile (`dev` or `prod`) |
| `NEXT_PUBLIC_API_URL` | ✓ | `http://localhost:8080` | Backend base URL (no trailing `/api`) |
| `NEXT_PUBLIC_WS_URL` | ✓ | `http://localhost:8080/ws` | WebSocket endpoint |

---

## API Reference

See [`docs/api-docs.md`](docs/api-docs.md) for full documentation.

### REST Endpoints

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `POST` | `/api/auth/signup` | — | Any | Register |
| `POST` | `/api/auth/login` | — | Any | Login → JWT |
| `GET` | `/api/auth/me` | ✓ | Any | Current user |
| `POST` | `/api/sessions` | ✓ | MENTOR | Create session |
| `GET` | `/api/sessions/mine` | ✓ | Any | My sessions |
| `GET` | `/api/sessions/{id}` | ✓ | Any | Session detail |
| `POST` | `/api/sessions/{id}/join` | ✓ | STUDENT | Join session |
| `POST` | `/api/sessions/{id}/start` | ✓ | MENTOR | Start session |
| `POST` | `/api/sessions/{id}/end` | ✓ | MENTOR | End session |
| `GET` | `/api/messages/{sessionId}` | ✓ | Any | Chat history |

### WebSocket Topics

Connect to `/ws` via SockJS. Send STOMP `Authorization: Bearer <token>` header on CONNECT.

| Send to | Subscribe | Description |
|---------|-----------|-------------|
| `/app/code` | `/topic/session/{id}/code` | Live code sync |
| `/app/chat` | `/topic/session/{id}/chat` | Chat messages |
| `/app/signal` | `/topic/session/{id}/signal` | WebRTC signaling |
| — | `/topic/session/{id}/status` | Session state changes |

---

## Development Seed Accounts

| Name | Email | Password | Role |
|------|-------|----------|------|
| Alice Mentor | alice@example.com | password123 | MENTOR |
| Bob Student | bob@example.com | password123 | STUDENT |
| Carol Mentor | carol@example.com | password123 | MENTOR |
| Dan Student | dan@example.com | password123 | STUDENT |

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value (`openssl rand -base64 32`)
- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Set `DB_PASSWORD` to a strong password
- [ ] Configure HTTPS / TLS termination (nginx or load balancer)
- [ ] Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` to production URLs
- [ ] Consider replacing the in-memory STOMP broker with RabbitMQ for horizontal scaling

---

## Design System

Dark premium theme:
- **Backgrounds:** `#050507` primary · `#0d0d12` secondary · `#111118` card
- **Accents:** Neon blue `#00D4FF` · Electric orange `#FF6B00`
- **Typography:** Syne (headings) · Inter (body) · JetBrains Mono (code)
- **Effects:** Glassmorphism, grid backgrounds, glow shadows, smooth animations
