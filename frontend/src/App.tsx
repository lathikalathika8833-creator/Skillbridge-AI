import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ResultsPage } from './pages/ResultsPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { TaxonomyPage } from './pages/TaxonomyPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AnalysisResult } from './types';
import { checkBackendHealth } from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);

  // Active analysis results
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentResumeText, setCurrentResumeText] = useState<string>('');
  const [currentJobText, setCurrentJobText] = useState<string>('');

  // Sample preselection handles
  const [preselectedResumeKey, setPreselectedResumeKey] = useState<string | undefined>();
  const [preselectedJobKey, setPreselectedJobKey] = useState<string | undefined>();

  // Check backend health on initial mount
  useEffect(() => {
    checkBackendHealth().then((healthy) => setIsBackendHealthy(healthy));
    const interval = setInterval(() => {
      checkBackendHealth().then((healthy) => setIsBackendHealthy(healthy));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigateToWorkspace = (sampleResumeKey?: string, sampleJobKey?: string) => {
    setPreselectedResumeKey(sampleResumeKey);
    setPreselectedJobKey(sampleJobKey);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = (result: AnalysisResult, resumeTxt: string, jobTxt: string) => {
    setAnalysisResult(result);
    setCurrentResumeText(resumeTxt);
    setCurrentJobText(jobTxt);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Cinematic Futuristic Atmospheric Background */}
      <div className="cinematic-bg">
        <div className="cyber-grid" />
        <div className="radial-glow-cyan" />
        <div className="radial-glow-violet" />
        <div className="radial-glow-bottom" />
      </div>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab === 'results' ? 'analyze' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isBackendHealthy={isBackendHealthy}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {activeTab === 'home' && (
          <HomePage
            onNavigateToWorkspace={handleNavigateToWorkspace}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HomePage
            onNavigateToWorkspace={handleNavigateToWorkspace}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'analyze' && (
          <WorkspacePage
            onAnalysisComplete={handleAnalysisComplete}
            preselectedResumeKey={preselectedResumeKey}
            preselectedJobKey={preselectedJobKey}
          />
        )}

        {activeTab === 'results' && analysisResult && (
          <ResultsPage
            result={analysisResult}
            resumeText={currentResumeText}
            jobText={currentJobText}
            onAnalyzeAnother={() => {
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onModifyJob={() => {
              setActiveTab('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'evaluation' && <EvaluationPage />}

        {activeTab === 'taxonomy' && <TaxonomyPage />}

        {activeTab === 'privacy' && <PrivacyPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
