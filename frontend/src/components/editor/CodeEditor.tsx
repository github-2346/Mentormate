'use client';
import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as MonacoType from 'monaco-editor';
import { useEditorSync } from '@/hooks/useEditorSync';
import { useSessionStore } from '@/store/sessionStore';
import { Button } from '@/components/ui/Button';
import { Play, Copy, ChevronDown } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
];

interface CodeEditorProps {
  sessionId: string;
  readOnly?: boolean;
}

export function CodeEditor({ sessionId, readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null);
  const { currentCode, handleCodeChange } = useEditorSync(sessionId);
  const { currentLanguage, setLanguage } = useSessionStore();

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleCopy = async () => {
    await copyToClipboard(currentCode);
    toast.success('Code copied!');
  };

  return (
    <div className="flex flex-col h-full bg-bg-secondary rounded-lg overflow-hidden border border-surface-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-surface-border bg-bg-card">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-bg-secondary border border-surface-border rounded px-3 py-1 text-xs text-text-secondary pr-7 focus:outline-none focus:border-accent-blue/50 cursor-pointer"
              disabled={readOnly}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
          {!readOnly && (
            <span className="text-xs text-text-muted">Live sync</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} icon={<Copy size={12} />}>
            Copy
          </Button>
          <Button variant="primary" size="sm" icon={<Play size={12} />}>
            Run
          </Button>
        </div>
      </div>

      {/* Monaco */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={currentLanguage}
          value={currentCode}
          onChange={(val) => handleCodeChange(val || '')}
          onMount={handleMount}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
