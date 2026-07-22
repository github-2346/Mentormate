export type UserRole = 'MENTOR' | 'STUDENT';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
