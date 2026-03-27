import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ModulePractice from './components/ModulePractice';
import BreathPractice from './components/BreathPractice';
import Chatbot from './components/Chatbot';
import { Music, LogOut } from 'lucide-react';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuthToken(null);
  };

  return (
    <Router>
      <div className="app-container">
        {authToken && (
          <nav className="navbar glass fade-in" style={{ borderRadius: '0 0 16px 16px' }}>
            <div className="nav-brand">
              <Music size={28} color="var(--accent-secondary)" />
              <span className="gradient-text">DWANI</span>
            </div>
            <div className="nav-links">
              <span style={{ color: 'var(--text-secondary)' }}>Hello, {localStorage.getItem('username')}</span>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </nav>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/" element={!authToken ? <Auth setAuthToken={setAuthToken} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={authToken ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/practice/breath_practice" element={authToken ? <BreathPractice /> : <Navigate to="/" />} />
            <Route path="/practice/:id" element={authToken ? <ModulePractice /> : <Navigate to="/" />} />
          </Routes>
        </main>

        {authToken && <Chatbot />}
      </div>
    </Router>
  );
}

export default App;
