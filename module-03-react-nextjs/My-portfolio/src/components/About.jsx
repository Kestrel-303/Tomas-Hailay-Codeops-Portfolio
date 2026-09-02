import React from 'react';
import { Code, Server, Zap, CheckCircle2, Award, Rocket, Terminal } from 'lucide-react';

export default function About() {
  const pillarCards = [
    {
      icon: <Server className="pillar-icon" size={26} />,
      title: 'Backend Mastery',
      description: 'Robust server architecture using Python (Django & FastAPI) and Golang with clean database models and RESTful APIs.'
    },
    {
      icon: <Code className="pillar-icon" size={26} />,
      title: 'Modern Frontend',
      description: 'Dynamic, accessible, and responsive user interfaces built with React, modern JavaScript (ES6+), and clean CSS.'
    },
    {
      icon: <Zap className="pillar-icon" size={26} />,
      title: 'Problem Solver',
      description: 'Focused on designing efficient software systems that solve real-world operational challenges.'
    }
  ];

  const highlights = [
    'Clean, maintainable, and modular codebase structure',
    'Experience with Django ORM, FastAPI REST specs, and React Hooks',
    'Version control expertise with Git & collaborative GitHub workflows',
    'Continuous learning mindset exploring microservices and cloud tooling'
  ];

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Passionate Full-Stack Developer & Problem Solver</p>
        </div>

        <div className="about-grid">
          {/* Main Bio Glass Card */}
          <div className="about-bio-card glass-card">
            <div className="bio-badge">
              <Terminal size={18} />
              <span>Full-Stack Engineering</span>
            </div>
            
            <p className="bio-lead">
              I am a <strong>Full-Stack Developer</strong> with a strong foundation in building dynamic, responsive, and data-driven web applications.
            </p>

            <p className="bio-text">
              My core technical expertise spans <strong>HTML, CSS, JavaScript, Python, Django, FastAPI</strong>, and <strong>Golang</strong>. I thrive on translating business logic and user needs into clean, intuitive digital products.
            </p>

            <p className="bio-text">
              My ultimate goal is to craft high-impact, user-friendly software systems that solve real-world problems efficiently and reliably.
            </p>

            <div className="highlights-list">
              {highlights.map((item, idx) => (
                <div key={idx} className="highlight-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars Cards */}
          <div className="pillars-grid">
            {pillarCards.map((pillar, idx) => (
              <div key={idx} className="pillar-card glass-card">
                <div className="pillar-icon-box">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.description}</p>
                </div>
              </div>
            ))}

            {/* Quick Stats Banner */}
            <div className="stats-banner glass-card">
              <div className="stat-item">
                <span className="stat-number">3+</span>
                <span className="stat-label">Featured Projects</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">6+</span>
                <span className="stat-label">Core Technologies</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Dedication</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          background: linear-gradient(180deg, transparent 0%, rgba(10, 37, 51, 0.4) 100%);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .about-bio-card {
          padding: 2.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .bio-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-cyan);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .bio-lead {
          font-size: 1.2rem;
          line-height: 1.6;
          color: var(--text-main);
        }

        .bio-text {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.7;
        }

        .bio-text strong {
          color: var(--text-main);
        }

        .highlights-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          color: var(--text-main);
          font-size: 0.925rem;
        }

        .check-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .pillars-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .pillar-card {
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .pillar-icon-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-sm);
          background: rgba(162, 32, 191, 0.15);
          border: 1px solid var(--border-glass-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .pillar-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .pillar-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .stats-banner {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: linear-gradient(135deg, rgba(162, 32, 191, 0.2), rgba(0, 242, 254, 0.1));
          border-color: var(--border-glass-bright);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--accent-cyan);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .stat-divider {
          width: 1px;
          height: 35px;
          background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
