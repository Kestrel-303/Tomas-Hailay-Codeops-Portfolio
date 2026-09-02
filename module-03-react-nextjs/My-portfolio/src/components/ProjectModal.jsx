import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
          <X size={20} />
        </button>

        <div className="modal-header-image">
          <img src={project.image} alt={project.title} />
          <span className="modal-category-tag">{project.categoryName}</span>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{project.title}</h2>

          <p className="modal-full-desc">{project.fullDescription}</p>

          <div className="modal-section">
            <h3 className="modal-section-title">
              <Layers size={18} className="modal-icon" /> Key Features & Architecture
            </h3>
            <ul className="modal-features-list">
              {project.features.map((feature, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Technologies Used</h3>
            <div className="modal-tags">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="modal-tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <GithubIcon size={16} /> Source Code
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(3, 14, 21, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border-color: var(--border-glass-bright);
          box-shadow: var(--shadow-lg), 0 0 30px var(--accent-glow);
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-glass);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .modal-close-btn:hover {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: rotate(90deg);
        }

        .modal-header-image {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .modal-header-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-category-tag {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid var(--border-glass-bright);
          backdrop-filter: blur(8px);
          color: var(--accent-cyan);
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .modal-body {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .modal-title {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.25;
        }

        .modal-full-desc {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.65;
        }

        .modal-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .modal-section-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-icon {
          color: var(--accent-cyan);
        }

        .modal-features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .modal-features-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          color: var(--text-muted);
          font-size: 0.925rem;
        }

        .feature-check {
          color: var(--accent-primary);
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .modal-tag {
          background: rgba(162, 32, 191, 0.15);
          border: 1px solid var(--border-glass-bright);
          color: var(--text-main);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.825rem;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
