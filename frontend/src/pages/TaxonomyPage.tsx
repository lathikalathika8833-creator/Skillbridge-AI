import React, { useState, useEffect } from 'react';
import { Search, Filter, Layers, BookOpen, CheckCircle, Code, ShieldCheck, ChevronRight } from 'lucide-react';
import { TaxonomySkillMeta } from '../types';
import { fetchSkillsTaxonomyApi } from '../api';

export const TaxonomyPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [skills, setSkills] = useState<Record<string, TaxonomySkillMeta>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<TaxonomySkillMeta | null>(null);

  useEffect(() => {
    fetchSkillsTaxonomyApi().then((data) => {
      setCategories(data.categories);
      setSkills(data.skills);
      const firstKey = Object.keys(data.skills)[0];
      if (firstKey) setSelectedSkill(data.skills[firstKey]);
    });
  }, []);

  const skillList = Object.values(skills);

  const filteredSkills = skillList.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      s.canonical.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ paddingTop: '100px', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1150px', paddingBottom: '90px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div className="glowing-badge" style={{ marginBottom: '10px' }}>
            <span>TRANSPARENT ARCHITECTURE</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Curated Skill Taxonomy Explorer
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '700px' }}>
            Inspect every supported canonical skill, recognized real-world aliases, boundary constraints, and anti-pattern disambiguation rules.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div
          className="glass-panel"
          style={{
            padding: '20px 24px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search taxonomy by skill name, alias, or description (e.g. Python, JS, K8s, Pandas)..."
              style={{
                width: '100%',
                background: 'rgba(3, 7, 18, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                borderRadius: '8px',
                padding: '12px 14px 12px 38px',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                background: selectedCategory === 'All' ? 'rgba(0, 207, 255, 0.2)' : 'rgba(15, 25, 45, 0.6)',
                border: selectedCategory === 'All' ? '1px solid #00CFFF' : '1px solid rgba(148, 163, 184, 0.2)',
                color: selectedCategory === 'All' ? '#00CFFF' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All Categories ({skillList.length})
            </button>
            {categories.map((cat) => {
              const count = skillList.filter((s) => s.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: isSelected ? 'rgba(0, 207, 255, 0.2)' : 'rgba(15, 25, 45, 0.6)',
                    border: isSelected ? '1px solid #00CFFF' : '1px solid rgba(148, 163, 184, 0.2)',
                    color: isSelected ? '#00CFFF' : '#94a3b8',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Skill List Column */}
          <div
            style={{
              maxHeight: '680px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingRight: '6px',
            }}
          >
            {filteredSkills.map((s) => {
              const isSelected = selectedSkill?.canonical === s.canonical;
              return (
                <div
                  key={s.canonical}
                  onClick={() => setSelectedSkill(s)}
                  className="glass-card"
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #00CFFF' : '1px solid rgba(148, 163, 184, 0.16)',
                    background: isSelected ? 'rgba(0, 207, 255, 0.08)' : 'rgba(11, 18, 32, 0.7)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? '#42e8ff' : '#f8fafc' }}>
                      {s.canonical}
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#94a3b8',
                        background: 'rgba(148, 163, 184, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {s.category}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span>Aliases:</span>
                    <span style={{ color: '#cbd5e1' }}>
                      {s.aliases.length > 0 ? s.aliases.slice(0, 3).join(', ') : 'Exact canonical only'}
                      {s.aliases.length > 3 ? '...' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill Detail Inspector Column */}
          {selectedSkill && (
            <div
              className="glass-panel"
              style={{
                padding: '30px',
                border: '1px solid rgba(0, 207, 255, 0.35)',
                position: 'sticky',
                top: '120px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#00cfff',
                    background: 'rgba(0, 207, 255, 0.12)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 207, 255, 0.25)',
                  }}
                >
                  {selectedSkill.category}
                </span>

                {selectedSkill.soft_skill ? (
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Soft Skill (Explicitly Supported)</span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Technical Skill</span>
                )}
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
                {selectedSkill.canonical}
              </h2>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedSkill.description}
              </p>

              {/* Aliases */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', marginBottom: '8px' }}>
                  RECOGNIZED ALIASES & SHORTHAND:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedSkill.aliases.length > 0 ? (
                    selectedSkill.aliases.map((a) => (
                      <span
                        key={a}
                        style={{
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(15, 25, 45, 0.8)',
                          color: '#42e8ff',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(0, 207, 255, 0.2)',
                        }}
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>None (Exact word match required)</span>
                  )}
                </div>
              </div>

              {/* Regex Matching Rule */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', marginBottom: '8px' }}>
                  DETERMINISTIC REGEX BOUNDARY RULE:
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#34d399',
                    background: 'rgba(3, 7, 18, 0.8)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(52, 211, 153, 0.25)',
                    overflowX: 'auto',
                  }}
                >
                  {selectedSkill.regex}
                </div>
              </div>

              {/* Anti-Patterns */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', marginBottom: '8px' }}>
                  STRICT ANTI-PATTERNS (FALSE-POSITIVE SHIELD):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedSkill.anti_patterns.length > 0 ? (
                    selectedSkill.anti_patterns.map((ap) => (
                      <span
                        key={ap}
                        style={{
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(251, 113, 133, 0.1)',
                          color: '#fda4af',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid rgba(251, 113, 133, 0.3)',
                        }}
                      >
                        Avoid: "{ap}"
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Standard boundary guards applied</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
