import React, { useState, useEffect } from 'react';
import {
  Award,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
  BookOpen,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { BenchmarkReport } from '../types';
import { runEvaluationApi } from '../api';

export const EvaluationPage: React.FC = () => {
  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  const fetchBenchmark = async () => {
    setIsRunningBenchmark(true);
    try {
      const data = await runEvaluationApi();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningBenchmark(false);
    }
  };

  useEffect(() => {
    fetchBenchmark();
  }, []);

  return (
    <div style={{ paddingTop: '100px', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1150px', paddingBottom: '90px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          <div>
            <div className="glowing-badge" style={{ marginBottom: '10px' }}>
              <span>ACADEMIC CAPSTONE EVALUATION</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Model Evaluation & Method Benchmark
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '700px' }}>
              Scientific verification of extraction fidelity comparing the deterministic Keyword Baseline against the contextual NLP-Assisted pipeline across a ground-truth test corpus.
            </p>
          </div>

          <button
            onClick={fetchBenchmark}
            disabled={isRunningBenchmark}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={isRunningBenchmark ? 'animate-spin' : ''} />
            <span>{isRunningBenchmark ? 'Benchmarking...' : 'Re-run Evaluation Benchmark'}</span>
          </button>
        </div>

        {/* ====================================================================
            A. MATHEMATICAL FORMULATION CARDS
            ==================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          {/* Precision Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00CFFF' }}>PRECISION</div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Extraction Accuracy</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#f8fafc',
                background: 'rgba(3, 7, 18, 0.6)',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '10px',
                border: '1px solid rgba(0, 207, 255, 0.25)',
              }}
            >
              Precision = TP / (TP + FP)
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Measures the proportion of predicted skills that are true reference matches. High precision ensures <strong>zero phantom hallucinated skills</strong>.
            </p>
          </div>

          {/* Recall Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#795BFF' }}>RECALL</div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Extraction Coverage</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#f8fafc',
                background: 'rgba(3, 7, 18, 0.6)',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '10px',
                border: '1px solid rgba(121, 91, 255, 0.25)',
              }}
            >
              Recall = TP / (TP + FN)
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Measures the proportion of actual reference skills successfully detected. High recall ensures valid skills are not overlooked due to formatting variations.
            </p>
          </div>

          {/* F1 Score Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399' }}>F1 SCORE</div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Harmonic Mean</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#f8fafc',
                background: 'rgba(3, 7, 18, 0.6)',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '10px',
                border: '1px solid rgba(52, 211, 153, 0.25)',
              }}
            >
              F1 = 2 × (P × R) / (P + R)
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Harmonic mean balancing precision and recall. Handles edge-case zero denominators safely to avoid division by zero errors.
            </p>
          </div>
        </div>

        {/* ====================================================================
            B. COMPARISON TABLE: KEYWORD BASELINE VS NLP-ASSISTED
            ==================================================================== */}
        {report && (
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  Extraction Method Benchmark Results
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Micro-averaged evaluation across {report.dataset_metadata.total_test_samples} synthetic test snippets ({report.dataset_metadata.total_annotated_skills} annotated skills)
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8' }}>
                    <th style={{ padding: '12px 16px' }}>EXTRACTION METHOD</th>
                    <th style={{ padding: '12px 16px' }}>PRECISION</th>
                    <th style={{ padding: '12px 16px' }}>RECALL</th>
                    <th style={{ padding: '12px 16px' }}>F1 SCORE</th>
                    <th style={{ padding: '12px 16px' }}>CONFUSION COUNTS (TP / FP / FN)</th>
                    <th style={{ padding: '12px 16px' }}>MEASURED LATENCY</th>
                    <th style={{ padding: '12px 16px' }}>API COST</th>
                  </tr>
                </thead>
                <tbody>
                  {report.comparison_table.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        background: idx === 0 ? 'rgba(0, 207, 255, 0.03)' : 'rgba(121, 91, 255, 0.03)',
                      }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#f8fafc' }}>{row.method}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{row.type}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00CFFF' }}>
                        {(row.precision * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#795BFF' }}>
                        {(row.recall * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34D399' }}>
                        {(row.f1_score * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        <span style={{ color: '#34D399' }}>TP: {row.true_positives}</span> •{' '}
                        <span style={{ color: '#FB7185' }}>FP: {row.false_positives}</span> •{' '}
                        <span style={{ color: '#FBBF24' }}>FN: {row.false_negatives}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                        {row.duration_ms} ms
                      </td>
                      <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 600 }}>
                        {row.api_cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(3, 7, 18, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                fontSize: '0.82rem',
                color: '#94a3b8',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: '#f8fafc' }}>Benchmark Insights:</strong> The deterministic Keyword Baseline achieves superior precision ({((report.comparison_table[0]?.precision || 0) * 100).toFixed(1)}%) with negligible latency by leveraging strict boundary regex rules. The Contextual NLP pipeline provides enhanced sensitivity ({((report.comparison_table[1]?.recall || 0) * 100).toFixed(1)}% recall) on subtle phrase mentions and n-grams without incurring external API latency or fees.
            </div>
          </div>
        )}

        {/* ====================================================================
            C. ERROR ANALYSIS CATALOG
            ==================================================================== */}
        {report && (
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
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
                <AlertCircle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Categorized Error Analysis & Mitigation
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Systematic examination of common document extraction failure modes and engineering defenses
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {report.error_analysis.map((err, idx) => (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                    {err.category}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '12px' }}>
                    {err.description}
                  </p>

                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      background: 'rgba(3, 7, 18, 0.5)',
                      border: '1px solid rgba(0, 207, 255, 0.2)',
                      fontSize: '0.78rem',
                      color: '#42e8ff',
                      marginBottom: '8px',
                    }}
                  >
                    <strong>Mitigation:</strong> {err.mitigation}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 500 }}>
                    Status: {err.keyword_status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            D. SCIENTIFIC & ETHICAL INTERPRETATION NOTE
            ==================================================================== */}
        <div
          style={{
            padding: '24px 28px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(121, 91, 255, 0.1), rgba(0, 207, 255, 0.08))',
            border: '1px solid rgba(121, 91, 255, 0.35)',
            display: 'flex',
            gap: '18px',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(121, 91, 255, 0.2)',
              color: '#a78bfa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
              Scientific Interpretation of Metrics
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              {report?.academic_interpretation || (
                'Precision, Recall, and F1 quantify document extraction fidelity and taxonomy matching performance. They measure how accurately the algorithm identifies skill tokens from text. They do NOT evaluate candidate qualifications, competence, or workplace potential. SkillBridge AI explicitly rejects automated candidate ranking and rejection.'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
