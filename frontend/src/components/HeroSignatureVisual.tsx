import React, { useState, useEffect } from 'react';
import { FileText, Cpu, CheckCircle2, AlertCircle, Sparkles, Layers, ArrowRight, Zap } from 'lucide-react';

export const HeroSignatureVisual: React.FC = () => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '620px',
        minHeight: '490px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      {/* Background Volumetric Glow behind Visualizer */}
      <div
        style={{
          position: 'absolute',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 207, 255, 0.22) 0%, rgba(121, 91, 255, 0.16) 50%, transparent 75%)',
          filter: 'blur(50px)',
          zIndex: 1,
          animation: 'pulse-ambient 6s ease-in-out infinite alternate',
        }}
      />

      {/* SVG Connecting Light Trails & Particle Beams */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 4,
          pointerEvents: 'none',
        }}
        viewBox="0 0 620 490"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beamGradientLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#795BFF" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="beamGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#795BFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Path: Resume to AI Core */}
        <path
          d="M 190 190 C 240 190, 260 245, 310 245"
          stroke="url(#beamGradientLeft)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          filter="url(#glow)"
        >
          <animate attributeName="stroke-dashoffset" from="36" to="0" dur="1.8s" repeatCount="indefinite" />
        </path>

        {/* Path: AI Core to Job Requirements */}
        <path
          d="M 310 245 C 360 245, 380 300, 430 300"
          stroke="url(#beamGradientRight)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          filter="url(#glow)"
        >
          <animate attributeName="stroke-dashoffset" from="36" to="0" dur="1.8s" repeatCount="indefinite" />
        </path>

        {/* Particle circles traversing along the lines */}
        <circle cx="250" cy="217" r="3.5" fill="#00CFFF" filter="url(#glow)">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="370" cy="272" r="3.5" fill="#34D399" filter="url(#glow)">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Layer 1: Floating Digital Resume Document (Left Top) */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          left: '20px',
          top: '40px',
          width: '240px',
          padding: '16px',
          zIndex: 5,
          border: '1px solid rgba(0, 207, 255, 0.3)',
          boxShadow: '-10px 15px 35px rgba(0,0,0,0.7), 0 0 20px rgba(0, 207, 255, 0.12)',
          transform: 'rotate(-4deg) translateY(-8px)',
          transition: 'all 0.4s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(0, 207, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00cfff',
              }}
            >
              <FileText size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>Resume_Profile.pdf</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Extracted Candidate Data</div>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.65rem',
              color: '#34d399',
              background: 'rgba(52, 211, 153, 0.15)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            PARSED
          </span>
        </div>

        {/* Simulated Document Text Lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          <div style={{ height: '4px', width: '90%', background: 'rgba(148, 163, 184, 0.25)', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '70%', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '80%', background: 'rgba(148, 163, 184, 0.15)', borderRadius: '2px' }} />
        </div>

        {/* Emerging Detected Skill Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <span className="skill-tag skill-tag-matched" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            Python
          </span>
          <span className="skill-tag skill-tag-matched" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            SQL
          </span>
          <span className="skill-tag skill-tag-matched" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            Pandas
          </span>
          <span className="skill-tag skill-tag-additional" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            React
          </span>
        </div>
      </div>

      {/* Layer 2: Central Luminous AI Processing Node */}
      <div
        style={{
          position: 'relative',
          zIndex: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div className="hero-ai-core">
          {/* Rotating Rings */}
          <div className="hero-ai-ring" />
          <div className="hero-ai-ring-outer" />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            <Cpu size={32} strokeWidth={2.2} />
            <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.06em', marginTop: '2px' }}>
              AI MATCH
            </div>
          </div>
        </div>

        {/* Micro-status pill */}
        <div
          style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'rgba(7, 19, 41, 0.85)',
            border: '1px solid rgba(0, 207, 255, 0.35)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            color: '#42e8ff',
            boxShadow: '0 0 12px rgba(0, 207, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Sparkles size={11} color="#00CFFF" />
          <span>Semantic Normalization Active</span>
        </div>
      </div>

      {/* Layer 3: Floating Job Description Panel (Right Bottom) */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          right: '20px',
          bottom: '30px',
          width: '240px',
          padding: '16px',
          zIndex: 6,
          border: '1px solid rgba(121, 91, 255, 0.35)',
          boxShadow: '10px 15px 35px rgba(0,0,0,0.7), 0 0 20px rgba(121, 91, 255, 0.15)',
          transform: 'rotate(4deg) translateY(6px)',
          transition: 'all 0.4s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(121, 91, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#795bff',
              }}
            >
              <Layers size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>Job_Description</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Target Role Requirements</div>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.65rem',
              color: '#00cfff',
              background: 'rgba(0, 207, 255, 0.15)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            6 REQ
          </span>
        </div>

        {/* Required skills with status breakdown */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          <span className="skill-tag skill-tag-matched" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            <CheckCircle2 size={11} /> Python
          </span>
          <span className="skill-tag skill-tag-matched" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            <CheckCircle2 size={11} /> SQL
          </span>
          <span className="skill-tag skill-tag-matched" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            <CheckCircle2 size={11} /> Pandas
          </span>
          <span className="skill-tag skill-tag-missing" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
            <AlertCircle size={11} /> Power BI
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            background: 'rgba(3, 7, 18, 0.6)',
            borderRadius: '8px',
            border: '1px solid rgba(148, 163, 184, 0.15)',
          }}
        >
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Skill Overlap:</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
            75.0%
          </div>
        </div>
      </div>

      {/* Layer 4: Micro Floating Score Node (Top Right) */}
      <div
        className="glass-card"
        style={{
          position: 'absolute',
          top: '25px',
          right: '50px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 7,
          background: 'rgba(11, 18, 32, 0.88)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          boxShadow: '0 0 20px rgba(52, 211, 153, 0.18)',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00CFFF, #34D399)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.78rem',
            color: '#030712',
          }}
        >
          3/4
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc' }}>Direct Match</div>
          <div style={{ fontSize: '0.62rem', color: '#34d399' }}>Verified Evidence</div>
        </div>
      </div>

      {/* Layer 5: Micro Floating Skill Gap Node (Bottom Left) */}
      <div
        className="glass-card"
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '35px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 7,
          background: 'rgba(11, 18, 32, 0.88)',
          border: '1px solid rgba(251, 113, 133, 0.35)',
          boxShadow: '0 0 20px rgba(251, 113, 133, 0.15)',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(251, 113, 133, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fb7185',
          }}
        >
          <Zap size={14} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc' }}>Opportunity Gap</div>
          <div style={{ fontSize: '0.62rem', color: '#fda4af' }}>1 Skill Recommended</div>
        </div>
      </div>
    </div>
  );
};
