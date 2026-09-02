import React from 'react';
import { ArrowRight, Mail, Sparkles, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import profileImg from '../assets/Profile.jpg';

export default function Hero() {
  const handleScroll = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        <div className="hero-avatar-wrapper">
          <div className="avatar-glow-ring"></div>
          <img src={profileImg} alt="Tomas Hailay profile" className="hero-photo" />
          <div className="status-badge">
            <span className="status-dot"></span>
            Available for Opportunities
          </div>
        </div>

        <div className="hero-content">
          <div className="tech-badge">
            <Sparkles size={16} className="badge-sparkle" />
            <span>Full-Stack & Backend Developer</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="gradient-name">Tomas Hailay</span>
          </h1>

          <p className="hero-tagline">
            Aspiring Software Developer
          </p>

          <p className="hero-description">
            Passionate about building clean, performant, and user-friendly web applications.
            Specialized in <strong>Python, Django, FastAPI, React, JavaScript</strong>, and <strong>Golang</strong>.
          </p>

          <div className="hero-cta-group">
            <button onClick={() => handleScroll('contact')} className="btn">
              Get In Touch <ArrowRight size={18} />
            </button>
            <button onClick={() => handleScroll('projects')} className="btn btn-secondary">
              Explore Projects
            </button>
          </div>

          <div className="hero-socials">
            <span className="socials-label">Connect with me:</span>
            <div className="social-icons">
              <a
                href="https://github.com/Kestrel-303"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub Profile"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/tomas-hailay-gidey"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="LinkedIn Profile"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href="mailto:tomashailaygidey@gmail.com"
                className="social-link"
                title="Send Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding: 6rem 0 4rem;
          position: relative;
          display: flex;
          align-items: center;
          min-height: calc(100vh - 80px);
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2.5rem;
        }

        .hero-avatar-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .avatar-glow-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
          filter: blur(12px);
          opacity: 0.75;
          animation: pulseGlow 4s ease-in-out infinite alternate;
        }

        @keyframes pulseGlow {
          0% { transform: scale(0.98); opacity: 0.6; }
          100% { transform: scale(1.04); opacity: 0.9; }
        }

        .hero-photo {
          position: relative;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--bg-primary);
          box-shadow: var(--shadow-lg);
        }

        .status-badge {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--border-glass-bright);
          backdrop-filter: blur(10px);
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hero-content {
          max-width: 750px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(162, 32, 191, 0.15);
          border: 1px solid var(--border-glass-bright);
          color: var(--accent-cyan);
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        .badge-sparkle {
          color: var(--accent-primary);
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .gradient-name {
          background: linear-gradient(135deg, #ffffff 30%, var(--accent-primary) 70%, var(--accent-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-tagline {
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--accent-cyan);
          margin-bottom: 1.25rem;
        }

        .hero-description {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 2rem;
          max-width: 640px;
        }

        .hero-description strong {
          color: var(--text-main);
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-socials {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .socials-label {
          font-size: 0.875rem;
          color: var(--text-subtle);
          font-weight: 500;
        }

        .social-icons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .social-link:hover {
          background: rgba(162, 32, 191, 0.2);
          border-color: var(--accent-primary);
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.25rem;
          }
          .hero-tagline {
            font-size: 1.15rem;
          }
          .hero-photo {
            width: 140px;
            height: 140px;
          }
        }
      `}</style>
    </section>
  );
}
