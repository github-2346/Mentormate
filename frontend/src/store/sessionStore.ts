import { create } from 'zustand';
import { Session } from '@/types/session';
import { Message } from '@/types/message';
import { User } from '@/types/user';

interface SessionStore {
  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;

  // Sessions
  sessions: Session[];
  activeSession: Session | null;
  setSessions: (sessions: Session[]) => void;
  setActiveSession: (session: Session | null) => void;
  updateSession: (session: Session) => void;

  // Messages
  messages: Message[];
  addMessage: (msg: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;

  // Editor
  currentCode: string;
  currentLanguage: string;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;

  // Video call
  isCallActive: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  setCallActive: (active: boolean) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;

  // Connection
  wsConnected: boolean;
  setWsConnected: (connected: boolean) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  // Auth
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),

  // Sessions
  sessions: [],
  activeSession: null,
  setSessions: (sessions) => set({ sessions }),
  setActiveSession: (session) => set({ activeSession: session }),
  updateSession: (session) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === session.id ? session : s)),
      activeSession: state.activeSession?.id === session.id ? session : state.activeSession,
    })),

  // Messages
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),

  // Editor
  currentCode: '// Start coding here...\n',
  currentLanguage: 'javascript',
  setCode: (code) => set({ currentCode: code }),
  setLanguage: (lang) => set({ currentLanguage: lang }),

  // Video
  isCallActive: false,
  isAudioEnabled: true,
  isVideoEnabled: true,
  isScreenSharing: false,
  setCallActive: (active) => set({ isCallActive: active }),
  toggleAudio: () => set((s) => ({ isAudioEnabled: !s.isAudioEnabled })),
  toggleVideo: () => set((s) => ({ isVideoEnabled: !s.isVideoEnabled })),
  toggleScreenShare: () => set((s) => ({ isScreenSharing: !s.isScreenSharing })),

  // Connection
  wsConnected: false,
  setWsConnected: (connected) => set({ wsConnected: connected }),
}));
