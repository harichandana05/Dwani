import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';

/**
 * Parses basic markdown (bold, italic, newlines, numbered lists) 
 * and returns an array of React elements — no external deps needed.
 */
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, li) => {
    if (!line.trim()) {
      elements.push(<br key={`br-${li}`} />);
      return;
    }

    // Split each line by **bold** and *italic* segments
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    const inline = parts.map((part, pi) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pi}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={pi}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

    // Detect numbered list items
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      // Re-parse the text part for bold/italic
      const numParts = numberedMatch[2].split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((p, pi) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={pi}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('*') && p.endsWith('*')) return <em key={pi}>{p.slice(1, -1)}</em>;
        return p;
      });
      elements.push(
        <div key={li} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: 700, minWidth: '1.2rem' }}>{numberedMatch[1]}.</span>
          <span>{numParts}</span>
        </div>
      );
      return;
    }

    // Detect emoji bullet lines (starting with emoji like 🚨, ✅ etc.)
    elements.push(<div key={li} style={{ marginBottom: '0.15rem' }}>{inline}</div>);
  });

  return elements;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "🙏 Namaskaram! I am **Dwani**, your personal AI Carnatic Music Guru. Ask me about **Ragas**, **Talas**, or **Swaras**, vocal health, or how to use this app!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chatbot`, { message: userMsg });
      if (res.data.success) {
        setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { text: 'Sorry, my server is currently resting. Please try again later.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What is a Raga?",
    "How to sing properly?",
    "Explain Talam",
    "Throat care tips",
  ];

  return (
    <div className="chatbot-widget">
      {!isOpen && (
        <div
          className="chat-toggle"
          onClick={() => setIsOpen(true)}
          title="Ask Dwani AI Guru"
          style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
        >
          <Bot size={24} />
          <span style={{ fontSize: '0.5rem', fontFamily: 'Cinzel, serif', letterSpacing: '1px', color: 'white' }}>DWANI</span>
        </div>
      )}

      {isOpen && (
        <div className="glass chat-window" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={22} color="var(--accent-secondary)" />
              <div>
                <div style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent-tertiary)', fontSize: '1rem' }}>Dwani AI Guru</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                  Online
                </div>
              </div>
            </div>
            <X size={22} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}>
                {msg.sender === 'bot'
                  ? <div style={{ lineHeight: 1.55 }}>{renderMarkdown(msg.text)}</div>
                  : msg.text
                }
              </div>
            ))}
            {isLoading && (
              <div className="chat-message msg-bot" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Sparkles size={14} color="var(--accent-secondary)" style={{ animation: 'spin 1.5s linear infinite' }} />
                <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem' }}>Dwani is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    // Auto-submit after click
                    setTimeout(() => {
                      setMessages(prev => [...prev, { text: q, sender: 'user' }]);
                      setInput('');
                      setIsLoading(true);
                      axios.post(`${API_BASE}/api/chatbot`, { message: q })
                        .then(res => {
                          if (res.data.success) setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
                          setIsLoading(false);
                        })
                        .catch(() => {
                          setMessages(prev => [...prev, { text: 'Sorry, my server is resting.', sender: 'bot' }]);
                          setIsLoading(false);
                        });
                    }, 50);
                  }}
                  style={{
                    fontSize: '0.72rem', padding: '0.25rem 0.7rem', borderRadius: '20px',
                    background: 'rgba(255, 215, 0, 0.08)', border: '1px solid rgba(255, 215, 0, 0.2)',
                    color: 'var(--accent-tertiary)', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255, 215, 0, 0.2)'}
                  onMouseLeave={e => e.target.style.background = 'rgba(255, 215, 0, 0.08)'}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about raga, tala, vocal health..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus={isOpen}
            />
            <button
              type="submit"
              className="btn btn-action"
              style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}
              disabled={isLoading || !input.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
