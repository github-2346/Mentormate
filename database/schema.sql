-- MentorMate Schema
-- PostgreSQL 15+

CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL CHECK (role IN ('MENTOR', 'STUDENT'))
);

CREATE TABLE IF NOT EXISTS sessions (
    id          VARCHAR(36)  PRIMARY KEY,  -- UUID
    title       VARCHAR(200) NOT NULL,
    language    VARCHAR(50)  NOT NULL,
    mentor_id   BIGINT       NOT NULL REFERENCES users(id),
    student_id  BIGINT       REFERENCES users(id),
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACTIVE', 'ENDED')),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    started_at  TIMESTAMP,
    ended_at    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id          BIGSERIAL    PRIMARY KEY,
    session_id  VARCHAR(36)  NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    sender_id   BIGINT       NOT NULL REFERENCES users(id),
    message     TEXT         NOT NULL,
    type        VARCHAR(20)  NOT NULL DEFAULT 'TEXT' CHECK (type IN ('TEXT', 'CODE', 'SYSTEM')),
    timestamp   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS code_snapshots (
    id          BIGSERIAL    PRIMARY KEY,
    session_id  VARCHAR(36)  NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    code        TEXT         NOT NULL,
    language    VARCHAR(50)  NOT NULL,
    saved_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_mentor   ON sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student  ON sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status   ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_messages_session  ON messages(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_snapshots_session ON code_snapshots(session_id, saved_at);
