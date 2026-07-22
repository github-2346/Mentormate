import axios, { AxiosError } from 'axios';
import { getToken, removeToken } from './auth';
import { AuthRequest, AuthResponse, SignupRequest } from '@/types/user';
import { Session, CreateSessionRequest } from '@/types/session';
import { Message } from '@/types/message';

// Base URL must NOT include /api — all paths below are absolute from root
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login:  (data: AuthRequest)  => api.post<AuthResponse>('/api/auth/login', data),
  signup: (data: SignupRequest) => api.post<AuthResponse>('/api/auth/signup', data),
  me:     ()                    => api.get('/api/auth/me'),
};

export const sessionApi = {
  create:  (data: CreateSessionRequest) => api.post<Session>('/api/sessions', data),
  getAll:  ()                           => api.get<Session[]>('/api/sessions'),
  getMine: ()                           => api.get<Session[]>('/api/sessions/mine'),
  getById: (id: string)                 => api.get<Session>(`/api/sessions/${id}`),
  join:    (id: string)                 => api.post<Session>(`/api/sessions/${id}/join`),
  start:   (id: string)                 => api.post<Session>(`/api/sessions/${id}/start`),
  end:     (id: string)                 => api.post<Session>(`/api/sessions/${id}/end`),
};

export const messageApi = {
  getBySession: (sessionId: string) => api.get<Message[]>(`/api/messages/${sessionId}`),
};

export default api;
