import React, { useState, useEffect, useRef } from 'react';
import { useChat } from './hooks/useChat';
import Sidebar from './components/Sidebar';
import Message from './components/Message';
import ChatInput from './components/ChatInput';

export default function App() {
  const {
    sessions, activeSession, activeId, setActiveId,
    createSession, deleteSession, clearAll,
    sendMessage, loading, error,
  } = useChat();

  // const [model, setModel] = useState('llama3.1:latest');
  const [model, setModel] = useState('gpt-oss:latest');
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant for a MERN stack developer. Be concise, practical, and always provide code examples when relevant.');
  const [models, setModels] = useState([]);
  const bottomRef = useRef(null);

  // Fetch available models from SRM server
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/models`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(r => r.json())
      .then(d => { if (d.models) setModels(d.models); })
      .catch(() => {});
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, loading]);

  const handleSend = (content) => {
    sendMessage(content, model, systemPrompt);
  };

  const messages = activeSession?.messages || [];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        setActiveId={setActiveId}
        createSession={() => createSession(model, systemPrompt)}
        deleteSession={deleteSession}
        clearAll={clearAll}
      />

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          padding: '14px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px' }}>
            {activeSession?.title || 'SRM AI Assistant'}
          </div>
          {activeSession && (
            <span style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)',
              color: 'var(--accent3)', background: 'rgba(74,222,128,0.1)',
              padding: '2px 8px', borderRadius: '20px',
              border: '1px solid rgba(74,222,128,0.2)',
            }}>
              ● {activeSession.model}
            </span>
          )}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>
            {messages.length > 0 ? `${messages.length} messages` : 'No messages yet'}
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', gap: '16px' }}>
              <div style={{ fontSize: '48px' }}>⚡</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text2)' }}>
                SRM AI Assistant
              </div>
              <div style={{ fontSize: '13px', textAlign: 'center', maxWidth: '360px', lineHeight: 1.8 }}>
                Powered by <span style={{ color: 'var(--accent2)' }}>dld.srmist.edu.in/ollama</span><br />
                Running locally on SRM's server — free, private, no internet needed.
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
                {['Explain this code', 'Write a React hook', 'Debug my Express route', 'MongoDB aggregation query'].map(s => (
                  <button key={s} onClick={() => handleSend(s)} style={{
                    background: 'var(--bg3)', border: '1px solid var(--border2)',
                    color: 'var(--text2)', borderRadius: '20px',
                    padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                    onMouseOver={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent2)'; }}
                    onMouseOut={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text2)'; }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <Message key={msg.id} message={msg} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeUp 0.2s ease' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'var(--accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '14px',
              }}>🤖</div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: 'var(--accent)', animation: `pulse 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', background: 'rgba(248,113,113,0.1)',
              border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)',
              color: 'var(--error)', fontSize: '13px',
            }}>
              ❌ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <ChatInput
          onSend={handleSend}
          loading={loading}
          model={model}
          setModel={setModel}
          models={models}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
        />
      </div>
    </div>
  );
}
