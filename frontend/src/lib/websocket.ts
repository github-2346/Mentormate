import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from './auth';

type MessageCallback = (message: IMessage) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private pendingSubscriptions: Array<{ topic: string; callback: MessageCallback }> = [];
  private connected = false;
  private connecting = false;

  connect(onConnect?: () => void, onDisconnect?: () => void): void {
    if (this.connected || this.connecting) return;  // singleton guard

    const token = getToken();
    if (!token) return;

    this.connecting = true;

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: () => {},
      reconnectDelay: 3000,
      onConnect: () => {
        this.connected = true;
        this.connecting = false;
        // Flush subscriptions queued before connection was ready
        this.pendingSubscriptions.forEach(({ topic, callback }) => {
          this._doSubscribe(topic, callback);
        });
        this.pendingSubscriptions = [];
        onConnect?.();
      },
      onDisconnect: () => {
        this.connected = false;
        this.connecting = false;
        onDisconnect?.();
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame);
        this.connecting = false;
      },
    });

    this.client.activate();
  }

  private _doSubscribe(topic: string, callback: MessageCallback): void {
    if (!this.client || this.subscriptions.has(topic)) return;
    const sub = this.client.subscribe(topic, callback);
    this.subscriptions.set(topic, sub);
  }

  subscribe(topic: string, callback: MessageCallback): () => void {
    if (this.connected) {
      this._doSubscribe(topic, callback);
    } else {
      // Remove any existing pending sub for the same topic before adding
      this.pendingSubscriptions = this.pendingSubscriptions.filter((p) => p.topic !== topic);
      this.pendingSubscriptions.push({ topic, callback });
    }
    return () => this.unsubscribe(topic);
  }

  unsubscribe(topic: string): void {
    const sub = this.subscriptions.get(topic);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(topic);
    }
    this.pendingSubscriptions = this.pendingSubscriptions.filter((p) => p.topic !== topic);
  }

  send(destination: string, body: object): void {
    if (!this.client || !this.connected) {
      console.warn('[WS] Cannot send — not connected');
      return;
    }
    this.client.publish({ destination, body: JSON.stringify(body) });
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.pendingSubscriptions = [];
    this.client?.deactivate();
    this.client = null;
    this.connected = false;
    this.connecting = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Module-level singleton — survives page navigations within the SPA
export const wsService = new WebSocketService();
export default wsService;
