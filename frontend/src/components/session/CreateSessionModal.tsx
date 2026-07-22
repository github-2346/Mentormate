'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { sessionApi } from '@/lib/api';
import { useSessionStore } from '@/store/sessionStore';
import toast from 'react-hot-toast';

interface CreateSessionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];

export function CreateSessionModal({ open, onClose, onCreated }: CreateSessionModalProps) {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const { setSessions, sessions } = useSessionStore();

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a session title');
      return;
    }
    setLoading(true);
    try {
      const res = await sessionApi.create({ title, language });
      setSessions([res.data, ...sessions]);
      toast.success('Session created!');
      onCreated();
      onClose();
      setTitle('');
    } catch {
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Session" size="sm">
      <div className="space-y-4">
        <Input
          label="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. React Hooks Deep Dive"
          autoFocus
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Language</label>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all font-mono ${
                  language === l
                    ? 'border-accent-blue/60 bg-accent-blue/10 text-accent-blue'
                    : 'border-surface-border text-text-muted hover:border-surface-hover hover:text-text-secondary'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleCreate} loading={loading} className="flex-1">
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
}
