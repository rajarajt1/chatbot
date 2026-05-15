import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'srm_ai_sessions';

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useChat() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeId, setActiveId] = useState(sessions[0]?.id || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeSession = sessions.find(s => s.id === activeId) || null;

  const createSession = useCallback((model = 'llama3.1:latest', systemPrompt = '') => {
    const session = {
      id: uuidv4(),
      title: 'New Chat',
      model,
      systemPrompt,
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => {
      const updated = [session, ...prev];
      saveSessions(updated);
      return updated;
    });
    setActiveId(session.id);
    return session.id;
  }, []);

  const deleteSession = useCallback((id) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveSessions(updated);
      if (activeId === id) setActiveId(updated[0]?.id || null);
      return updated;
    });
  }, [activeId]);

  const clearAll = useCallback(() => {
    setSessions([]);
    setActiveId(null);
    saveSessions([]);
  }, []);

  const updateSession = useCallback((id, changes) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...changes } : s);
      saveSessions(updated);
      return updated;
    });
  }, []);

  const sendMessage = useCallback(async (content, model, systemPrompt) => {
    setError(null);
    let sessionId = activeId;

    // Create session if none exists
    if (!sessionId) {
      sessionId = createSession(model, systemPrompt);
    }

    const userMsg = { id: uuidv4(), role: 'user', content, timestamp: Date.now() };

    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.id !== sessionId) return s;
        const messages = [...s.messages, userMsg];
        const title = s.messages.length === 0 ? content.slice(0, 40) : s.title;
        return { ...s, messages, title };
      });
      saveSessions(updated);
      return updated;
    });

    setLoading(true);
    try {
      const session = sessions.find(s => s.id === sessionId) || { messages: [] };
      const history = [...session.messages, userMsg].map(m => ({
        role: m.role, content: m.content
      }));

      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ messages: history, model, systemPrompt }),
      });

      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg = { id: uuidv4(), role: 'assistant', content: data.message, timestamp: Date.now() };

      setSessions(prev => {
        const updated = prev.map(s => {
          if (s.id !== sessionId) return s;
          return { ...s, messages: [...s.messages, assistantMsg] };
        });
        saveSessions(updated);
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeId, sessions, createSession]);

  return {
    sessions, activeSession, activeId, setActiveId,
    createSession, deleteSession, clearAll, updateSession,
    sendMessage, loading, error,
  };
}
