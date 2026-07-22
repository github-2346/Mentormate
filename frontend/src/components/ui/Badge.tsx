import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'active' | 'pending' | 'ended' | 'mentor' | 'student';
  children: React.ReactNode;
}

export function Badge({ variant = 'pending', children }: BadgeProps) {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ended: 'bg-text-muted/20 text-text-muted border-text-muted/30',
    mentor: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
    student: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border',
      styles[variant]
    )}>
      {variant === 'active' && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
      )}
      {children}
    </span>
  );
}
