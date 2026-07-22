'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSessionStore } from '@/store/sessionStore';
import { messageApi } from '@/lib/api';
import { Message } from '@/types/message';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Send, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  sessionId: string;
}

export function ChatPanel({ sessionId }: ChatPanelProps) {
  const { user, messages, addMessage, setMessages } = useSessionStore();
  const { subscribe, send } = useWebSocket();
  const [text, setText]     = useState('');
  const [isCode, setIsCode] = useState(false);
  const bottomRef           = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLTextAreaElement>(null);

  // Load history
  useEffect(() => {
    messageApi
      .getBySession(sessionId)
      .then((res) => setMessages(res.data))
      .catch(() => toast.error('Failed to load chat history'));
  }, [sessionId, setMessages]);

  // Subscribe to incoming messages
  useEffect(() => {
    return subscribe(`/topic/session/${sessionId}/chat`, (data: unknown) => {
      addMessage(data as Message);
    });
  }, [sessionId, subscribe, addMessage]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;

    // Optimistically clear input immediately for responsive feel
    setText('');

    // Fire-and-forget via WebSocket; server persists and broadcasts
    send('/app/chat', {
      sessionId,
      message: trimmed,
      type: isCode ? 'CODE' : 'TEXT',
    });

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary rounded-lg overflow-hidden border border-surface-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-border bg-bg-card">
        <h3 className="text-sm font-semibold font-display text-text-primary">Chat</h3>
        <p className="text-xs text-text-muted">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-text-muted">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isOwn={msg.senderId === user?.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-surface-border bg-bg-card space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCode((v) => !v)}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              isCode
                ? 'text-accent-blue bg-accent-blue/10'
                : 'text-text-muted hover:text-text-secondary'
            )}
            title="Toggle code snippet mode"
          >
            <Code2 size={14} />
          </button>
          <span className="text-xs text-text-muted">{isCode ? 'Code mode' : 'Text mode'}</span>
        </div>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isCode ? 'Paste code snippet…' : 'Type a message… (Enter to send)'}
            rows={isCode ? 3 : 1}
            className={cn(
              'flex-1 bg-bg-primary border border-surface-border rounded-lg px-3 py-2 text-sm',
              'text-text-primary placeholder-text-muted resize-none',
              'focus:outline-none focus:border-accent-blue/50 transition-colors',
              isCode && 'font-mono text-xs'
            )}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!text.trim()}
            icon={<Send size={12} />}
          />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  if (msg.type === 'SYSTEM') {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-text-muted bg-surface-hover px-3 py-1 rounded-full">
          {msg.message}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', isOwn ? 'items-end' : 'items-start')}>
      <span className="text-xs text-text-muted">{msg.senderName}</span>
      {msg.type === 'CODE' ? (
        <pre className={cn(
          'max-w-[85%] text-xs font-mono bg-bg-primary border rounded-lg p-3 overflow-x-auto whitespace-pre-wrap',
          isOwn ? 'border-accent-blue/20' : 'border-surface-border'
        )}>
          {msg.message}
        </pre>
      ) : (
        <div className={cn(
          'max-w-[85%] px-3 py-2 rounded-xl text-sm break-words',
          isOwn
            ? 'bg-accent-blue/20 text-text-primary border border-accent-blue/20'
            : 'bg-bg-elevated text-text-primary border border-surface-border'
        )}>
          {msg.message}
        </div>
      )}
      <span className="text-xs text-text-muted">{formatTime(msg.timestamp)}</span>
    </div>
  );
}
