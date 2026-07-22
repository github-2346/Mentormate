'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { useSessionStore } from '@/store/sessionStore';
import { CodeUpdate } from '@/types/session';

// Throttle delay in ms — prevents flooding the WS broker
const THROTTLE_MS = 200;

export function useEditorSync(sessionId: string) {
  const { subscribe, send }    = useWebSocket();
  const { currentCode, currentLanguage, setCode, user } = useSessionStore();

  // Ref flags to prevent echo (remote update → local state → re-broadcast)
  const isRemoteUpdate  = useRef(false);
  const lastSentRef     = useRef(0);

  // ── Receive remote code updates ───────────────────────────────────
  useEffect(() => {
    return subscribe(`/topic/session/${sessionId}/code`, (data: unknown) => {
      const update = data as CodeUpdate;
      if (update.senderId !== user?.id) {
        isRemoteUpdate.current = true;
        setCode(update.code);
        // Reset flag after React has processed the state update
        setTimeout(() => { isRemoteUpdate.current = false; }, 50);
      }
    });
  }, [sessionId, subscribe, setCode, user?.id]);

  // ── Broadcast local changes (throttled, last-write-wins) ──────────
  const handleCodeChange = useCallback((code: string) => {
    if (isRemoteUpdate.current) return;

    setCode(code);

    const now = Date.now();
    if (now - lastSentRef.current >= THROTTLE_MS) {
      lastSentRef.current = now;
      send('/app/code', {
        sessionId,
        code,
        language: currentLanguage,
        senderId: user?.id,
      } as CodeUpdate);
    }
  }, [sessionId, currentLanguage, user?.id, setCode, send]);
  // NOTE: stable deps only — no throttle wrapper in deps array

  return { currentCode, handleCodeChange };
}
