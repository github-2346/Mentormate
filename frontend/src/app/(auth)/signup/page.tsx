'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/types/user';
import { Zap, Mail, Lock, User, GraduationCap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const { signup, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await signup({ name, email, password, role });
  };

  return (
    <div className="min-h-screen bg-bg-primary bg-grid flex items-center justify-center px-4 py-10">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-accent-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center group-hover:bg-accent-blue/30 transition-colors">
              <Zap size={16} className="text-accent-blue" />
            </div>
            <span className="font-display font-bold text-text-primary">
              Mentor<span className="text-accent-blue">Mate</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-text-primary">Create account</h1>
          <p className="text-text-secondary text-sm mt-1">Join the platform today</p>
        </div>

        <div className="glass rounded-2xl p-7 border border-surface-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'STUDENT', label: 'Student', icon: <GraduationCap size={16} /> },
                  { value: 'MENTOR', label: 'Mentor', icon: <BookOpen size={16} /> },
                ] as const).map(({ value, label, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200',
                      role === value
                        ? value === 'MENTOR'
                          ? 'border-accent-blue/60 bg-accent-blue/10 text-accent-blue'
                          : 'border-accent-orange/60 bg-accent-orange/10 text-accent-orange'
                        : 'border-surface-border text-text-muted hover:border-surface-hover hover:text-text-secondary'
                    )}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              icon={<User size={14} />}
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail size={14} />}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              icon={<Lock size={14} />}
              error={errors.password}
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-secondary mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-blue hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
