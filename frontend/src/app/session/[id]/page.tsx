'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSessionStore } from '@/store/sessionStore';
import { sessionApi } from '@/lib/api';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { VideoPanel } from '@/components/video/VideoPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Session } from '@/types/session';
import { ArrowLeft, Link2, Zap, Clock, Users, MessageSquare, Video } from 'lucide-react';
import { copyToClipboard, generateSessionLink, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type Sidebar = 'chat' | 'video' | null;

export default function SessionPage() {
  const params   = useParams();
  const router   = useRouter();
  const sessionId = params.id as string;

  const { user }                              = useAuth();
  const { setActiveSession, setWsConnected }  = useSessionStore();
  const { subscribe }                         = useWebSocket();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState<Sidebar>('chat');
  const [elapsed, setElapsed] = useState('00:00');

  // ── Load session data ────────────────────────────────────────────
  useEffect(() => {
    if (!user) { router.push('/login'); return; }

    sessionApi
      .getById(sessionId)
      .then((res) => {
        setSession(res.data);
        setActiveSession(res.data);
      })
      .catch(() => {
        toast.error('Session not found');
        router.push('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [sessionId, user, router, setActiveSession]);

  // ── Real-time status updates (join / start / end) ────────────────
  useEffect(() => {
    // subscribe() queues the callback if WS is not yet connected — no setTimeout needed
    return subscribe(`/topic/session/${sessionId}/status`, (data: unknown) => {
      const updated = data as Session;
      setSession(updated);
      setActiveSession(updated);
      if (updated.status === 'ENDED') {
        toast('Session ended by mentor', { icon: '🔔' });
      }
    });
  }, [sessionId, subscribe, setActiveSession]);

  // ── Elapsed timer ────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.startedAt) return;
    const start = new Date(session.startedAt).getTime();
    const tick = () => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const m    = String(Math.floor(diff / 60)).padStart(2, '0');
      const s    = String(diff % 60).padStart(2, '0');
      setElapsed(`${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session?.startedAt]);

  const handleCopyLink = async () => {
    await copyToClipboard(generateSessionLink(sessionId));
    toast.success('Link copied!');
  };

  const handleEnd = async () => {
    if (!confirm('End this session for everyone?')) return;
    try {
      await sessionApi.end(sessionId);
      toast.success('Session ended');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to end session');
    }
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading session…</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isMentor = user?.role === 'MENTOR';
  const isActive = session.status === 'ACTIVE';

  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-12 border-b border-surface-border bg-bg-card flex items-center px-4 gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          title="Back to dashboard"
        >
          <ArrowLeft size={14} />
        </button>

        <div className="h-4 w-px bg-surface-border" />

        {/* Session identity */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-5 h-5 rounded bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center flex-shrink-0">
            <Zap size={10} className="text-accent-blue" />
          </div>
          <span className="font-display font-semibold text-sm text-text-primary truncate">
            {session.title}
          </span>
          <Badge variant={session.status.toLowerCase() as 'active' | 'pending' | 'ended'}>
            {session.status}
          </Badge>
          <span className="text-xs font-mono bg-bg-secondary border border-surface-border px-2 py-0.5 rounded text-text-muted">
            {session.language}
          </span>
        </div>

        {/* Elapsed timer (only when active) */}
        {isActive && session.startedAt && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-text-secondary">
            <Clock size={12} />
            <span>{elapsed}</span>
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Users size={12} />
            <span>{session.studentName || '—'}</span>
          </div>

          {/* Sidebar toggle */}
          <div className="flex items-center gap-1 border border-surface-border rounded-md p-0.5">
            {([
              { key: 'chat',  icon: <MessageSquare size={13} /> },
              { key: 'video', icon: <Video size={13} /> },
            ] as const).map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => setSidebar(sidebar === key ? null : key)}
                className={cn(
                  'px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors',
                  sidebar === key
                    ? 'bg-surface-hover text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                )}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                {icon}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            icon={<Link2 size={12} />}
            title="Copy session link"
          />

          {isMentor && isActive && (
            <Button variant="danger" size="sm" onClick={handleEnd}>
              End session
            </Button>
          )}
        </div>
      </header>

      {/* ── Status banner (non-active states) ─────────────────────── */}
      {!isActive && (
        <div className={cn(
          'flex-shrink-0 px-4 py-2 text-xs text-center',
          session.status === 'PENDING'
            ? 'bg-yellow-500/10 text-yellow-400 border-b border-yellow-500/20'
            : 'bg-bg-secondary text-text-muted border-b border-surface-border'
        )}>
          {session.status === 'PENDING'
            ? isMentor
              ? '⚡ Session is pending. Start it from the dashboard to begin collaboration.'
              : '⏳ Waiting for mentor to start the session…'
            : `Session ended on ${session.endedAt ? formatDate(session.endedAt) : '—'}. View-only mode.`}
        </div>
      )}

      {/* ── Main workspace ────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={sidebar ? 60 : 100} minSize={40}>
            <div className="h-full p-3">
              <CodeEditor sessionId={sessionId} readOnly={!isActive} />
            </div>
          </Panel>

          {sidebar && (
            <>
              <PanelResizeHandle className="w-px bg-surface-border hover:bg-accent-blue/30 transition-colors cursor-col-resize" />
              <Panel defaultSize={40} minSize={28} maxSize={50}>
                <div className="h-full p-3">
                  {sidebar === 'chat'  && <ChatPanel  sessionId={sessionId} />}
                  {sidebar === 'video' && <VideoPanel sessionId={sessionId} session={session} />}
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}
