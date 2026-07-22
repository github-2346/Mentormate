'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { WebRTCService } from '@/lib/webrtc';
import { useWebSocket } from './useWebSocket';
import { useSessionStore } from '@/store/sessionStore';
import { SignalMessage } from '@/types/message';

export function useVideoCall(sessionId: string) {
  const {
    user,
    isAudioEnabled, isVideoEnabled, isScreenSharing,
    setCallActive, toggleAudio, toggleVideo, toggleScreenShare,
  } = useSessionStore();

  const { subscribe }  = useWebSocket();
  const webrtcRef      = useRef<WebRTCService | null>(null);
  const localVideoRef  = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');

  // ── Initialise WebRTC service and subscribe to signalling ─────────
  useEffect(() => {
    if (!user) return;

    webrtcRef.current = new WebRTCService(
      sessionId,
      user.id,
      (stream) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
      },
      setConnectionState
    );

    const unsub = subscribe(
      `/topic/session/${sessionId}/signal`,
      async (data: unknown) => {
        const signal = data as SignalMessage;
        if (signal.to !== user.id) return;          // not for us
        const svc = webrtcRef.current;
        if (!svc) return;
        if (signal.type === 'offer') {
          await svc.handleOffer(signal.payload as RTCSessionDescriptionInit, signal.from);
        } else if (signal.type === 'answer') {
          await svc.handleAnswer(signal.payload as RTCSessionDescriptionInit);
        } else if (signal.type === 'ice-candidate') {
          await svc.handleIceCandidate(signal.payload as RTCIceCandidateInit);
        }
      }
    );

    return () => {
      unsub();
      webrtcRef.current?.cleanup();
      webrtcRef.current = null;
    };
  }, [sessionId, user, subscribe]); // setConnectionState is stable

  const startCall = useCallback(async (targetUserId: number) => {
    const svc = webrtcRef.current;
    if (!svc) return;
    const stream = await svc.startLocalStream(true, true);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    await svc.createOffer(targetUserId);
    setCallActive(true);
  }, [setCallActive]);

  const startLocalPreview = useCallback(async () => {
    const svc = webrtcRef.current;
    if (!svc) return;
    const stream = await svc.startLocalStream(true, true);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  }, []);

  const handleToggleAudio = useCallback(() => {
    webrtcRef.current?.toggleAudio(!isAudioEnabled);
    toggleAudio();
  }, [isAudioEnabled, toggleAudio]);

  const handleToggleVideo = useCallback(() => {
    webrtcRef.current?.toggleVideo(!isVideoEnabled);
    toggleVideo();
  }, [isVideoEnabled, toggleVideo]);

  const handleScreenShare = useCallback(async () => {
    if (!isScreenSharing) await webrtcRef.current?.startScreenShare();
    toggleScreenShare();
  }, [isScreenSharing, toggleScreenShare]);

  const endCall = useCallback(() => {
    webrtcRef.current?.cleanup();
    setCallActive(false);
  }, [setCallActive]);

  return {
    localVideoRef, remoteVideoRef, connectionState,
    isAudioEnabled, isVideoEnabled, isScreenSharing,
    startCall, startLocalPreview,
    handleToggleAudio, handleToggleVideo, handleScreenShare, endCall,
  };
}
