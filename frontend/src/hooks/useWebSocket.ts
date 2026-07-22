'use client';
import { useEffect, useRef, useCallback } from 'react';
import { IMessage } from '@stomp/stompjs';
import wsService from '@/lib/websocket';
import { useSessionStore } from '@/store/sessionStore';
import { getToken } from '@/lib/auth';

/**
 * Initialises the WebSocket connection once per app session and exposes
 * stable `subscribe` / `send` helpers.
 *
 * Connection is established only when a valid JWT token is present.
 * The wsService singleton prevents duplicate connections across navigations.
 */
export function useWebSocket() {
  const { setWsConnected } = useSessionStore();
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;

    // Only connect if the user is logged in
    if (!getToken()) return;

    initialised.current = true;

    wsService.connect(
      () => setWsConnected(true),
      () => setWsConnected(false)
    );

    // Do NOT disconnect on unmount — the singleton must survive page navigations.
    // Disconnection happens on explicit logout (auth.ts removeToken + page reload).
  }, [setWsConnected]);

  /**
   * Subscribe to a STOMP topic.
   * Returns an unsubscribe function suitable for useEffect cleanup.
   * Automatically parses JSON payloads; falls back to raw string.
   */
  const subscribe = useCallback(
    (topic: string, cb: (msg: unknown) => void): (() => void) => {
      return wsService.subscribe(topic, (frame: IMessage) => {
        try {
          cb(JSON.parse(frame.body));
        } catch {
          cb(frame.body);
        }
      });
    },
    []
  );

  /** Publish a message to a STOMP destination. No-op if not connected. */
  const send = useCallback((destination: string, payload: object): void => {
    wsService.send(destination, payload);
  }, []);

  return { subscribe, send };
}
