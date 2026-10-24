import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { ExtractionMethod, AnalysisResult, SampleResume, SampleJob } from '../types';
import { analyzeSkillsApi, uploadResumeDocument, fetchSampleDataApi } from '../api';

interface WorkspacePageProps {
  onAnalysisComplete: (result: AnalysisResult, resumeTxt: string, jobTxt: string) => void;
  preselectedResumeKey?: string;
  preselectedJobKey?: string;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  onAnalysisComplete,
  preselectedResumeKey,
  preselectedJobKey,
}) => {
  // Input states
  const [activeResumeTab, setActiveResumeTab] = useState<'upload' | 'paste'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [method, setMethod] = useState<ExtractionMethod>('keyword');

  // File upload states
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample data states
  const [samples, setSamples] = useState<{ sample_resumes: Record<string, SampleResume>; sample_jobs: Record<string, SampleJob> } | null>(null);
  const [selectedSampleResume, setSelectedSampleResume] = useState<string>('');
  const [selectedSampleJob, setSelectedSampleJob] = useState<string>('');

  // Processing sequence states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processingSteps = [
    'Reading document...',
    'Extracting skill mentions...',
    'Normalizing skill names...',
    'Analyzing job requirements...',
    'Calculating skill overlap...',
    'Preparing your results...',
  ];

  // Fetch samples on load
  useEffect(() => {
    fetchSampleDataApi().then((data) => {
      setSamples(data);
      if (preselectedResumeKey && data.sample_resumes[preselectedResumeKey]) {
        setResumeText(data.sample_resumes[preselectedResumeKey].text);
        setSelectedSampleResume(preselectedResumeKey);
        setActiveResumeTab('paste');
      } else if (!resumeText && data.sample_resumes['data_analyst']) {
        // Default to data analyst sample if empty
        setResumeText(data.sample_resumes['data_analyst'].text);
        setSelectedSampleResume('data_analyst');
      }

      if (preselectedJobKey && data.sample_jobs[preselectedJobKey]) {
        setJobText(data.sample_jobs[preselectedJobKey].text);
        setSelectedSampleJob(preselectedJobKey);
      } else if (!jobText && data.sample_jobs['data_analyst_job']) {
        setJobText(data.sample_jobs['data_analyst_job'].text);
        setSelectedSampleJob('data_analyst_job');
      }
    });
  }, [preselectedResumeKey, preselectedJobKey]);

  // Handle file drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage(`Unsupported file format '${file.name}'. Please upload a PDF, DOCX, or TXT document.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setUploadWarning(null);

    try {
      const res = await uploadResumeDocument(file);
      setResumeText(res.text);
      setUploadedFile({ name: file.name, size: file.size });
      if (res.warning) {
        setUploadWarning(res.warning);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse the uploaded document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setResumeText('');
    setUploadWarning(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Run the 4-step analysis workflow with realistic progress sequence
  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setErrorMessage('Please upload a resume or paste your resume text to begin.');
      return;
    }
    if (!jobText.trim() || jobText.trim().length < 20) {
      setErrorMessage('Please provide a complete job description with required skills (at least 20 characters).');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisStepIndex(0);

    // Realistic multi-stage progress progression
    const stepInterval = setInterval(() => {
      setAnalysisStepIndex((prev) => {
        if (prev < processingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 280);

    try {
      const result = await analyzeSkillsApi(resumeText, jobText, method);
      clearInterval(stepInterval);
      setAnalysisStepIndex(processingSteps.length - 1);
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete(result, resumeText, jobText);
      }, 350);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setErrorMessage(err.message || 'An error occurred during skill analysis.');
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1100px', paddingBottom: '80px' }}>
        {/* Workspace Title Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="glowing-badge" style={{ marginBottom: '12px' }}>
            <span>INTELLIGENT WORKSPACE</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Resume Skill Extractor & Job Matcher
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
            Configure your resume document, paste the target job description, select your extraction method, and calculate transparent skill overlap.
          </p>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(251, 113, 133, 0.12)',
              border: '1px solid rgba(251, 113, 133, 0.35)',
              color: '#fda4af',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              fontSize: '0.9rem',
            }}
          >
            <AlertCircle size={20} color="#FB7185" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* ================================================================
              STEP 1: CHOOSE RESUME INPUT
              ================================================================ */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(0, 207, 255, 0.15)',
                    color: '#00cfff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                >
                  01
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Choose Resume Input</h2>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Upload PDF or DOCX file, or paste your resume text
                  </div>
                </div>
              </div>

              {/* Input mode toggle */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(3, 7, 18, 0.7)',
                  padding: '4px',
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                }}
              >
                <button
                  onClick={() => setActiveResumeTab('upload')}
                  style={{
                    background: activeResumeTab === 'upload' ? 'rgba(0, 207, 255, 0.2)' : 'transparent',
                    border: activeResumeTab === 'upload' ? '1px solid rgba(0, 207, 255, 0.4)' : '1px solid transparent',
                    color: activeResumeTab === 'upload' ? '#00cfff' : '#94a3b8',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setActiveResumeTab('paste')}
                  style={{
                    background: activeResumeTab === 'paste' ? 'rgba(0, 207, 255, 0.2)' : 'transparent',
                    border: activeResumeTab === 'paste' ? '1px solid rgba(0, 207, 255, 0.4)' : '1px solid transparent',
                    color: activeResumeTab === 'paste' ? '#00cfff' : '#94a3b8',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Quick Sample Selector */}
            {samples && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginBottom: '20px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(3, 7, 18, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FolderOpen size={14} /> Quick Synthetic Resumes:
                </span>
                {Object.entries(samples.sample_resumes).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setResumeText(item.text);
                      setSelectedSampleResume(key);
                      setUploadedFile(null);
                      setUploadWarning(null);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: selectedSampleResume === key ? 'rgba(0, 207, 255, 0.15)' : 'rgba(15, 25, 45, 0.6)',
                      border: selectedSampleResume === key ? '1px solid rgba(0, 207, 255, 0.4)' : '1px solid rgba(148, 163, 184, 0.15)',
                      color: selectedSampleResume === key ? '#42e8ff' : '#cbd5e1',
                      fontSize: '0.76rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {item.title.split('—')[1]?.trim() || item.title}
                  </button>
                ))}
              </div>
            )}

            {/* Upload Zone */}
            {activeResumeTab === 'upload' ? (
              <div>
                {!uploadedFile ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragActive ? '#00CFFF' : 'rgba(148, 163, 184, 0.25)'}`,
                      borderRadius: '12px',
                      padding: '40px 20px',
                      textAlign: 'center',
                      background: dragActive ? 'rgba(0, 207, 255, 0.06)' : 'rgba(3, 7, 18, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'rgba(0, 207, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00cfff',
                        margin: '0 auto 16px',
                      }}
                    >
                      {isUploading ? <RefreshCw size={24} className="animate-spin" /> : <Upload size={24} />}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                      {isUploading ? 'Parsing document text...' : 'Drag & drop your resume file here'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '12px' }}>
                      Supports PDF, DOCX, or plain TXT up to 10MB
                    </div>
                    <span className="btn btn-secondary btn-sm" style={{ pointerEvents: 'none' }}>
                      Browse Files
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '16px 20px',
                      borderRadius: '10px',
                      background: 'rgba(3, 7, 18, 0.7)',
                      border: '1px solid rgba(0, 207, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: 'rgba(0, 207, 255, 0.15)',
                          color: '#00cfff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f8fafc' }}>
                          {uploadedFile.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {(uploadedFile.size / 1024).toFixed(1)} KB • {resumeText.length.toLocaleString()} characters extracted
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={removeUploadedFile}
                      style={{
                        background: 'rgba(251, 113, 133, 0.15)',
                        border: '1px solid rgba(251, 113, 133, 0.3)',
                        color: '#fb7185',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}

                {uploadWarning && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(251, 191, 36, 0.12)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      color: '#fde047',
                      fontSize: '0.82rem',
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{uploadWarning}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste candidate resume text here (experience, skills, projects, tools, frameworks)..."
                  style={{
                    width: '100%',
                    minHeight: '180px',
                    background: 'rgba(3, 7, 18, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                  <span>Character count: {resumeText.length.toLocaleString()}</span>
                  <button
                    onClick={() => setResumeText('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Clear text
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================
              STEP 2: ENTER JOB DESCRIPTION
              ================================================================ */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(121, 91, 255, 0.15)',
                    color: '#795bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                  }}
                >
                  02
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Enter Target Job Description</h2>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Paste the job description including required skills, tools, and qualifications
                  </div>
                </div>
              </div>

              {/* Sample job selector */}
              {samples && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Load Sample Role:</span>
                  {Object.entries(samples.sample_jobs).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setJobText(item.text);
                        setSelectedSampleJob(key);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: selectedSampleJob === key ? 'rgba(121, 91, 255, 0.2)' : 'rgba(15, 25, 45, 0.6)',
                        border: selectedSampleJob === key ? '1px solid rgba(121, 91, 255, 0.4)' : '1px solid rgba(148, 163, 184, 0.15)',
                        color: selectedSampleJob === key ? '#a78bfa' : '#cbd5e1',
                        fontSize: '0.74rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {item.title.split('—')[0]?.trim()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the job description here, including required skills, tools, technologies, and qualifications..."
              style={{
                width: '100%',
                minHeight: '160px',
                background: 'rgba(3, 7, 18, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '10px',
                padding: '14px 16px',
                color: '#f8fafc',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
              <span>Character count: {jobText.length.toLocaleString()}</span>
              <button
                onClick={() => setJobText('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear text
              </button>
            </div>
          </div>

          {/* ================================================================
              STEP 3: CONFIGURE EXTRACTION METHOD
              ================================================================ */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
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
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                }}
              >
                03
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Configure Analysis Pipeline</h2>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Choose deterministic baseline, contextual NLP, or side-by-side comparison
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
              {/* Option 1: Keyword Baseline */}
              <div
                onClick={() => setMethod('keyword')}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: method === 'keyword' ? 'rgba(0, 207, 255, 0.1)' : 'rgba(3, 7, 18, 0.5)',
                  border: `1px solid ${method === 'keyword' ? 'rgba(0, 207, 255, 0.5)' : 'rgba(148, 163, 184, 0.15)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#f8fafc' }}>
                    Keyword Baseline
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(52, 211, 153, 0.15)',
                      color: '#34d399',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    RECOMMENDED BASELINE
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Deterministic taxonomy matching with strict word boundary checks and anti-pattern filters (e.g. Java vs JavaScript). Fast, fully transparent, zero hallucination risk.
                </p>
              </div>

              {/* Option 2: NLP-Assisted */}
              <div
                onClick={() => setMethod('nlp_assisted')}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: method === 'nlp_assisted' ? 'rgba(121, 91, 255, 0.12)' : 'rgba(3, 7, 18, 0.5)',
                  border: `1px solid ${method === 'nlp_assisted' ? 'rgba(121, 91, 255, 0.5)' : 'rgba(148, 163, 184, 0.15)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#f8fafc' }}>
                    NLP-Assisted Method
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(121, 91, 255, 0.18)',
                      color: '#a78bfa',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    CONTEXTUAL VECTOR
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Contextual n-gram scanning paired with TF-IDF cosine semantic similarity against taxonomy profiles. Calculates continuous confidence scores and flags uncertain shorthand.
                </p>
              </div>

              {/* Option 3: Compare Both */}
              <div
                onClick={() => setMethod('compare_both')}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: method === 'compare_both' ? 'rgba(67, 139, 255, 0.12)' : 'rgba(3, 7, 18, 0.5)',
                  border: `1px solid ${method === 'compare_both' ? 'rgba(67, 139, 255, 0.5)' : 'rgba(148, 163, 184, 0.15)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#f8fafc' }}>
                    Compare Both Methods
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(67, 139, 255, 0.18)',
                      color: '#93c5fd',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    ACADEMIC EVAL
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Executes both extraction pipelines concurrently, highlighting skills identified by both, skills unique to keyword matching, and differences requiring review.
                </p>
              </div>
            </div>
          </div>

          {/* ================================================================
              STEP 4: ANALYZE ACTION & REALISTIC PROGRESS SEQUENCE
              ================================================================ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn btn-primary"
              style={{
                padding: '16px 48px',
                fontSize: '1.1rem',
                minWidth: '240px',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Processing Pipeline...</span>
                </>
              ) : (
                <>
                  <span>Analyze Skills</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Realistic 6-Step Processing Sequence Animation */}
            {isAnalyzing && (
              <div
                className="glass-card"
                style={{
                  width: '100%',
                  maxWidth: '540px',
                  padding: '20px 24px',
                  background: 'rgba(11, 18, 32, 0.95)',
                  border: '1px solid rgba(0, 207, 255, 0.4)',
                  boxShadow: '0 0 30px rgba(0, 207, 255, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#00cfff' }}>
                    {processingSteps[analysisStepIndex]}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                    Step {analysisStepIndex + 1} of {processingSteps.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(148, 163, 184, 0.2)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="shimmer-progress"
                    style={{
                      height: '100%',
                      width: `${((analysisStepIndex + 1) / processingSteps.length) * 100}%`,
                      background: 'linear-gradient(90deg, #00CFFF, #795BFF)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
