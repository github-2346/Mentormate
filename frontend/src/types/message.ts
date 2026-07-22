export type MessageType = 'TEXT' | 'CODE' | 'SYSTEM';

export interface Message {
  id: number;
  sessionId: string;
  senderId: number;
  senderName: string;
  message: string;
  type: MessageType;
  timestamp: string;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
  type: MessageType;
}

// WebRTC signaling types
export interface SignalMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  from: number;
  to: number;
  sessionId: string;
  payload: RTCSessionDescriptionInit | RTCIceCandidateInit;
}
