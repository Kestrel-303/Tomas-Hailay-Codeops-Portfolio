import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';

export default function Navbar({ activeSection, theme, onToggleTheme }) {
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
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
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
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="logo-brand">
          <div className="logo-icon-box">
            <Code2 className="logo-icon" size={22} />
          </div>
          <span className="logo-text">Tomas <span className="logo-highlight">Hailay</span></span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={activeSection === link.id ? 'active' : ''}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Cyber Teal' : 'Dark Glass'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Actions */}
        <div className="mobile-actions">
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn mobile-theme-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass-card">
          <ul className="mobile-nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={activeSection === link.id ? 'active' : ''}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: var(--header-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-glass);
          transition: var(--transition-normal);
          padding: 1rem 0;
        }

        .site-header.scrolled {
          padding: 0.75rem 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          border-bottom-color: var(--border-glass-bright);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-main);
        }

        .logo-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 15px var(--accent-glow);
        }

        .logo-highlight {
          color: var(--accent-primary);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          list-style: none;
        }

        .nav-links a {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
          padding: 0.25rem 0;
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: var(--text-main);
        }

        .nav-links a.active {
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-cyan));
          transition: var(--transition-fast);
          border-radius: 2px;
        }

        .nav-links a:hover::after,
        .nav-links a.active::after {
          width: 100%;
        }

        .theme-toggle-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          transform: rotate(15deg);
        }

        .mobile-actions {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }

        .mobile-menu-btn {
          color: var(--text-main);
          padding: 0.4rem;
        }

        .mobile-drawer {
          position: absolute;
          top: 100%;
          left: 1.5rem;
          right: 1.5rem;
          margin-top: 0.5rem;
          padding: 1.5rem;
          z-index: 99;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-nav-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-links a {
          display: block;
          font-size: 1.1rem;
          color: var(--text-muted);
          padding: 0.5rem 0;
          font-weight: 500;
        }

        .mobile-nav-links a.active {
          color: var(--accent-cyan);
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-actions {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
