import React, { useState } from 'react';

const baseStyles = {
  header: {
    padding: '20px 16px 12px', borderBottom: '1px solid var(--border)',
  },
  logo: {
    fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800,
    color: 'var(--accent2)', letterSpacing: '-0.5px', marginBottom: '12px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  newBtn: {
    width: '100%', padding: '10px 14px', background: 'var(--accent)',
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
    padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
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
    fontSize: '14px', padding: '4px 6px', borderRadius: '4px',
    opacity: 0, transition: 'opacity 0.15s', minWidth: '28px', minHeight: '28px',
  },
  footer: {
    padding: '12px 16px', borderTop: '1px solid var(--border)',
  },
  clearBtn: {
    width: '100%', padding: '9px', background: 'none',
    border: '1px solid var(--border)', color: 'var(--text3)',
    borderRadius: 'var(--radius-sm)', fontSize: '12px', transition: 'all 0.2s',
  },
  modelBadge: {
    fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--font-mono)',
    background: 'var(--bg3)', padding: '2px 6px', borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
};

export default function Sidebar({ sessions, activeId, setActiveId, createSession, deleteSession, clearAll, isMobile, isOpen, onClose }) {
  const [hoveredId, setHoveredId] = useState(null);

  const sidebarStyle = isMobile
    ? {
        position: 'fixed', top: 0, left: 0, height: '100%',
        width: '280px', background: 'var(--bg2)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
        zIndex: 100,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
      }
    : {
        width: '260px', minWidth: '260px', background: 'var(--bg2)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', height: '100%', overflow: 'hidden',
      };

  return (
    <div style={sidebarStyle}>
      <div style={baseStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ ...baseStyles.logo, marginBottom: 0 }}>
            <span>⚡</span> chola's AI
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', color: 'var(--text2)',
                fontSize: '20px', padding: '4px 8px', lineHeight: 1,
                minWidth: '36px', minHeight: '36px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          )}
        </div>
        <button
          style={baseStyles.newBtn}
          onClick={() => createSession()}
          onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          + New Chat
        </button>
      </div>

      <div style={baseStyles.sessionList}>
        {sessions.length === 0 && (
          <div style={{ padding: '24px 12px', color: 'var(--text3)', fontSize: '12px', textAlign: 'center' }}>
            No chats yet. Start a new conversation!
          </div>
        )}
        {sessions.length > 0 && <div style={baseStyles.sectionLabel}>Recent Chats</div>}
        {sessions.map(session => (
          <div
            key={session.id}
            style={baseStyles.sessionItem(session.id === activeId)}
            onClick={() => setActiveId(session.id)}
            onMouseEnter={e => {
              setHoveredId(session.id);
              const btn = e.currentTarget.querySelector('.del-btn');
              if (btn) btn.style.opacity = '1';
            }}
            onMouseLeave={e => {
              setHoveredId(null);
              const btn = e.currentTarget.querySelector('.del-btn');
              if (btn) btn.style.opacity = '0';
            }}
          >
            <span style={{ fontSize: '12px' }}>💬</span>
            <span style={baseStyles.sessionTitle}>{session.title || 'New Chat'}</span>
            <span style={baseStyles.modelBadge}>{session.model?.split(':')[0]?.slice(0, 6)}</span>
            <button
              className="del-btn"
              style={{ ...baseStyles.deleteBtn, opacity: isMobile ? 1 : 0 }}
              onClick={e => { e.stopPropagation(); deleteSession(session.id); }}
            >✕</button>
          </div>
        ))}
      </div>

      <div style={baseStyles.footer}>
        {sessions.length > 0 && (
          <button
            style={baseStyles.clearBtn}
            onClick={clearAll}
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

