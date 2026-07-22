import Cookies from 'js-cookie';
import { User } from '@/types/user';

const TOKEN_KEY = 'mm_token';
const USER_KEY  = 'mm_user';

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null;
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);   // was missing previously
  localStorage.removeItem(USER_KEY);
  Cookies.remove(TOKEN_KEY);
};

export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => !!getToken();

export const parseJwt = (token: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
