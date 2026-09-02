import React, { useState } from 'react';
import { skillsData } from '../data/skillsData';
import { Code, Terminal, Cpu, Layout, Palette, Component, Server, Zap, GitBranch, Database, Globe } from 'lucide-react';

const iconMap = {
  Code,
  Terminal,
  Cpu,
  Layout,
  Palette,
  Component,
  Server,
  Zap,
  GitBranch,
  Database,
  Globe
};

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...skillsData.map((s) => s.category)];

  const displayedSkills = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter((group) => group.category === selectedCategory);

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Core languages, backend frameworks, database management, and version control tools</p>
        </div>

        {/* Category Filter Pills */}
        <div className="skills-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`skill-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Category Groups */}
        <div className="skills-groups">
          {displayedSkills.map((group, groupIdx) => (
            <div key={groupIdx} className="skill-group-card glass-card">
              <h3 className="group-title">{group.category}</h3>

              <div className="skills-grid">
                {group.skills.map((skill, idx) => {
                  const IconComp = iconMap[skill.icon] || Code;
                  return (
                    <div key={idx} className="skill-card">
                      <div className="skill-card-top">
                        <div className="skill-icon-wrapper">
                          <IconComp size={20} className="skill-icon" />
                        </div>
                        <div className="skill-meta">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-level">{skill.level}%</span>
                        </div>
                      </div>

                      <p className="skill-desc">{skill.description}</p>

                      <div className="skill-bar-container">
                        <div
                          className="skill-bar-fill"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .skills-section {
          background: linear-gradient(180deg, rgba(10, 37, 51, 0.4) 0%, transparent 100%);
        }

        .skills-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .skill-tab-btn {
          padding: 0.5rem 1.2rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.875rem;
          transition: var(--transition-normal);
        }

        .skill-tab-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }

        .skill-tab-btn.active {
          background: linear-gradient(135deg, var(--accent-primary), #810f9b);
          border-color: var(--accent-primary);
          color: #ffffff;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .skills-groups {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .skill-group-card {
          padding: 2rem;
        }

        .group-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .skill-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 1.15rem;
          transition: var(--transition-fast);
        }

        .skill-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--border-glass-bright);
          transform: translateY(-2px);
        }

        .skill-card-top {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 0.6rem;
        }

        .skill-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: rgba(162, 32, 191, 0.15);
          border: 1px solid var(--border-glass-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .skill-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .skill-name {
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .skill-level {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-cyan);
        }

        .skill-desc {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
          line-height: 1.4;
        }

        .skill-bar-container {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-cyan));
          border-radius: var(--radius-full);
          transition: width 1s ease-in-out;
        }
      `}</style>
    </section>
  );
}
