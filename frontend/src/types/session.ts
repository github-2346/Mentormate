export type SessionStatus = 'PENDING' | 'ACTIVE' | 'ENDED';

export interface Session {
  id: string;
  mentorId: number;
  studentId: number | null;
  mentorName: string;
  studentName: string | null;
  status: SessionStatus;
  title: string;
  language: string;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
}

export interface CreateSessionRequest {
  title: string;
  language: string;
}

export interface CodeUpdate {
  sessionId: string;
  code: string;
  language: string;
  senderId: number;
}
