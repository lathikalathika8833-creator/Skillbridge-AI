import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Menu, X, Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBackendHealthy: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isBackendHealthy }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'analyze', label: 'Analyze' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'taxonomy', label: 'Taxonomy' },
    { id: 'privacy', label: 'Privacy' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030712]/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{
        paddingTop: isScrolled ? '12px' : '18px',
        paddingBottom: isScrolled ? '12px' : '18px',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
          }}
          aria-label="SkillBridge AI Home"
        >
          <div
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00cfff, #795bff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 207, 255, 0.45)',
            }}
          >
            <Cpu size={22} color="#030712" strokeWidth={2.5} />
            <div
              style={{
                position: 'absolute',
                inset: '-2px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 207, 255, 0.6)',
                pointerEvents: 'none',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                Skill<span className="gradient-text">Bridge</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(0, 207, 255, 0.15)',
                  color: '#42e8ff',
                  border: '1px solid rgba(0, 207, 255, 0.3)',
                }}
              >
                AI
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.02em' }}>
              Career Intelligence
            </div>
          </div>
        </button>

        {/* Center Desktop Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(11, 18, 32, 0.75)',
            padding: '4px 6px',
            borderRadius: '9999px',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            backdropFilter: 'blur(8px)',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(0, 207, 255, 0.18), rgba(121, 91, 255, 0.22))' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 207, 255, 0.35)' : '1px solid transparent',
                  color: isActive ? '#42e8ff' : '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 14px rgba(0, 207, 255, 0.2)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Health indicator */}
          <div
            title={isBackendHealthy ? 'FastAPI Backend Online' : 'Local Fallback Engine Active'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: isBackendHealthy ? '#34d399' : '#fbbf24',
              background: isBackendHealthy ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: `1px solid ${isBackendHealthy ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
            }}
            className="backend-badge"
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isBackendHealthy ? '#34d399' : '#fbbf24',
                boxShadow: `0 0 6px ${isBackendHealthy ? '#34d399' : '#fbbf24'}`,
              }}
            />
            <span>{isBackendHealthy ? 'API Active' : 'Offline Ready'}</span>
          </div>

          <button
            onClick={() => handleNavClick('analyze')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Launch Analyzer</span>
            <ArrowUpRight size={15} />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(15, 25, 45, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              padding: '8px',
              color: '#f8fafc',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(7, 19, 41, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              style={{
                background: activeTab === link.id ? 'rgba(0, 207, 255, 0.15)' : 'transparent',
                border: activeTab === link.id ? '1px solid rgba(0, 207, 255, 0.4)' : 'none',
                color: activeTab === link.id ? '#00cfff' : '#cbd5e1',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('analyze')}
            className="btn btn-primary"
            style={{ marginTop: '10px', width: '100%' }}
          >
            Launch Analyzer
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .backend-badge { display: none !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
