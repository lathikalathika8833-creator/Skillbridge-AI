import React, { useState } from 'react';
import {
  ArrowRight,
  Shield,
  Sparkles,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Cpu,
  BarChart3,
  Lock,
  Layers,
  Scale,
  Zap,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { HeroSignatureVisual } from '../components/HeroSignatureVisual';

interface HomePageProps {
  onNavigateToWorkspace: (sampleResumeKey?: string, sampleJobKey?: string) => void;
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToWorkspace, setActiveTab }) => {
  // Live Demo interactive state
  const [demoSelectedSkill, setDemoSelectedSkill] = useState<string | null>('Python');

  const demoResumeSkills = ['Python', 'SQL', 'Pandas', 'Data Visualization', 'Machine Learning'];
  const demoJobSkills = ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Power BI', 'Statistics'];

  const demoMatched = demoResumeSkills.filter((s) => demoJobSkills.includes(s));
  const demoMissing = demoJobSkills.filter((s) => !demoResumeSkills.includes(s));
  const demoAdditional = demoResumeSkills.filter((s) => !demoJobSkills.includes(s));

  // Actual formula: (Matched / Required) * 100
  const demoScore = Math.round((demoMatched.length / demoJobSkills.length) * 1000) / 10;

  return (
    <div style={{ paddingTop: '100px' }}>
      {/* ====================================================================
          1. HERO SECTION (Visual Centerpiece)
          ==================================================================== */}
      <section style={{ padding: '40px 0 80px', position: 'relative' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Cinematic Headline & CTAs */}
            <div style={{ maxWidth: '580px' }}>
              <div className="glowing-badge" style={{ marginBottom: '24px' }}>
                <span className="dot" />
                <span>AI-POWERED CAREER INTELLIGENCE</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '20px',
                }}
              >
                Turn Your Skills Into{' '}
                <span className="gradient-text">Your Next Opportunity.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                }}
              >
                Understand what your resume reveals, discover the exact skills employers request, and identify your next learning milestone through transparent, explainable AI-powered skill matching.
              </p>

              {/* CTAs */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '28px',
                }}
              >
                <button
                  onClick={() => onNavigateToWorkspace()}
                  className="btn btn-primary"
                  style={{ padding: '14px 28px', fontSize: '1.02rem' }}
                >
                  <span>Analyze My Resume</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '14px 24px', fontSize: '1.02rem' }}
                >
                  <span>Explore How It Works</span>
                </button>
              </div>

              {/* Compact Trust Statement */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(11, 18, 32, 0.75)',
                  border: '1px solid rgba(148, 163, 184, 0.16)',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                }}
              >
                <Shield size={16} color="#34D399" />
                <span>Privacy-conscious • Explainable matching • Human-controlled decisions</span>
              </div>
            </div>

            {/* Right Column: Signature 3D AI Visualization Centerpiece */}
            <div>
              <HeroSignatureVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. HOW IT WORKS SECTION (4 Premium Cards)
          ==================================================================== */}
      <section id="how-it-works-section" style={{ padding: '80px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <div className="glowing-badge" style={{ marginBottom: '14px' }}>
              <span>WORKFLOW PIPELINE</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              How SkillBridge AI Bridges The Gap
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              A transparent, 4-step explainable intelligence process designed to help you decode job requirements and target your professional growth.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Card 01 */}
            <div className="glass-card" style={{ padding: '30px 24px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(0, 207, 255, 0.12)',
                  border: '1px solid rgba(0, 207, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00cfff',
                  marginBottom: '20px',
                }}
              >
                <FileText size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#00cfff', fontWeight: 700, marginBottom: '6px' }}>
                STEP 01
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Upload Resume</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Upload your resume in PDF or DOCX format, or paste your raw resume text directly. All processing occurs securely in-memory without persistent retention.
              </p>
            </div>

            {/* Card 02 */}
            <div className="glass-card" style={{ padding: '30px 24px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(121, 91, 255, 0.14)',
                  border: '1px solid rgba(121, 91, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#795bff',
                  marginBottom: '20px',
                }}
              >
                <Cpu size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#795bff', fontWeight: 700, marginBottom: '6px' }}>
                STEP 02
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Extract Skills</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Identify technical skills, frameworks, databases, developer tools, and explicitly supported soft skills using deterministic boundary checks and NLP context vectors.
              </p>
            </div>

            {/* Card 03 */}
            <div className="glass-card" style={{ padding: '30px 24px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(67, 139, 255, 0.14)',
                  border: '1px solid rgba(67, 139, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#438bff',
                  marginBottom: '20px',
                }}
              >
                <Search size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#438bff', fontWeight: 700, marginBottom: '6px' }}>
                STEP 03
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Analyze Job Requirements</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Compare extracted resume skills against target job description requirements to map overlaps, transferable competencies, and unmentioned skills.
              </p>
            </div>

            {/* Card 04 */}
            <div className="glass-card" style={{ padding: '30px 24px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(52, 211, 153, 0.14)',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  marginBottom: '20px',
                }}
              >
                <BarChart3 size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>
                STEP 04
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Understand The Results</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Inspect verified evidence snippets, review missing skills with zero false-deficiency assumptions, inspect uncertain matches, and view an explainable overlap score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. FEATURE SHOWCASE (8 Sophisticated Cards)
          ==================================================================== */}
      <section style={{ padding: '80px 0', background: 'rgba(7, 19, 41, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <div className="glowing-badge" style={{ marginBottom: '14px' }}>
              <span>ENGINEERING HIGHLIGHTS</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              Architected For Transparency & Precision
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Designed from the ground up to prevent the black-box opacity of traditional ATS systems.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                icon: <FileText size={22} color="#00CFFF" />,
                title: 'Intelligent Resume Parsing',
                desc: 'In-memory parsing of PDF and DOCX files with scanned document detection and zero disk retention.',
              },
              {
                icon: <Scale size={22} color="#795BFF" />,
                title: 'Skill Name Normalization',
                desc: 'Resolves real-world aliases (e.g. JS → JavaScript, K8s → Kubernetes) with strict boundary protections.',
              },
              {
                icon: <Search size={22} color="#42E8FF" />,
                title: 'Job Description Analysis',
                desc: 'Extracts core qualifications from messy unstructured job postings without fragile web scrapers.',
              },
              {
                icon: <CheckCircle2 size={22} color="#34D399" />,
                title: 'Explainable Skill Matching',
                desc: 'Every matched skill links to source text evidence with verified line-level context snippets.',
              },
              {
                icon: <Zap size={22} color="#FBBF24" />,
                title: 'Skill Gap Visualization',
                desc: 'Categorizes non-detected requirements as learning opportunities rather than negative strikes.',
              },
              {
                icon: <Cpu size={22} color="#795BFF" />,
                title: 'NLP-Based Extraction',
                desc: 'Contextual n-gram scanning and TF-IDF cosine similarity for semantic entity disambiguation.',
              },
              {
                icon: <BarChart3 size={22} color="#00CFFF" />,
                title: 'Evaluation Metrics',
                desc: 'Scientific Precision, Recall, and F1 benchmarks against an annotated ground-truth test corpus.',
              },
              {
                icon: <Lock size={22} color="#34D399" />,
                title: 'Privacy-Aware Processing',
                desc: 'Complete local client fallback, zero telemetry tracking, and zero attribute inference.',
              },
            ].map((feat, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '14px' }}>{feat.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', color: '#f8fafc' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. LIVE DEMO PREVIEW (Interactive Sample Demonstration)
          ==================================================================== */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '40px 32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '30px',
                borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
                paddingBottom: '20px',
              }}
            >
              <div>
                <div className="glowing-badge" style={{ marginBottom: '8px' }}>
                  <span>ILLUSTRATIVE SAMPLE DEMO</span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                  Interactive Skill Matching Preview
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Illustrating real-time skill overlap scoring calculated with the application's actual mathematical formula.
                </p>
              </div>

              <button
                onClick={() => onNavigateToWorkspace('data_analyst', 'data_analyst_job')}
                className="btn btn-primary btn-sm"
              >
                <span>Load In Full Workspace</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Side-by-side columns */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px',
                marginBottom: '30px',
              }}
            >
              {/* Resume Skills Box */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(3, 7, 18, 0.6)',
                  border: '1px solid rgba(0, 207, 255, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#42e8ff' }}>
                    Sample Resume Skills ({demoResumeSkills.length})
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Detected in Document</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {demoResumeSkills.map((s) => {
                    const isMatched = demoJobSkills.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => setDemoSelectedSkill(s)}
                        className={`skill-tag ${isMatched ? 'skill-tag-matched' : 'skill-tag-additional'}`}
                        style={{
                          cursor: 'pointer',
                          outline: demoSelectedSkill === s ? '2px solid #00CFFF' : 'none',
                        }}
                      >
                        {isMatched ? <CheckCircle2 size={12} /> : <Sparkles size={12} />}
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Job Requirements Box */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(3, 7, 18, 0.6)',
                  border: '1px solid rgba(121, 91, 255, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#a78bfa' }}>
                    Job Description Requirements ({demoJobSkills.length})
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Target Role Criteria</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {demoJobSkills.map((s) => {
                    const isMatched = demoResumeSkills.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => setDemoSelectedSkill(s)}
                        className={`skill-tag ${isMatched ? 'skill-tag-matched' : 'skill-tag-missing'}`}
                        style={{
                          cursor: 'pointer',
                          outline: demoSelectedSkill === s ? '2px solid #795BFF' : 'none',
                        }}
                      >
                        {isMatched ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Score & Formula Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '20px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 207, 255, 0.08), rgba(121, 91, 255, 0.12))',
                border: '1px solid rgba(0, 207, 255, 0.3)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  CALCULATED SKILL OVERLAP
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#00CFFF', fontFamily: 'var(--font-mono)' }}>
                    {demoScore}%
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
                    ({demoMatched.length} of {demoJobSkills.length} required skills matched)
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#34d399',
                  background: 'rgba(3, 7, 18, 0.7)',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                }}
              >
                Formula: ({demoMatched.length} / {demoJobSkills.length}) × 100 = {demoScore}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. RESPONSIBLE AI SECTION ("AI That Explains. Humans Who Decide.")
          ==================================================================== */}
      <section style={{ padding: '80px 0', background: 'rgba(7, 19, 41, 0.5)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="glowing-badge" style={{ marginBottom: '16px' }}>
                <Shield size={14} />
                <span>ETHICAL AI CHARTER</span>
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em' }}>
                AI That Explains.{' '}
                <span className="gradient-text">Humans Who Decide.</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '24px' }}>
                SkillBridge AI is built explicitly for educational exploration and candidate empowerment. Unlike black-box screening algorithms, our platform provides full inspectability, verified text evidence, and zero automated hiring judgments.
              </p>

              <button
                onClick={() => setActiveTab('privacy')}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Read Full Privacy & AI Charter</span>
                <ExternalLink size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  title: 'Career Exploration, Not Automated Screening',
                  desc: 'The tool assists job seekers in identifying skills to highlight or study. It is never designed to screen out candidates.',
                },
                {
                  title: 'Verifiable Text Evidence Snippets',
                  desc: 'Every detected skill links to its exact context within the document. No phantom predictions without evidence.',
                },
                {
                  title: 'Missing Does Not Equal Lacking',
                  desc: "A missing match solely means the keyword was not identified in the uploaded document. It does not infer candidate incompetence.",
                },
                {
                  title: 'Zero Protected Attribute Inference',
                  desc: 'The algorithms ignore name, gender, age, ethnicity, religion, or location, evaluating strictly canonical skills.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card"
                  style={{ padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(52, 211, 153, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. FINAL CALL TO ACTION
          ==================================================================== */}
      <section style={{ padding: '90px 0', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '16px' }}>
            Your Next Opportunity Starts With Understanding Your Skills.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Extract skills from your resume, match against real industry job descriptions, and view your transparent skill overlap score in seconds.
          </p>
          <button
            onClick={() => onNavigateToWorkspace()}
            className="btn btn-primary"
            style={{ padding: '16px 36px', fontSize: '1.05rem' }}
          >
            <span>Start Skill Analysis</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};
