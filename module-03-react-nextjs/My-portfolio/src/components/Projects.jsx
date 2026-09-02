import React, { useState } from 'react';
import { ExternalLink, Eye, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';
import { projectsData, projectCategories } from '../data/projectsData';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = activeCategory === 'all'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">A showcase of full-stack systems, backend services, and web portals</p>
        </div>

        {/* Filter Category Tabs */}
        <div className="project-tabs">
          {projectCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <article key={project.id} className="project-card glass-card">
              <div className="project-image-wrapper">
                <img src={project.image} alt={project.title} className="project-img" />
                <div className="project-overlay">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn btn-sm overlay-btn"
                  >
                    <Eye size={16} /> Quick View
                  </button>
                </div>
                <span className="project-category-badge">{project.categoryName}</span>
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.shortDescription}</p>

                <div className="project-tags">
                  {project.tags.slice(0, 4).map((tag, idx) => (
                    <span key={idx} className="project-tag-pill">{tag}</span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="project-tag-pill more">+{project.tags.length - 4}</span>
                  )}
                </div>

                <div className="project-actions">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-small"
                    title="Live Demo"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-small btn-code"
                    title="Source Code"
                  >
                    <GithubIcon size={14} /> Source Code
                  </a>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="details-btn"
                    title="More Details"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style>{`
        .projects-section {
          position: relative;
        }

        .project-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 0.55rem 1.25rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.9rem;
          transition: var(--transition-normal);
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, var(--accent-primary), #810f9b);
          border-color: var(--accent-primary);
          color: #ffffff;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .project-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
        }

        .project-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #02121a;
        }

        .project-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .project-card:hover .project-img {
          transform: scale(1.08);
        }

        .project-overlay {
          position: absolute;
          inset: 0;
          background: rgba(4, 20, 29, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card:hover .project-overlay {
          opacity: 1;
        }

        .overlay-btn {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .project-category-badge {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          background: rgba(10, 37, 51, 0.85);
          border: 1px solid var(--border-glass-bright);
          backdrop-filter: blur(8px);
          color: var(--accent-cyan);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .project-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .project-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .project-description {
          color: var(--text-muted);
          font-size: 0.925rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }

        .project-tag-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .project-tag-pill.more {
          color: var(--accent-cyan);
          border-color: rgba(0, 242, 254, 0.3);
        }

        .project-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-small {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--accent-primary);
          color: #ffffff;
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .btn-small:hover {
          background: var(--accent-primary-hover);
          transform: translateY(-2px);
        }

        .btn-code {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-glass);
          color: var(--text-main);
        }

        .btn-code:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--border-glass-bright);
        }

        .details-btn {
          margin-left: auto;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .details-btn:hover {
          background: rgba(162, 32, 191, 0.2);
          color: var(--accent-cyan);
          border-color: var(--accent-primary);
        }
      `}</style>
    </section>
  );
}
