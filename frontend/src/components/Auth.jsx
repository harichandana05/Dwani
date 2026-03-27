import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';

export default function Auth({ setAuthToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`${API_BASE}${endpoint}`, { username, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('streak', res.data.streak || 1);
        setAuthToken(res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container flex-center">
      <div className="glass fade-in" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <div className="text-center mb-4">
          <div className="flex-center mb-2" style={{ color: 'var(--accent-secondary)' }}>
            <Music size={48} />
          </div>
          <h2 style={{ fontSize: '2.5rem', letterSpacing: '2px', fontFamily: 'Cinzel, serif' }}><span className="gradient-text">DWANI</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {isLogin ? 'Welcome back to your musical journey' : 'Start your Carnatic music journey'}
          </p>
        </div>

        {error && (
          <div className="glass mb-3 flex-center" style={{ padding: '0.75rem', background: 'rgba(247, 118, 142, 0.1)', color: 'var(--error)', border: '1px solid rgba(247, 118, 142, 0.2)' }}>
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. MS_Subbulakshmi" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div className="input-group mb-4">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-action" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? <><LogIn size={20} /> Login</> : <><UserPlus size={20} /> Create Account</>)}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign up' : 'Log in'} <ArrowRight size={14} style={{ verticalAlign: 'middle' }}/>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
