'use client';
import React from 'react';
import { useVideoCall } from '@/hooks/useVideoCall';
import { Button } from '@/components/ui/Button';
import {
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Phone
} from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { Session } from '@/types/session';
import { cn } from '@/lib/utils';

interface VideoPanelProps {
  sessionId: string;
  session: Session;
}

export function VideoPanel({ sessionId, session }: VideoPanelProps) {
  const { user, isCallActive } = useSessionStore();
  const {
    localVideoRef, remoteVideoRef, connectionState,
    isAudioEnabled, isVideoEnabled, isScreenSharing,
    startCall, startLocalPreview,
    handleToggleAudio, handleToggleVideo, handleScreenShare, endCall,
  } = useVideoCall(sessionId);

  const targetId = user?.role === 'MENTOR' ? session.studentId : session.mentorId;

  const handleStartCall = async () => {
    if (targetId) await startCall(targetId);
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary rounded-lg overflow-hidden border border-surface-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-border bg-bg-card flex items-center justify-between">
        <h3 className="text-sm font-semibold font-display text-text-primary">Video Call</h3>
        {isCallActive && (
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            connectionState === 'connected'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-yellow-500/20 text-yellow-400'
          )}>
            {connectionState}
          </span>
        )}
      </div>

      {/* Video feeds */}
      <div className="flex-1 relative bg-bg-primary p-3 space-y-2">
        {/* Remote video — main */}
        <div className="relative w-full h-48 bg-bg-card rounded-lg overflow-hidden border border-surface-border">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!isCallActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-bg-elevated border border-surface-border flex items-center justify-center mx-auto mb-2">
                  <VideoOff size={20} className="text-text-muted" />
                </div>
                <p className="text-xs text-text-muted">
                  {targetId ? 'Ready to call' : 'Waiting for participant'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Local video — PiP */}
        <div className="relative w-28 h-20 bg-bg-card rounded-lg overflow-hidden border border-surface-border">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-1 left-1 text-xs text-text-muted bg-bg-primary/80 px-1 rounded">
            You
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 border-t border-surface-border bg-bg-card">
        {!isCallActive ? (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={startLocalPreview}
              icon={<Video size={14} />}
            >
              Preview camera
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleStartCall}
              disabled={!targetId || session.status !== 'ACTIVE'}
              icon={<Phone size={14} />}
            >
              Start Call
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleToggleAudio}
              className={cn(
                'p-2.5 rounded-full transition-all',
                isAudioEnabled
                  ? 'bg-bg-elevated hover:bg-surface-hover text-text-primary'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              )}
              title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
            <button
              onClick={handleToggleVideo}
              className={cn(
                'p-2.5 rounded-full transition-all',
                isVideoEnabled
                  ? 'bg-bg-elevated hover:bg-surface-hover text-text-primary'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              )}
              title={isVideoEnabled ? 'Stop video' : 'Start video'}
            >
              {isVideoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
            </button>
            <button
              onClick={handleScreenShare}
              className={cn(
                'p-2.5 rounded-full transition-all',
                isScreenSharing
                  ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                  : 'bg-bg-elevated hover:bg-surface-hover text-text-primary'
              )}
              title="Screen share"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={endCall}
              className="p-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
              title="End call"
            >
              <PhoneOff size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
