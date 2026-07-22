'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'relative inline-flex items-center justify-center gap-2 font-medium font-body rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary';

  const variants = {
    primary: 'bg-accent-blue text-bg-primary hover:brightness-110 focus:ring-accent-blue/50 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]',
    secondary: 'bg-accent-orange text-white hover:brightness-110 focus:ring-accent-orange/50 shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/50',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover focus:ring-accent-blue/30',
    outline: 'border border-surface-border text-text-primary hover:border-accent-blue/50 hover:bg-surface-hover focus:ring-accent-blue/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}
