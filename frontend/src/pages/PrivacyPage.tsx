import React from 'react';
import { ShieldCheck, Lock, Eye, UserCheck, Trash2, Database, AlertCircle, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '100px', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '980px', paddingBottom: '90px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="glowing-badge" style={{ marginBottom: '10px' }}>
            <ShieldCheck size={14} />
            <span>RESPONSIBLE AI & ETHICAL CHARTER</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Privacy Architecture & Responsible AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '720px' }}>
            SkillBridge AI was created with a fundamental commitment to privacy protection, explainable artificial intelligence, and human-in-the-loop decision autonomy.
          </p>
        </div>

        {/* 15 Commitments Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {[
            {
              icon: <Trash2 size={20} color="#00CFFF" />,
              title: '1. Zero Permanent Storage',
              desc: 'Uploaded resume files (PDF, DOCX, TXT) are parsed strictly in memory and immediately discarded. No candidate documents are stored on disk or persistent databases.',
            },
            {
              icon: <Lock size={20} color="#34D399" />,
              title: '2. No Third-Party Leaks',
              desc: 'Resume contents are never transmitted to third-party ad networks, telemetry trackers, or external cloud scraping platforms.',
            },
            {
              icon: <UserCheck size={20} color="#795BFF" />,
              title: '3. No Automated Rejection',
              desc: 'The platform is explicitly designed for candidate career exploration. It never generates automated rejection notices or ranks applicants for dismissal.',
            },
            {
              icon: <Eye size={20} color="#42E8FF" />,
              title: '4. Verifiable Text Evidence',
              desc: 'Every extracted skill is linked to verified context snippets from the source document, eliminating black-box guesswork.',
            },
            {
              icon: <ShieldCheck size={20} color="#34D399" />,
              title: '5. Zero Protected Attribute Inference',
              desc: 'Our extraction engine parses exclusively technical and professional competencies. It strictly ignores gender, age, ethnicity, religion, or disability indicators.',
            },
            {
              icon: <Database size={20} color="#FBBF24" />,
              title: '6. Local Vector Processing',
              desc: 'Contextual NLP analysis is executed locally via TF-IDF vector similarity, ensuring zero dependency on paid cloud LLMs or data retention risks.',
            },
            {
              icon: <FileText size={20} color="#00CFFF" />,
              title: '7. Missing ≠ Incompetent',
              desc: 'The system clearly states that an unmentioned skill represents "not detected in document", acknowledging that candidates may possess undocumented skills.',
            },
            {
              icon: <UserCheck size={20} color="#795BFF" />,
              title: '8. User-Controlled Corrections',
              desc: 'Job seekers have the active authority to review, confirm, or edit detected and missing skills directly in the interface.',
            },
            {
              icon: <Lock size={20} color="#34D399" />,
              title: '9. Log Redaction',
              desc: 'Application server logs deliberately redact document text and personal contact information to protect privacy during debugging.',
            },
            {
              icon: <AlertCircle size={20} color="#FB7185" />,
              title: '10. Boundary Safety & Disambiguation',
              desc: 'Deterministic rules prevent dangerous false positives (such as Java matching JavaScript, or SQL matching prerequisites).',
            },
            {
              icon: <Eye size={20} color="#42E8FF" />,
              title: '11. Transparent Mathematical Formulas',
              desc: 'Skill overlap is calculated through a verifiable formula: (Matched Required / Total Distinct Required) × 100, with full zero-division safety.',
            },
            {
              icon: <FileText size={20} color="#FBBF24" />,
              title: '12. Synthetic Demonstration Data',
              desc: 'All pre-loaded sample profiles (Alex Chen, Maya Patel, etc.) are 100% synthetic to protect private individual identities.',
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '22px' }}>
              <div style={{ marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.55 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Responsible AI Charter Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            border: '1px solid rgba(0, 207, 255, 0.35)',
            background: 'linear-gradient(135deg, rgba(3, 7, 18, 0.9), rgba(7, 19, 41, 0.9))',
          }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', color: '#00CFFF' }}>
            Human Decision Autonomy Guarantee
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '16px' }}>
            SkillBridge AI is designed to serve candidates and hiring teams as an educational reference tool. It does not replace human empathy, mentorship, or interview dialogue. By upholding complete data privacy and mathematical transparency, we bridge career opportunities with dignity and clarity.
          </p>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Document Last Updated: Academic Release • Verified Compliance Architecture
          </div>
        </div>
      </div>
    </div>
  );
};
