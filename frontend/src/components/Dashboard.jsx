import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Lock, CheckCircle, Music, BookOpen, Layers, Star, Headphones, Wind, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [isProfiling, setIsProfiling] = useState(false);
  const [profilerMsg, setProfilerMsg] = useState("");
  const [expandedRaga, setExpandedRaga] = useState(null);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('streak') || '0', 10));
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const RAGAS = [
    {
      name: 'Mayamalavagowla', id: 'maya',
      emoji: '🌿',
      type: 'Melakarta #15',
      aarohanam: 'S R₁ G₃ M₁ P D₁ N₃ Ṡ',
      avarohanam: 'Ṡ N₃ D₁ P M₁ G₃ R₁ S',
      vadi: 'Ma (M₁)',
      samvadi: 'Sa (S)',
      bhava: 'Serene, Devotional — ideal for morning practice and foundational learning.',
      color: '#66bb6a'
    },
    {
      name: 'Kalyani', id: 'kalyani',
      emoji: '✨',
      type: 'Melakarta #65',
      aarohanam: 'S R₂ G₃ M₂ P D₂ N₃ Ṡ',
      avarohanam: 'Ṡ N₃ D₂ P M₂ G₃ R₂ S',
      vadi: 'Ma₂ (M₂)',
      samvadi: 'Sa (S)',
      bhava: 'Bright, radiant, and expansive — conveys joy and optimism. Popular in evening concerts.',
      color: '#ffd700'
    },
    {
      name: 'Shankarabharanam', id: 'shankar',
      emoji: '🌸',
      type: 'Melakarta #29',
      aarohanam: 'S R₂ G₃ M₁ P D₂ N₃ Ṡ',
      avarohanam: 'Ṡ N₃ D₂ P M₁ G₃ R₂ S',
      vadi: 'Ga₃ (G₃)',
      samvadi: 'Ni₃ (N₃)',
      bhava: 'Majestic, dignified, devotional — equivalent of the Western major scale. Great for Kritis.',
      color: '#ff8f00'
    },
    {
      name: 'Bhairavi', id: 'bhairavi',
      emoji: '🌙',
      type: 'Janya of Natabhairavi',
      aarohanam: 'S R₁ G₂ M₁ P D₁ N₂ Ṡ',
      avarohanam: 'Ṡ N₂ D₁ P M₁ G₂ R₁ S',
      vadi: 'Ma₁ (M₁)',
      samvadi: 'Sa (S)',
      bhava: 'Melancholic, deep longing — often used to express grief, surrender and Bhakti.',
      color: '#7986cb'
    },
    {
      name: 'Anandabhairavi', id: 'ananda',
      emoji: '💫',
      type: 'Janya of Kharaharapriya',
      aarohanam: 'S G₂ R₂ G₂ M₁ P D₁ S',
      avarohanam: 'Ṡ N₂ D₁ P M₁ G₂ R₂ S',
      vadi: 'Ga₂ (G₂)',
      samvadi: 'Ni₂ (N₂)',
      bhava: 'Tender, blissful maternal love — exquisitely emotional. Ideal for Annamacharya kritis.',
      color: '#ef9a9a'
    },
    {
      name: 'Hamsadhwani', id: 'hamsa',
      emoji: '🦢',
      type: 'Janya of Dheerashankarabharanam',
      aarohanam: 'S R₂ G₃ P N₃ Ṡ',
      avarohanam: 'Ṡ N₃ P G₃ R₂ S',
      vadi: 'Ga₃ (G₃)',
      samvadi: 'Ni₃ (N₃)',
      bhava: 'Bright, auspicious, uplifting — a pentatonic raga (5 notes). Often sung at the start of concerts.',
      color: '#80cbc4'
    },
  ];

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/progress/${username}`);
        if (res.data.success) {
          setProgress(res.data.progress);
          const s = res.data.streak || 0;
          setStreak(s);
          localStorage.setItem('streak', s);
        }
      } catch (err) {
        console.error('Failed to fetch progress');
      }
    };

    fetchProgress();
  }, [username, navigate]);

  const modules = [
    {
      id: 'swaras',
      title: 'Introduction to Swaras',
      desc: 'Learn the basic Saptaswaras: Sa, Ri, Ga, Ma, Pa, Da, Ni.',
      icon: '🎼',
    },
    {
      id: 'basic_notes',
      title: 'Basic Notes (Sa Re Ga Ma)',
      desc: 'Practice the fundamental scale and pitch matching.',
      icon: '🎵',
    },
    {
      id: 'alankaras',
      title: 'Alankaras',
      desc: 'Pattern exercises to improve vocal agility and rhythm.',
      icon: '🎶',
    },
    {
      id: 'geethams',
      title: 'Simple Geethams',
      desc: 'Learn your first Carnatic compositions.',
      icon: '🪕',
    },
    {
      id: 'annamacharya',
      title: 'Annamacharya Keerthanas',
      desc: 'Sing classical compositions with Talam support.',
      icon: '📜',
    },
    {
      id: 'breath_practice',
      title: 'Breath Practice (Akaram)',
      desc: 'Sing the continuous Sa Re Ga Ma sequence in a single breath.',
      icon: '🌬️',
    }
  ];

  const handleModuleClick = (mod_id, isLocked) => {
    if (!isLocked) {
      navigate(`/practice/${mod_id}`);
    }
  };

  const handleProfileVoice = async () => {
    try {
      setIsProfiling(true);
      setProfilerMsg("🎤 Listening... Please sing 'Sa' cleanly for 3 seconds!");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setProfilerMsg("⚙️ Analyzing vocal spectra via Deep Learning... please wait.");
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'profiler.webm');
        
        try {
          const res = await axios.post(`${API_BASE}/api/profile-voice`, formData);
          setProfilerMsg("✅ " + res.data.message);
        } catch(err) {
          setProfilerMsg("❌ AI Profiler temporarily offline.");
        }
        setIsProfiling(false);
        stream.getTracks().forEach(track => track.stop()); // kill mic
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);

    } catch (err) {
      console.error(err);
      setProfilerMsg("❌ Microphone access denied or unavailable.");
      setIsProfiling(false);
    }
  };

  const scrollToModules = () => {
    document.getElementById("modules-section").scrollIntoView({ behavior: 'smooth' });
  };

  if (!progress) {
    return <div className="app-container flex-center"><h3>Loading Modules...</h3></div>;
  }

  return (
    <div className="fade-in">
      {/* SEPARATE HOME PAGE - FULL HEIGHT */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', border: '2px solid var(--accent-color)', maxWidth: '900px', width: '100%' }}>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', color: 'var(--accent-color)', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>DWANI</h1>
          <h3 style={{ color: 'var(--accent-tertiary)', marginBottom: streak > 0 ? '1.5rem' : '3rem', fontWeight: '400', fontStyle: 'italic', fontSize: '1.5rem' }}>The Resonance of the Soul</h3>

          {/* ====== DAILY STREAK BADGE ====== */}
          {streak > 0 && (
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.85rem',
                background: streak >= 7 ? 'rgba(255,143,0,0.15)' : 'rgba(255,215,0,0.08)',
                border: `1px solid ${streak >= 7 ? 'var(--accent-secondary)' : 'rgba(255,215,0,0.3)'}`,
                borderRadius: '50px', padding: '0.65rem 2rem',
                boxShadow: streak >= 7 ? '0 0 25px rgba(255,143,0,0.35)' : 'none',
                animation: 'fadeIn 0.6s ease',
              }}>
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>
                  {streak >= 30 ? '🌟' : streak >= 14 ? '💎' : streak >= 7 ? '🔥' : '✨'}
                </span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '1.15rem',
                    color: streak >= 7 ? 'var(--accent-secondary)' : 'var(--accent-tertiary)',
                  }}>
                    {streak} Day{streak !== 1 ? 's' : ''} Streak
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {streak >= 30 ? '🏆 Legendary dedication!' :
                      streak >= 14 ? 'Diamond commitment — extraordinary!' :
                      streak >= 7 ? 'On fire! Keep the momentum going.' :
                      streak === 1 ? 'Great start! Practice again tomorrow.' :
                      `${streak} days strong — the Ragas await!`}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div style={{ textAlign: 'left', lineHeight: '1.9', color: 'var(--text-primary)', fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              <strong>Carnatic music</strong>, or <em>Karnāṭaka saṃgīta</em>, is a system of music commonly associated with southern India. It is one of the oldest classical music traditions in the world, evolving from ancient Hindu traditions, the Sama Veda, and the sophisticated musical concepts introduced by early scholars like Bharata Muni and Sharngadeva.
            </p>
            <p>
              It emphasizes <strong>Bhakti</strong> (devotion) and intricate melodic (<em>Raga</em>) and rhythmic (<em>Tala</em>) mathematical structures. Through absolute focus on the vocal tradition (<em>Gayaki</em>), it transcends mere entertainment, becoming an elevating spiritual milestone connecting the human soul to the divine. Welcome to <strong>Dwani</strong>, your premier roadmap into unlocking this eternal heritage.
            </p>
          </div>

          {/* AI VOICE PROFILER BUTTON */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255, 143, 0, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-secondary)', display: 'inline-block' }}>
            <h4 style={{ color: 'var(--accent-tertiary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <Star size={20} /> AI Auto-Shruti Profiler
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Let Deep Learning map your vocal timbre to automatically lock your perfect pitch range.
            </p>
            <button className="btn btn-action" onClick={handleProfileVoice} disabled={isProfiling} style={{ opacity: isProfiling ? 0.7 : 1 }}>
              {isProfiling ? 'Recording...' : 'Initialize Vocal Scan 🎙️'}
            </button>
            {profilerMsg && (
              <div style={{ marginTop: '1rem', color: profilerMsg.startsWith('✅') ? 'var(--success)' : (profilerMsg.startsWith('❌') ? 'var(--error)' : 'var(--accent-color)'), fontWeight: 'bold' }}>
                {profilerMsg}
              </div>
            )}
          </div>

        </div>

        {/* SWIPE UP INDICATOR */}
        <div 
          onClick={scrollToModules}
          style={{ position: 'absolute', bottom: '2rem', cursor: 'pointer', textAlign: 'center', animation: 'bounce 2s infinite' }}
        >
          <p style={{ color: 'var(--accent-tertiary)', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Swipe Up</p>
          <div style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>↓</div>
        </div>
      </div>

      {/* MODULES PAGE OVERLAY */}
      <div id="modules-section" className="container" style={{ paddingTop: '4rem' }}>
        
        {/* REMINDERS BLOCK */}
        <div className="glass" style={{ marginBottom: '3rem', padding: '2rem', border: '1px solid var(--accent-tertiary)' }}>
           <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>Daily Practice Sequence 🔔</h3>
           <ul style={{ color: 'var(--text-primary)', fontSize: '1.1rem', paddingLeft: '2rem', lineHeight: '2' }}>
              <li><strong>Take Deep Breaths:</strong> Engage from the diaphragm before starting to maintain pure, unwavering Shruti.</li>
              <li><strong>Drink Warm Water:</strong> Ensure your vocal chords are completely hydrated and relaxed. Avoid cold liquids.</li>
              <li><strong>Stretch your Swaras:</strong> Ensure you hit your base notes steadily using Akaram across three octaves slowly to warm up.</li>
           </ul>
        </div>

        {/* HEATMAP BLOCK */}
        <div className="glass" style={{ marginBottom: '4rem', padding: '2rem' }}>
           <h3 style={{ color: 'var(--accent-tertiary)', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'Cinzel, serif' }}>Practice Heatmap (Last 30 Days)</h3>
           <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
              {Array.from({ length: 30 }).map((_, i) => (
                 <div key={i} title={`Day ${i+1}`} style={{ 
                    width: '20px', height: '20px', borderRadius: '4px',
                    background: Math.random() > 0.6 ? 'var(--accent-color)' : (Math.random() > 0.3 ? 'var(--accent-tertiary)' : 'rgba(255, 215, 0, 0.1)')
                 }}></div>
              ))}
           </div>
           <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.95rem' }}>Consistency is the key to perfect Gamakas. Stay on track!</p>
        </div>

        {/* RAGA EXPLORER SECTION */}
        <div className="glass" style={{ marginBottom: '4rem', padding: '2rem' }}>
          <h3 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontFamily: 'Cinzel, serif', textAlign: 'center' }}>Raga Explorer 🎵</h3>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Study the Melakarta and Janya Ragas at the heart of Carnatic music.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {RAGAS.map(raga => (
              <div key={raga.id}
                onClick={() => setExpandedRaga(expandedRaga === raga.id ? null : raga.id)}
                style={{
                  padding: '1.25rem', borderRadius: '12px', cursor: 'pointer',
                  background: expandedRaga === raga.id ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${expandedRaga === raga.id ? raga.color : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.3s ease',
                  boxShadow: expandedRaga === raga.id ? `0 0 20px ${raga.color}33` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{raga.emoji}</span>
                    <div>
                      <div style={{ fontFamily: 'Cinzel, serif', color: raga.color, fontWeight: 700, fontSize: '1rem' }}>{raga.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{raga.type}</div>
                    </div>
                  </div>
                  {expandedRaga === raga.id ? <ChevronUp size={18} color="var(--accent-tertiary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
                </div>

                {expandedRaga === raga.id && (
                  <div style={{ marginTop: '1rem', borderTop: `1px solid ${raga.color}44`, paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Aarohanam ↑</span>
                      <div style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>{raga.aarohanam}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Avarohanam ↓</span>
                      <div style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>{raga.avarohanam}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vadi</span>
                        <div style={{ color: raga.color, fontWeight: 700, fontSize: '0.95rem' }}>{raga.vadi}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Samvadi</span>
                        <div style={{ color: raga.color, fontWeight: 700, fontSize: '0.95rem' }}>{raga.samvadi}</div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                      {raga.bhava}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--accent-color)', fontSize: '2.5rem' }}>Your Classical Journey</h2>
        <p style={{ color: 'var(--accent-tertiary)', marginTop: '0.5rem' }}>Unlock each milestone by completing the mastery check of the previous form.</p>
      </div>

      {/* ROADMAP SECTION */}
      <div className="roadmap-container">
        {modules.map((mod, idx) => {
          const isUnlocked = progress.includes(mod.id);
          const alignment = idx % 2 === 0 ? 'left' : 'right';
          
          return (
            <div key={mod.id} className={`roadmap-item ${alignment}`}>
              
              {/* Center Milestone Symbol */}
              <div className="roadmap-milestone" style={{ 
                background: isUnlocked ? 'var(--bg-secondary)' : 'rgba(0,0,0,0.5)',
                borderColor: isUnlocked ? 'var(--accent-tertiary)' : 'rgba(255, 215, 0, 0.1)',
                color: isUnlocked ? 'var(--accent-tertiary)' : 'rgba(255, 215, 0, 0.2)',
                boxShadow: isUnlocked ? '0 0 20px rgba(255, 215, 0, 0.5)' : 'none'
              }}>
                {mod.icon}
              </div>

              {/* Module Card */}
              <div className="roadmap-card-wrapper">
                <div 
                  className={`glass module-card ${isUnlocked ? '' : 'locked'}`}
                  style={{ width: '100%', cursor: isUnlocked ? 'pointer' : 'not-allowed', textAlign: alignment === 'left' ? 'right' : 'left' }}
                  onClick={() => handleModuleClick(mod.id, !isUnlocked)}
                >
                  <h3 className="module-title" style={{ fontSize: '1.4rem', color: isUnlocked ? 'var(--accent-secondary)' : 'var(--text-secondary)' }}>{mod.title}</h3>
                  <p className="module-desc" style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>{mod.desc}</p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: alignment === 'left' ? 'flex-end' : 'flex-start' }}>
                    <span className="module-status" style={{ 
                      background: isUnlocked ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)', 
                      color: isUnlocked ? 'var(--bg-primary)' : 'var(--text-secondary)', 
                      padding: '0.3rem 1rem', borderRadius: '20px', fontWeight: 'bold' 
                    }}>
                      {isUnlocked ? 'Start Practice' : 'Locked'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '6rem', marginBottom: '2rem', padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255, 215, 0, 0.2)' }}>
        <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', fontFamily: 'Cinzel, serif' }}>Developed By</h4>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Brahmandam Hari Chandana</p>
        <a href="mailto:harichandanabrahmandam05@gmail.com" style={{ display: 'inline-block', marginTop: '0.5rem', color: 'var(--accent-secondary)', fontSize: '1rem' }}>
          harichandanabrahmandam05@gmail.com
        </a>
      </div>

      </div>
    </div>
  );
}
