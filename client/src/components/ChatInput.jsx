import React, { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, loading, model, setModel, models, systemPrompt, setSystemPrompt }) {
  const [input, setInput] = useState('');
  const [showSystem, setShowSystem] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '12px 20px 16px',
    }}>
      {/* System Prompt Panel */}
      {showSystem && (
        <div style={{ marginBottom: '10px', animation: 'fadeUp 0.2s ease' }}>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
            SYSTEM PROMPT
          </div>
          <textarea
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            placeholder="You are a helpful MERN stack developer assistant..."
            rows={3}
            style={{
              width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', padding: '8px 12px',
              fontSize: '13px', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-mono)',
            }}
          />
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
        {/* Model selector */}
        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          style={{
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            color: 'var(--text)', borderRadius: 'var(--radius-sm)',
            padding: '5px 10px', fontSize: '12px', fontFamily: 'var(--font-mono)',
            outline: 'none', cursor: 'pointer',
          }}
        >
          {models.length === 0 && <option value="llama3.1:latest">llama3.1:latest</option>}
          {models.map(m => (
            <option key={m.name} value={m.name}>{m.name}</option>
          ))}
        </select>

        {/* System prompt toggle */}
        <button
          onClick={() => setShowSystem(s => !s)}
          style={{
            background: showSystem ? 'var(--bg4)' : 'var(--bg3)',
            border: `1px solid ${showSystem ? 'var(--accent)' : 'var(--border2)'}`,
            color: showSystem ? 'var(--accent2)' : 'var(--text3)',
            borderRadius: 'var(--radius-sm)', padding: '5px 10px',
            fontSize: '12px', transition: 'all 0.2s',
          }}
        >
          ⚙ System Prompt
        </button>

        <div style={{ flex: 1 }} />
        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
          Shift+Enter for new line
        </div>
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything... (code, explain, debug, refactor)"
          rows={1}
          style={{
            flex: 1, background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 'var(--radius)', color: 'var(--text)',
            padding: '12px 16px', fontSize: '14px', resize: 'none',
            outline: 'none', lineHeight: 1.6, transition: 'border-color 0.2s',
            fontFamily: 'var(--font-body)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          disabled={loading}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            padding: '12px 20px', background: loading ? 'var(--bg4)' : 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
            opacity: (!input.trim() || loading) ? 0.5 : 1,
            transition: 'all 0.2s', whiteSpace: 'nowrap',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Thinking
            </>
          ) : 'Send ↑'}
        </button>
      </div>
    </div>
  );
}
