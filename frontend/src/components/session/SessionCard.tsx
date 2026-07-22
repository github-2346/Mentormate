'use client';
import React from 'react';
import Link from 'next/link';
import { Session } from '@/types/session';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, copyToClipboard, generateSessionLink } from '@/lib/utils';
import { Link2, ArrowRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSessionStore } from '@/store/sessionStore';

interface SessionCardProps {
  session: Session;
  onStart?: (id: string) => void;
  onEnd?: (id: string) => void;
}

export function SessionCard({ session, onStart, onEnd }: SessionCardProps) {
  const { user } = useSessionStore();
  const isMentor = user?.id === session.mentorId;

  const handleCopyLink = async () => {
    await copyToClipboard(generateSessionLink(session.id));
    toast.success('Session link copied!');
  };

  return (
    <div className="glass rounded-xl p-5 border border-surface-border hover:border-accent-blue/30 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold font-display text-text-primary truncate group-hover:text-accent-blue transition-colors">
            {session.title}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {isMentor
              ? session.studentName ? `Student: ${session.studentName}` : 'Awaiting student'
              : `Mentor: ${session.mentorName}`}
          </p>
        </div>
        <Badge variant={session.status.toLowerCase() as 'active' | 'pending' | 'ended'}>
          {session.status}
        </Badge>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1 text-xs font-mono bg-bg-card border border-surface-border px-2 py-1 rounded">
          {session.language}
        </span>
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Clock size={10} />
          {formatDate(session.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {session.status === 'ACTIVE' && (
          <Link href={`/session/${session.id}`} className="flex-1">
            <Button variant="primary" size="sm" className="w-full" icon={<ArrowRight size={12} />}>
              Join Session
            </Button>
          </Link>
        )}
        {session.status === 'PENDING' && isMentor && onStart && (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => onStart(session.id)}
          >
            Start Session
          </Button>
        )}
        {session.status === 'ACTIVE' && isMentor && onEnd && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onEnd(session.id)}
          >
            End
          </Button>
        )}
        {session.status !== 'ENDED' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            icon={<Link2 size={12} />}
          />
        )}
      </div>
    </div>
  );
}
