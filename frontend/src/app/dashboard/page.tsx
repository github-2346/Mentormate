'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSessionStore } from '@/store/sessionStore';
import { sessionApi } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SessionCard } from '@/components/session/SessionCard';
import { CreateSessionModal } from '@/components/session/CreateSessionModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, RefreshCw, Link2, LayoutGrid, List, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { sessions, setSessions, setActiveSession } = useSessionStore();
  const { subscribe } = useWebSocket();
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinLink, setJoinLink] = useState('');
  const [joining, setJoining] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const fetchSessions = useCallback(async () => {
    try {
      const res = await sessionApi.getMine();
      setSessions(res.data);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [setSessions]);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchSessions();
  }, [user, router, fetchSessions]);

  // Real-time: refresh when a session changes for this user
  useEffect(() => {
    if (!user) return;
    const unsub = subscribe(`/topic/user/${user.id}/sessions`, () => {
      fetchSessions();
    });
    return unsub;
  }, [user, subscribe, fetchSessions]);

  const handleStart = async (id: string) => {
    try {
      const res = await sessionApi.start(id);
      setSessions(sessions.map((s) => (s.id === id ? res.data : s)));
      toast.success('Session started!');
    } catch {
      toast.error('Failed to start session');
    }
  };

  const handleEnd = async (id: string) => {
    try {
      const res = await sessionApi.end(id);
      setSessions(sessions.map((s) => (s.id === id ? res.data : s)));
      toast.success('Session ended');
    } catch {
      toast.error('Failed to end session');
    }
  };

  const handleJoin = async () => {
    const id = joinLink.split('/session/').pop()?.trim();
    if (!id) { toast.error('Invalid session link'); return; }
    setJoining(true);
    try {
      const res = await sessionApi.join(id);
      setActiveSession(res.data);
      toast.success('Joined session!');
      router.push(`/session/${id}`);
    } catch {
      toast.error('Failed to join session — the link may be invalid or the session is full.');
    } finally {
      setJoining(false);
    }
  };

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.language.toLowerCase().includes(search.toLowerCase())
  );

  const active  = filtered.filter((s) => s.status === 'ACTIVE');
  const pending = filtered.filter((s) => s.status === 'PENDING');
  const ended   = filtered.filter((s) => s.status === 'ENDED');

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />

      <main className="flex-1 pt-14">
        {/* Header */}
        <div className="border-b border-surface-border bg-bg-secondary/50">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display font-bold text-3xl text-text-primary">Dashboard</h1>
                <p className="text-text-secondary text-sm mt-1">
                  {user.role === 'MENTOR'
                    ? 'Create and manage your mentoring sessions'
                    : 'Join sessions and learn from your mentors'}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant={user.role === 'MENTOR' ? 'mentor' : 'student'}>
                  {user.role}
                </Badge>
                {user.role === 'MENTOR' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setCreateOpen(true)}
                    icon={<Plus size={14} />}
                  >
                    New session
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchSessions}
                  icon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Active',    value: sessions.filter((s) => s.status === 'ACTIVE').length,  color: 'text-emerald-400' },
                { label: 'Pending',   value: sessions.filter((s) => s.status === 'PENDING').length,  color: 'text-yellow-400' },
                { label: 'Completed', value: sessions.filter((s) => s.status === 'ENDED').length,    color: 'text-text-muted' },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-lg p-4 border border-surface-border">
                  <p className="text-xs text-text-muted mb-1">{stat.label}</p>
                  <p className={`font-display font-bold text-2xl ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Student: join by link */}
          {user.role === 'STUDENT' && (
            <div className="glass rounded-xl p-5 border border-surface-border">
              <h2 className="text-sm font-semibold font-display text-text-primary mb-3 flex items-center gap-2">
                <Link2 size={14} className="text-accent-blue" />
                Join via link
              </h2>
              <div className="flex gap-3">
                <Input
                  value={joinLink}
                  onChange={(e) => setJoinLink(e.target.value)}
                  placeholder="Paste session link here..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleJoin}
                  loading={joining}
                  disabled={!joinLink.trim()}
                >
                  Join
                </Button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 max-w-sm">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sessions..."
                icon={<Search size={14} />}
              />
            </div>
            <div className="flex items-center gap-1 border border-surface-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-surface-hover text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-surface-hover text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Session grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-xl h-40 border border-surface-border animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-surface-border flex items-center justify-center mx-auto mb-4">
                <LayoutGrid size={24} className="text-text-muted" />
              </div>
              <p className="text-text-secondary font-display font-semibold">No sessions found</p>
              <p className="text-text-muted text-sm mt-1">
                {user.role === 'MENTOR'
                  ? 'Create your first session to get started.'
                  : 'Ask your mentor for a session link.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {active.length  > 0 && <SessionSection title="Active"    sessions={active}  viewMode={viewMode} onStart={handleStart} onEnd={handleEnd} />}
              {pending.length > 0 && <SessionSection title="Pending"   sessions={pending} viewMode={viewMode} onStart={handleStart} onEnd={handleEnd} />}
              {ended.length   > 0 && <SessionSection title="Completed" sessions={ended}   viewMode={viewMode} onStart={handleStart} onEnd={handleEnd} />}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <CreateSessionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchSessions}
      />
    </div>
  );
}

function SessionSection({
  title, sessions, viewMode, onStart, onEnd,
}: {
  title: string;
  sessions: import('@/types/session').Session[];
  viewMode: 'grid' | 'list';
  onStart: (id: string) => void;
  onEnd: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">{title}</h2>
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-3'
      }>
        {sessions.map((s) => (
          <SessionCard key={s.id} session={s} onStart={onStart} onEnd={onEnd} />
        ))}
      </div>
    </div>
  );
}
