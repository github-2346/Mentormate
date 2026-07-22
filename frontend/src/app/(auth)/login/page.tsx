'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Zap, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await login({ email, password });
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-grid flex items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center group-hover:bg-accent-blue/30 transition-colors">
              <Zap size={16} className="text-accent-blue" />
            </div>
            <span className="font-display font-bold text-text-primary">
              Mentor<span className="text-accent-blue">Mate</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-text-primary">Welcome back</h1>
          <p className="text-text-secondary text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-7 border border-surface-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail size={14} />}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={14} />}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-5">
          No account?{' '}
          <Link href="/signup" className="text-accent-blue hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
