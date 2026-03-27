import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Wind, Square, FastForward } from 'lucide-react';

const SWARA_FREQS = {
  "Sa": 261.63,
  "Ri1": 277.18,
  "Ga2": 311.13,
  "Ma1": 349.23,
  "Pa": 392.00,
  "Da1": 415.30,
  "Ni3": 493.88, // Ni in high pitch as requested
  "HighSa": 523.25
};

const AAROHANAM = [
  "Sa", "Ri1", "Ga2", "Ma1", "Pa", "Da1", "Ni3", "HighSa",
  "HighSa", "Ni3", "Da1", "Pa", "Ma1", "Ga2", "Ri1", "Sa"
];

export default function BreathPractice() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(0); // 0=off, 1,2,3=speeds
  const audioCtxRef = useRef(null);
  const activeOscillatorsRef = useRef([]);

  const stopPractice = () => {
    activeOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    activeOscillatorsRef.current = [];
    setIsPlaying(0);
  };

  const playBreathPractice = (speed = 1) => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    stopPractice(); // Stop any currently playing
    setIsPlaying(speed);

    const t = ctx.currentTime;
    
    // speed 1 = 1.0s per note (1 note/beat)
    // speed 2 = 0.5s per note (2 notes/beat)
    // speed 3 = 0.25s per note (4 notes/beat)
    const beatsPerNote = speed === 1 ? 1.0 : speed === 2 ? 0.5 : 0.25;
    const beatDuration = 1.0; // 1 beat = 1 second (60 BPM)
    const noteDuration = beatDuration * beatsPerNote; 
    const totalDuration = noteDuration * AAROHANAM.length;

    // ==========================================
    // 0. Talam Beat Generator (Woodblock)
    // ==========================================
    const numBeats = Math.ceil(totalDuration / beatDuration);
    for (let i = 0; i <= numBeats; i++) {
      const beatOsc = ctx.createOscillator();
      const beatGain = ctx.createGain();
      beatOsc.type = 'triangle';
      beatOsc.frequency.setValueAtTime(i === 0 || i % 4 === 0 ? 800 : 600, t + i * beatDuration); // Accent
      beatOsc.frequency.exponentialRampToValueAtTime(100, t + i * beatDuration + 0.1);
      
      beatOsc.connect(beatGain);
      beatGain.connect(ctx.destination);
      
      beatGain.gain.setValueAtTime(0.5, t + i * beatDuration);
      beatGain.gain.exponentialRampToValueAtTime(0.01, t + i * beatDuration + 0.1);
      
      beatOsc.start(t + i * beatDuration);
      beatOsc.stop(t + i * beatDuration + 0.1);
      activeOscillatorsRef.current.push(beatOsc);
    }

    // ==========================================
    // 1. Carnatic Tambura Drone (Plays continuously)
    // ==========================================
    const baseFreq = 261.63; // Sa
    const paFreq = 392.00;   // Pa
    
    const createDrone = (f, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 1.0);
      gain.gain.linearRampToValueAtTime(vol, t + totalDuration - 1.0);
      gain.gain.linearRampToValueAtTime(0, t + totalDuration);
      
      osc.start(t);
      osc.stop(t + totalDuration);
      activeOscillatorsRef.current.push(osc);
    };

    createDrone(baseFreq / 2, 0.15); // Mandra Sa
    createDrone(paFreq / 2, 0.1);    // Mandra Pa
    createDrone(baseFreq, 0.08);     // Madhya Sa

    // ==========================================
    // 2. Continuous Main Swaras (Aarohanam Sequence)
    // ==========================================
    const mainOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const mainGain = ctx.createGain();

    mainOsc.type = 'sawtooth';

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(baseFreq * 2.5, t);
    filter.Q.value = 2; // Slight resonance

    mainOsc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    // Apply 5Hz Gamakam (Vibrato)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 5; 
    lfoGain.gain.value = 4;
    lfo.connect(lfoGain);
    lfoGain.connect(mainOsc.frequency);
    lfo.start(t);
    lfo.stop(t + totalDuration);
    activeOscillatorsRef.current.push(lfo);

    // Schedule frequencies dynamically per note without breaking the sound
    AAROHANAM.forEach((swara, index) => {
      const startTime = t + (index * noteDuration);
      const freq = SWARA_FREQS[swara];
      
      // smoothly glide from previous note to next note
      mainOsc.frequency.setValueAtTime(index === 0 ? freq : SWARA_FREQS[AAROHANAM[index - 1]], startTime);
      mainOsc.frequency.linearRampToValueAtTime(freq, startTime + 0.2);
    });

    // Envelopes for the main synth (fade in, hold for total duration, fade out)
    mainGain.gain.setValueAtTime(0, t);
    mainGain.gain.linearRampToValueAtTime(0.3, t + 0.5); 
    mainGain.gain.setValueAtTime(0.3, t + totalDuration - 0.5); 
    mainGain.gain.linearRampToValueAtTime(0, t + totalDuration); 

    mainOsc.start(t);
    mainOsc.stop(t + totalDuration);
    activeOscillatorsRef.current.push(mainOsc);

    setTimeout(() => {
      setIsPlaying(0);
    }, totalDuration * 1000);
  };

  return (
    <div className="container fade-in">
      <div className="glass" style={{ padding: '2rem', marginTop: '2rem' }}>
        <button className="btn btn-secondary mb-4" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="text-center mb-4">
          <div className="flex-center mb-2"><Wind size={48} color="var(--accent-secondary)" /></div>
          <h2><span className="gradient-text">Breath Practice (Akaram)</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Practicing the entire Aarohanam (Sa Re Ga Ma Pa Da Ni Sa) in a single continuous breath builds vocal stamina.
          </p>
        </div>

        <div className="practice-area glass" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <div className="visual-guide flex-center flex-wrap" style={{ gap: '1rem', padding: '1rem 0' }}>
            {AAROHANAM.map((swara, idx) => (
              <div key={idx} className="swara-bubble active" style={{ animationDelay: (idx * 0.1) + 's', background: 'var(--bg-secondary)', color: 'var(--accent-tertiary)' }}>
                {swara.replace(/\d|High/, '')}
              </div>
            ))}
          </div>
          
          <h3 className="mb-2">Instructions</h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Take a deep breath and try to match the sequence from Sa to High Sa without exhaling or breaking the flow.
          </p>

          <div className="flex-center flex-wrap" style={{ gap: '0.5rem' }}>
            {[1, 2, 3].map(speed => (
              <button 
                key={speed} 
                className={`btn ${isPlaying === speed ? 'btn-danger' : 'btn-secondary'}`} 
                onClick={() => isPlaying === speed ? stopPractice() : playBreathPractice(speed)}
                disabled={isPlaying > 0 && isPlaying !== speed}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                {isPlaying === speed ? <Square size={16} /> : <FastForward size={16} />}
                Speed {speed} {speed === 1 ? '(1x)' : speed === 2 ? '(2x)' : '(4x)'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
