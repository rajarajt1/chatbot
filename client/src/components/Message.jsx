import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      position: 'absolute', top: '8px', right: '8px',
      background: copied ? 'var(--accent3)' : 'var(--bg4)',
      color: copied ? '#000' : 'var(--text2)',
      border: '1px solid var(--border2)', borderRadius: '5px',
      padding: '3px 8px', fontSize: '11px', fontFamily: 'var(--font-mono)',
      cursor: 'pointer', transition: 'all 0.2s',
    }}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const code = String(children).replace(/\n$/, '');
    if (!inline && match) {
      return (
        <div style={{ position: 'relative', margin: '12px 0', overflowX: 'auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#1e1e2e', padding: '6px 12px',
            borderRadius: '8px 8px 0 0', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
              {match[1]}
            </span>
            <CopyBtn text={code} />
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0, borderRadius: '0 0 8px 8px',
              fontSize: '13px', lineHeight: '1.6',
            }}
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code style={{
        background: 'var(--bg4)', padding: '2px 6px',
        borderRadius: '4px', fontFamily: 'var(--font-mono)',
        fontSize: '12px', color: 'var(--accent2)',
      }} {...props}>
        {children}
      </code>
    );
  },
  p: ({ children }) => <p style={{ marginBottom: '8px', lineHeight: 1.7 }}>{children}</p>,
  ul: ({ children }) => <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ marginLeft: '20px', marginBottom: '8px' }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
  h1: ({ children }) => <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px', color: 'var(--accent2)' }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '6px', color: 'var(--accent2)' }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', marginBottom: '6px', color: 'var(--text)' }}>{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: '3px solid var(--accent)', paddingLeft: '12px',
      margin: '8px 0', color: 'var(--text2)', fontStyle: 'italic',
    }}>{children}</blockquote>
  ),
  strong: ({ children }) => <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{children}</strong>,
  a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--accent2)', textDecoration: 'underline' }}>{children}</a>,
};

export default function Message({ message }) {
  const isUser = message.role === 'user';
  const [msgCopied, setMsgCopied] = useState(false);

  const copyMsg = () => {
    navigator.clipboard.writeText(message.content);
    setMsgCopied(true);
    setTimeout(() => setMsgCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      animation: 'fadeUp 0.25s ease',
      marginBottom: '4px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        maxWidth: isUser ? '85%' : '95%',
        width: '100%',
      }}>
        {/* Avatar */}
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
          background: isUser ? 'var(--user-border)' : 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', marginTop: '2px',
        }}>
          {isUser ? '👤' : '🤖'}
        </div>

        {/* Bubble */}
        <div style={{
          background: isUser ? 'var(--user-bubble)' : 'var(--bg3)',
          border: `1px solid ${isUser ? 'var(--user-border)' : 'var(--border)'}`,
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          padding: '12px 14px', color: 'var(--text)',
          fontSize: '14px', lineHeight: 1.7, wordBreak: 'break-word',
          minWidth: 0, overflow: 'hidden',
        }}>
          {isUser ? (
            <p style={{ margin: 0 }}>{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {/* Copy button under message */}
      {!isUser && (
        <button onClick={copyMsg} style={{
          marginLeft: '40px', marginTop: '4px',
          background: 'none', border: 'none',
          color: msgCopied ? 'var(--accent3)' : 'var(--text3)',
          fontSize: '11px', cursor: 'pointer', padding: '2px 4px',
          fontFamily: 'var(--font-mono)',
        }}>
          {msgCopied ? '✓ copied' : 'copy response'}
        </button>
      )}

      {/* Timestamp */}
      <div style={{
        fontSize: '10px', color: 'var(--text3)',
        marginTop: '2px', paddingLeft: isUser ? '0' : '40px',
        paddingRight: isUser ? '40px' : '0',
      }}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
