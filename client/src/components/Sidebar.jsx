import React, { useState } from 'react';

const styles = {
  sidebar: {
    width: '260px', minWidth: '260px', background: 'var(--bg2)',
    borderRight: '1px solid var(--border)', display: 'flex',
    flexDirection: 'column', height: '100%', overflow: 'hidden',
  },
  header: {
    padding: '20px 16px 12px', borderBottom: '1px solid var(--border)',
  },
  logo: {
    fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800,
    color: 'var(--accent2)', letterSpacing: '-0.5px', marginBottom: '12px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  newBtn: {
    width: '100%', padding: '9px 14px', background: 'var(--accent)',
    color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px',
    display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  sessionList: { flex: 1, overflowY: 'auto', padding: '8px' },
  sectionLabel: {
    fontSize: '10px', fontWeight: 600, color: 'var(--text3)',
    textTransform: 'uppercase', letterSpacing: '1px',
    padding: '8px 8px 4px',
  },
  sessionItem: (active) => ({
    padding: '9px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
    background: active ? 'var(--bg4)' : 'transparent',
    border: active ? '1px solid var(--border2)' : '1px solid transparent',
    marginBottom: '2px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: '8px',
    transition: 'all 0.15s', animation: 'slideIn 0.2s ease',
  }),
  sessionTitle: {
    fontSize: '13px', color: 'var(--text)', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
  },
  deleteBtn: {
    background: 'none', border: 'none', color: 'var(--text3)',
    fontSize: '14px', padding: '2px 4px', borderRadius: '4px',
    opacity: 0, transition: 'opacity 0.15s',
  },
  footer: {
    padding: '12px 16px', borderTop: '1px solid var(--border)',
  },
  clearBtn: {
    width: '100%', padding: '8px', background: 'none',
    border: '1px solid var(--border)', color: 'var(--text3)',
    borderRadius: 'var(--radius-sm)', fontSize: '12px', transition: 'all 0.2s',
  },
  modelBadge: {
    fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)',
    background: 'var(--bg3)', padding: '2px 6px', borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
};

export default function Sidebar({ sessions, activeId, setActiveId, createSession, deleteSession, clearAll }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span>⚡</span> chola's AI
        </div>
        <button style={styles.newBtn} onClick={() => createSession()} onMouseOver={e => e.target.style.opacity = '0.85'} onMouseOut={e => e.target.style.opacity = '1'}>
          + New Chat
        </button>
      </div>

      <div style={styles.sessionList}>
        {sessions.length === 0 && (
          <div style={{ padding: '24px 12px', color: 'var(--text3)', fontSize: '12px', textAlign: 'center' }}>
            No chats yet. Start a new conversation!
          </div>
        )}
        {sessions.length > 0 && <div style={styles.sectionLabel}>Recent Chats</div>}
        {sessions.map(session => (
          <div
            key={session.id}
            style={styles.sessionItem(session.id === activeId)}
            onClick={() => setActiveId(session.id)}
            onMouseEnter={e => {
              setHoveredId(session.id);
              e.currentTarget.querySelector('.del-btn').style.opacity = '1';
            }}
            onMouseLeave={e => {
              setHoveredId(null);
              e.currentTarget.querySelector('.del-btn').style.opacity = '0';
            }}
          >
            <span style={{ fontSize: '12px' }}>💬</span>
            <span style={styles.sessionTitle}>{session.title || 'New Chat'}</span>
            <span style={styles.modelBadge}>{session.model?.split(':')[0]?.slice(0, 6)}</span>
            <button
              className="del-btn"
              style={styles.deleteBtn}
              onClick={e => { e.stopPropagation(); deleteSession(session.id); }}
            >✕</button>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        {sessions.length > 0 && (
          <button style={styles.clearBtn} onClick={clearAll}
            onMouseOver={e => { e.target.style.borderColor = 'var(--error)'; e.target.style.color = 'var(--error)'; }}
            onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text3)'; }}
          >
            Clear all history
          </button>
        )}
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text3)', textAlign: 'center' }}>
          Powered by SRM Ollama Server
        </div>
      </div>
    </div>
  );
}
