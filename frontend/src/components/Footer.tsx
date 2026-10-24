import React from 'react';
import { Cpu, ShieldCheck, Award } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer
      style={{
        marginTop: '100px',
        borderTop: '1px solid rgba(148, 163, 184, 0.14)',
        background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.6) 0%, rgba(7, 19, 41, 0.95) 100%)',
        padding: '60px 0 30px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00cfff, #795bff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#030712',
                }}
              >
                <Cpu size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Skill<span className="gradient-text">Bridge</span> AI
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
              Explainable AI-powered resume skill extraction, transparent job requirement matching, and career opportunity intelligence.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                color: '#34d399',
                background: 'rgba(52, 211, 153, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(52, 211, 153, 0.25)',
              }}
            >
              <ShieldCheck size={14} />
              <span>Zero Document Retention Guarantee</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.04em' }}>
              PLATFORM WORKFLOWS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Overview & Live Demo
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('analyze'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Resume Skill Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('evaluation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Model Benchmark & Metrics (F1 / Recall)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('taxonomy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Curated Skill Taxonomy (40+ Skills)
                </button>
              </li>
            </ul>
          </div>

          {/* Ethics & Science */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.04em' }}>
              RESPONSIBLE AI & ETHICS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button
                  onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Privacy Charter & Data Lifecycle
                </button>
              </li>
              <li>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  No Automated Candidate Ranking
                </span>
              </li>
              <li>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Anti-Pattern Disambiguation Rules
                </span>
              </li>
              <li>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Zero Attribute Inference
                </span>
              </li>
            </ul>
          </div>

          {/* Academic Capstone Notice */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.04em' }}>
              ACADEMIC CAPSTONE
            </h4>
            <div
              style={{
                background: 'rgba(11, 18, 32, 0.7)',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.16)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#42e8ff', marginBottom: '6px' }}>
                <Award size={16} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Production-Quality Capstone</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Engineered with deterministic boundary regex, TF-IDF cosine semantic similarity, ground-truth evaluation, and privacy-preserving document pipelines.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            © {new Date().getFullYear()} SkillBridge AI. Designed for ethical career intelligence & academic demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: '#94a3b8' }}>
            <span>FastAPI + PyMuPDF/pypdf</span>
            <span>•</span>
            <span>React + TypeScript + Vite</span>
            <span>•</span>
            <span>Scikit-Learn TF-IDF</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
