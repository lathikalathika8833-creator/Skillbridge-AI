import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Download,
  Printer,
  RotateCcw,
  Sliders,
  Filter,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileCode,
  Check,
  X,
  Layers,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { AnalysisResult, ComparisonMatrixRow, SkillItem, MatchedSkillItem, MissingSkillItem } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';

interface ResultsPageProps {
  result: AnalysisResult;
  resumeText: string;
  jobText: string;
  onAnalyzeAnother: () => void;
  onModifyJob: () => void;
  setActiveTab: (tab: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  resumeText,
  jobText,
  onAnalyzeAnother,
  onModifyJob,
  setActiveTab,
}) => {
  // User confirmed manual toggles for missing skills
  const [userConfirmedSkills, setUserConfirmedSkills] = useState<Record<string, boolean>>({});
  // User confirmed / dismissed uncertain matches
  const [uncertainDecisions, setUncertainDecisions] = useState<Record<string, 'verified' | 'dismissed'>>({});

  // Matrix table filtering & search
  const [matrixFilter, setMatrixFilter] = useState<'All' | 'Matched' | 'Missing' | 'Additional'>('All');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [expandedEvidenceSkill, setExpandedEvidenceSkill] = useState<string | null>(null);

  const summary = result.summary;

  // Toggle user claim for missing skills
  const toggleUserPossessed = (skillName: string) => {
    setUserConfirmedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  // Toggle decision for uncertain match
  const handleUncertainDecision = (skillName: string, decision: 'verified' | 'dismissed') => {
    setUncertainDecisions((prev) => ({
      ...prev,
      [skillName]: decision,
    }));
  };

  // Filter matrix rows
  const filteredMatrix = result.comparison_matrix.filter((row) => {
    const matchesFilter =
      matrixFilter === 'All'
        ? true
        : matrixFilter === 'Matched'
        ? row.status === 'Matched'
        : matrixFilter === 'Missing'
        ? row.status === 'Missing'
        : row.status === 'Additional';

    const matchesSearch =
      matrixSearch === '' ||
      row.skill.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      row.category.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      row.resume_evidence.toLowerCase().includes(matrixSearch.toLowerCase()) ||
      row.job_evidence.toLowerCase().includes(matrixSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Skill', 'Category', 'Status', 'Resume Evidence', 'Job Requirement Evidence'];
    const rows = result.comparison_matrix.map((r) => [
      `"${r.skill.replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.resume_evidence.replace(/"/g, '""')}"`,
      `"${r.job_evidence.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkillBridge_Analysis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const exportData = {
      product: 'SkillBridge AI',
      generated_at: new Date().toISOString(),
      summary: result.summary,
      matched_skills: result.matched_skills,
      missing_skills: result.missing_skills,
      additional_skills: result.additional_skills,
      user_verified_skills: userConfirmedSkills,
      method: result.method,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `SkillBridge_Analysis_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '90vh' }}>
      <div className="container" style={{ paddingBottom: '90px' }}>
        {/* Results Header with Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div className="glowing-badge" style={{ marginBottom: '10px' }}>
              <span>EXPLAINABLE ANALYSIS REPORT</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Skill Intelligence Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Evidence-based evaluation of resume skills against target job specifications.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }} className="no-print">
            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
              <FileSpreadsheet size={15} color="#34D399" />
              <span>Export CSV</span>
            </button>
            <button onClick={handleExportJSON} className="btn btn-secondary btn-sm">
              <FileCode size={15} color="#00CFFF" />
              <span>Export JSON</span>
            </button>
            <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
              <Printer size={15} />
              <span>Print Results</span>
            </button>
            <button onClick={onAnalyzeAnother} className="btn btn-primary btn-sm">
              <RotateCcw size={15} />
              <span>Analyze Another</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            A. SUMMARY CARDS & EXPLAINABLE GAUGE
            ==================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Overlap Score Gauge */}
          <ScoreGauge
            percentage={summary.skill_overlap_percentage}
            matchedCount={summary.matched_skills_count}
            totalRequired={summary.total_job_required_skills}
            status={summary.score_status}
            message={summary.score_message}
          />

          {/* KPI Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
            }}
          >
            {/* KPI 1: Total Resume Skills */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Resume Skills
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00CFFF', fontFamily: 'var(--font-mono)' }}>
                {summary.total_resume_skills}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Identified in document</div>
            </div>

            {/* KPI 2: Total Job Required */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Job Required
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#795BFF', fontFamily: 'var(--font-mono)' }}>
                {summary.total_job_required_skills}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Target requirements</div>
            </div>

            {/* KPI 3: Matched Skills */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Matched Skills
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34D399', fontFamily: 'var(--font-mono)' }}>
                {summary.matched_skills_count}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Directly verified</div>
            </div>

            {/* KPI 4: Missing Skills */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Missing in Doc
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FB7185', fontFamily: 'var(--font-mono)' }}>
                {summary.missing_skills_count}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#fda4af' }}>Not detected in resume</div>
            </div>

            {/* KPI 5: Additional Skills */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Additional Skills
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#438BFF', fontFamily: 'var(--font-mono)' }}>
                {summary.additional_skills_count}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#93c5fd' }}>Candidate extra strengths</div>
            </div>

            {/* KPI 6: Uncertain Matches */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Uncertain Matches
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FBBF24', fontFamily: 'var(--font-mono)' }}>
                {summary.uncertain_matches_count}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#fde047' }}>Flagged for inspection</div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            B. METHOD COMPARISON METRICS (If compare_both was selected)
            ==================================================================== */}
        {result.method_comparison && (
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid rgba(67, 139, 255, 0.35)',
              background: 'rgba(7, 19, 41, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={18} color="#00CFFF" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Extraction Method Comparison: Keyword Baseline vs NLP-Assisted
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ padding: '12px 16px', background: 'rgba(3, 7, 18, 0.6)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Keyword Overlap Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00CFFF' }}>
                  {result.method_comparison.keyword_overlap}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Latency: {result.method_comparison.keyword_duration_ms} ms
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(3, 7, 18, 0.6)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>NLP-Assisted Overlap Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#795BFF' }}>
                  {result.method_comparison.nlp_overlap}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Latency: {result.method_comparison.nlp_duration_ms} ms
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: 'rgba(3, 7, 18, 0.6)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Agreed Matches</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>
                  {result.method_comparison.skills_matched_by_both.length} skills
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Detected by both pipelines</div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              <strong>Agreement:</strong> Both methods identified{' '}
              <span style={{ color: '#34D399' }}>{result.method_comparison.skills_matched_by_both.join(', ')}</span>.
              {result.method_comparison.skills_only_in_nlp.length > 0 && (
                <span>
                  {' '}
                  NLP identified contextual mentions for:{' '}
                  <span style={{ color: '#795BFF' }}>{result.method_comparison.skills_only_in_nlp.join(', ')}</span>.
                </span>
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            C. MATCHED SKILLS PANEL (Dedicated Panel)
            ==================================================================== */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(52, 211, 153, 0.15)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Matched Skills ({result.matched_skills.length})
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Requirements detected in both the candidate resume and the job description
                </div>
              </div>
            </div>
          </div>

          {result.matched_skills.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              No overlapping skills were detected between the resume and job requirements.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px',
              }}
            >
              {result.matched_skills.map((item) => (
                <div
                  key={item.skill}
                  className="glass-card"
                  style={{
                    padding: '18px',
                    border: '1px solid rgba(52, 211, 153, 0.25)',
                    background: 'rgba(11, 18, 32, 0.75)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                        {item.skill}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#94a3b8',
                          background: 'rgba(148, 163, 184, 0.12)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.category}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#34d399',
                        background: 'rgba(52, 211, 153, 0.15)',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontWeight: 600,
                      }}
                    >
                      {Math.round(item.confidence * 100)}% Conf
                    </span>
                  </div>

                  {/* Evidence Snippet from Resume */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Resume Evidence:
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#cbd5e1',
                        fontStyle: 'italic',
                        background: 'rgba(3, 7, 18, 0.5)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        borderLeft: '2px solid #34D399',
                        marginTop: '3px',
                      }}
                    >
                      "{item.resume_evidence}"
                    </div>
                  </div>

                  {/* Evidence from Job Description */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Job Requirement:
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                        background: 'rgba(3, 7, 18, 0.4)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        borderLeft: '2px solid #795BFF',
                        marginTop: '3px',
                      }}
                    >
                      "{item.job_evidence}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ====================================================================
            D. MISSING SKILLS PANEL (With Disclaimer & User Confirmation)
            ==================================================================== */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(251, 113, 133, 0.15)',
                  color: '#fb7185',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Not Detected in Resume ({result.missing_skills.length})
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Target job requirements that were not identified in the provided document
                </div>
              </div>
            </div>
          </div>

          {/* Ethical Disclaimer Notice */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(251, 191, 36, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              fontSize: '0.82rem',
              color: '#fde047',
              marginBottom: '20px',
              lineHeight: 1.5,
            }}
          >
            <strong>Note on Missing Skills:</strong> "Not detected" means this exact skill name or canonical alias was not identified in the provided document. It may still be part of your actual experience but omitted or worded differently in your resume. You may toggle the checkbox if you possess this experience.
          </div>

          {result.missing_skills.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#34d399', fontSize: '0.9rem' }}>
              Exceptional match: All identifiable job requirements were detected in your resume!
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {result.missing_skills.map((item) => {
                const isClaimed = userConfirmedSkills[item.skill];
                return (
                  <div
                    key={item.skill}
                    className="glass-card"
                    style={{
                      padding: '16px',
                      border: `1px solid ${isClaimed ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 113, 133, 0.25)'}`,
                      background: isClaimed ? 'rgba(52, 211, 153, 0.06)' : 'rgba(11, 18, 32, 0.75)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                          {item.skill}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono)',
                            color: '#94a3b8',
                            background: 'rgba(148, 163, 184, 0.12)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* User toggle button */}
                      <button
                        onClick={() => toggleUserPossessed(item.skill)}
                        style={{
                          background: isClaimed ? 'rgba(52, 211, 153, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                          border: `1px solid ${isClaimed ? '#34d399' : 'rgba(148, 163, 184, 0.3)'}`,
                          color: isClaimed ? '#34d399' : '#94a3b8',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        {isClaimed ? <Check size={12} /> : null}
                        <span>{isClaimed ? 'Possessed (Self-Reported)' : 'I have this skill'}</span>
                      </button>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                      <strong>Job Requirement:</strong> "{item.job_evidence}"
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Recommended Action: Consider highlighting relevant projects or coursework if experienced.
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ====================================================================
            E. ADDITIONAL RESUME SKILLS (Candidate Strengths)
            ==================================================================== */}
        {result.additional_skills.length > 0 && (
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(67, 139, 255, 0.15)',
                  color: '#438bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Additional Resume Skills ({result.additional_skills.length})
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Valuable candidate competencies identified in the resume that were not explicitly listed in the job post
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.additional_skills.map((item) => (
                <div
                  key={item.skill}
                  className="skill-tag skill-tag-additional"
                  style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                >
                  <span>{item.skill}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>({item.category})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            F. UNCERTAIN MATCHES (Human in the Loop)
            ==================================================================== */}
        {result.uncertain_matches.length > 0 && (
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HelpCircle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Uncertain Matches ({result.uncertain_matches.length})
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Acronyms or shorthand terms flagged for human verification to prevent false-positive assumptions
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.uncertain_matches.map((item) => {
                const decision = uncertainDecisions[item.skill];
                return (
                  <div
                    key={item.skill}
                    className="glass-card"
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#fde047' }}>{item.skill}</span>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          (Matched phrase: "{item.matched_text || item.skill}")
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '4px' }}>
                        "{item.evidence}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleUncertainDecision(item.skill, 'verified')}
                        style={{
                          background: decision === 'verified' ? '#34d399' : 'rgba(52, 211, 153, 0.15)',
                          border: '1px solid rgba(52, 211, 153, 0.4)',
                          color: decision === 'verified' ? '#030712' : '#34d399',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Confirm Match
                      </button>
                      <button
                        onClick={() => handleUncertainDecision(item.skill, 'dismissed')}
                        style={{
                          background: decision === 'dismissed' ? '#fb7185' : 'rgba(251, 113, 133, 0.15)',
                          border: '1px solid rgba(251, 113, 133, 0.4)',
                          color: decision === 'dismissed' ? '#030712' : '#fb7185',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            G. SKILL COMPARISON MATRIX TABLE (Filterable & Sortable)
            ==================================================================== */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Skill Comparison Matrix</h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Complete line-item breakdown of document presence vs target requirement
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Search input */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  placeholder="Filter matrix..."
                  style={{
                    background: 'rgba(3, 7, 18, 0.7)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '6px',
                    padding: '6px 10px 6px 30px',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              </div>

              {/* Status pills */}
              {(['All', 'Matched', 'Missing', 'Additional'] as const).map((filterOpt) => (
                <button
                  key={filterOpt}
                  onClick={() => setMatrixFilter(filterOpt)}
                  style={{
                    background: matrixFilter === filterOpt ? 'rgba(0, 207, 255, 0.2)' : 'rgba(15, 25, 45, 0.6)',
                    border: matrixFilter === filterOpt ? '1px solid rgba(0, 207, 255, 0.4)' : '1px solid rgba(148, 163, 184, 0.15)',
                    color: matrixFilter === filterOpt ? '#42e8ff' : '#94a3b8',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {filterOpt}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8' }}>
                  <th style={{ padding: '12px 14px' }}>SKILL</th>
                  <th style={{ padding: '12px 14px' }}>CATEGORY</th>
                  <th style={{ padding: '12px 14px' }}>RESUME EVIDENCE</th>
                  <th style={{ padding: '12px 14px' }}>JOB REQUIREMENT</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatrix.map((row, idx) => {
                  const isExpanded = expandedEvidenceSkill === row.skill;
                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#f8fafc' }}>
                        {row.skill}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                        {row.category}
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: '280px', color: '#cbd5e1' }}>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: isExpanded ? 'normal' : 'nowrap',
                          }}
                        >
                          {row.resume_evidence}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: '280px', color: '#94a3b8' }}>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: isExpanded ? 'normal' : 'nowrap',
                          }}
                        >
                          {row.job_evidence}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          className={`skill-tag ${
                            row.status === 'Matched'
                              ? 'skill-tag-matched'
                              : row.status === 'Missing'
                              ? 'skill-tag-missing'
                              : 'skill-tag-additional'
                          }`}
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        >
                          {row.status === 'Matched' ? 'Matched' : row.status === 'Missing' ? 'Not Detected' : 'Additional'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ====================================================================
            H. VISUALIZATIONS (Category Breakdown)
            ==================================================================== */}
        <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <BarChart2 size={18} color="#00CFFF" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Skill Category Distribution & Requirement Coverage
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {result.category_breakdown.map((cat) => {
              const total = cat.total_required || 1;
              const pct = Math.round((cat.matched / total) * 100);
              return (
                <div key={cat.category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{cat.category}</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {cat.matched} of {cat.total_required} required matched ({pct}%) • {cat.additional} extra
                    </span>
                  </div>

                  <div
                    style={{
                      height: '8px',
                      borderRadius: '4px',
                      background: 'rgba(148, 163, 184, 0.15)',
                      overflow: 'hidden',
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #34D399, #00CFFF)',
                        height: '100%',
                      }}
                    />
                    <div
                      style={{
                        width: `${100 - pct}%`,
                        background: cat.missing > 0 ? 'rgba(251, 113, 133, 0.4)' : 'transparent',
                        height: '100%',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation CTAs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
          className="no-print"
        >
          <button onClick={onAnalyzeAnother} className="btn btn-secondary">
            <RotateCcw size={16} />
            <span>Analyze Another Resume</span>
          </button>

          <button onClick={() => setActiveTab('evaluation')} className="btn btn-primary">
            <span>View Academic Benchmark & Evaluation</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
