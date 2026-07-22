'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSessionStore } from '@/store/sessionStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LogOut, Zap, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { wsConnected } = useSessionStore();

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-surface-border glass">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center group-hover:bg-accent-blue/30 transition-colors">
            <Zap size={14} className="text-accent-blue" />
          </div>
          <span className="font-display font-bold text-text-primary text-sm tracking-wide">
            Mentor<span className="text-accent-blue">Mate</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              pathname === '/dashboard'
                ? 'text-text-primary bg-surface-hover'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* WS status */}
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400' : 'bg-text-muted'}`} />
            <span className="text-xs text-text-muted hidden sm:block">
              {wsConnected ? 'Live' : 'Offline'}
            </span>
          </div>

          <Badge variant={user.role === 'MENTOR' ? 'mentor' : 'student'}>
            {user.role}
          </Badge>

          <span className="text-sm text-text-secondary hidden sm:block">{user.name}</span>

          <Button variant="ghost" size="sm" onClick={logout} icon={<LogOut size={14} />}>
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
