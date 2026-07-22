'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/store/sessionStore';
import { authApi } from '@/lib/api';
import { setToken, setUser, removeToken, getToken, getUser } from '@/lib/auth';
import wsService from '@/lib/websocket';
import { AuthRequest, SignupRequest } from '@/types/user';
import toast from 'react-hot-toast';

export function useAuth() {
  const router = useRouter();
  const { user, setAuth, clearAuth, setWsConnected } = useSessionStore();
  const [loading, setLoading] = useState(false);

  // Restore auth state from storage on mount (e.g. page refresh)
  useEffect(() => {
    const token      = getToken();
    const storedUser = getUser();
    if (token && storedUser && !user) {
      setAuth(storedUser, token);
    }
  }, [setAuth, user]);

  const login = async (data: AuthRequest) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { token, user: u } = res.data;
      setToken(token);
      setUser(u);
      setAuth(u, token);
      // Kick off WS connection now that we have a token
      wsService.connect(
        () => setWsConnected(true),
        () => setWsConnected(false)
      );
      toast.success(`Welcome back, ${u.name}!`);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed. Check your email and password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupRequest) => {
    setLoading(true);
    try {
      const res = await authApi.signup(data);
      const { token, user: u } = res.data;
      setToken(token);
      setUser(u);
      setAuth(u, token);
      wsService.connect(
        () => setWsConnected(true),
        () => setWsConnected(false)
      );
      toast.success('Account created! Welcome to MentorMate.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Signup failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    wsService.disconnect();
    setWsConnected(false);
    removeToken();
    clearAuth();
    router.push('/login');
    toast.success('Signed out');
  };

  return { user, loading, login, signup, logout };
}
