import React from 'react';
import { ArrowUp, Code2, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <Code2 size={20} />
            </div>
            <span className="footer-brand-name">Tomas Hailay</span>
          </div>

          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <button onClick={scrollToTop} className="scroll-top-btn" title="Back to Top">
            <ArrowUp size={18} />
          </button>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Tomas Hailay. Built with React &amp; Modern Web Tech.
          </p>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #031017;
          border-top: 1px solid var(--border-glass);
          padding: 3rem 0 2rem;
          color: var(--text-muted);
        }

        .footer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-main);
        }

        .footer-logo {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          list-style: none;
        }

        .footer-links a {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .footer-links a:hover {
          color: var(--accent-cyan);
        }

        .scroll-top-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .scroll-top-btn:hover {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: translateY(-4px);
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        .footer-bottom {
          padding-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-subtle);
        }

        @media (max-width: 640px) {
          .footer-top {
            flex-direction: column;
            text-align: center;
          }
          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
