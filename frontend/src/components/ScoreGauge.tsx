import React, { useState } from 'react';
import { Info, HelpCircle, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface ScoreGaugeProps {
  percentage: number;
  matchedCount: number;
  totalRequired: number;
  status: 'calculated' | 'unavailable';
  message?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  percentage,
  matchedCount,
  totalRequired,
  status,
  message,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // SVG circular gauge geometry
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    status === 'calculated'
      ? circumference - (percentage / 100) * circumference
      : circumference;

  return (
    <div
      className="glass-card"
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
          Explainable Skill Overlap
        </h3>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Explain this calculation"
          aria-label="Explain score calculation"
        >
          <HelpCircle size={16} />
        </button>
      </div>

      {/* SVG Circular Gauge */}
      <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 16px' }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00CFFF" />
              <stop offset="60%" stopColor="#42E8FF" />
              <stop offset="100%" stopColor="#795BFF" />
            </linearGradient>
            <filter id="scoreGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="rgba(148, 163, 184, 0.12)"
            strokeWidth={strokeWidth}
          />

          {/* Foreground progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke={status === 'calculated' ? 'url(#scoreGaugeGrad)' : 'rgba(148, 163, 184, 0.3)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#scoreGlow)"
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        {/* Center Text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {status === 'calculated' ? (
            <>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #00CFFF, #42E8FF, #795BFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {percentage}%
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Skill Overlap
              </div>
            </>
          ) : (
            <>
              <AlertTriangle size={32} color="#fbbf24" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24' }}>
                N/A
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Zero Requirements</div>
            </>
          )}
        </div>
      </div>

      {/* Numerical Ratio Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(0, 207, 255, 0.08)',
          border: '1px solid rgba(0, 207, 255, 0.25)',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#42e8ff',
          marginBottom: '16px',
        }}
      >
        <CheckCircle size={14} color="#34D399" />
        <span>
          {matchedCount} of {totalRequired} Required Skills Detected
        </span>
      </div>

      {message && (
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '340px', marginBottom: '14px' }}>
          {message}
        </p>
      )}

      {/* Expand/Collapse Explanation Toggle Button */}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#64748b',
          fontSize: '0.78rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        <span>{showExplanation ? 'Hide Mathematical Formula' : 'View Exact Mathematical Formula'}</span>
        {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Expandable Mathematical Transparency Panel */}
      {showExplanation && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(3, 7, 18, 0.75)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00cfff', marginBottom: '8px' }}>
            <Info size={15} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Deterministic Formulation</span>
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.5)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#34d399',
              marginBottom: '10px',
              overflowX: 'auto',
            }}
          >
            Skill Overlap (%) = ({matchedCount} / {totalRequired || 1}) × 100 = {percentage}%
          </div>

          <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>
            <strong style={{ color: '#f8fafc' }}>Ethical Guardrail:</strong> This percentage is an explainable measure of documented lexical and semantic skill overlap between two texts. It does not measure candidate potential, intellect, grit, or likelihood of being hired. SkillBridge AI never ranks candidates for automated rejection.
          </p>
        </div>
      )}
    </div>
  );
};
