import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [toastMessage, setToastMessage] = useState('');

  // Active section tracking with IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'cyber-teal' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Toast notification auto dismiss
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  return (
    <div className="app-main">
      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact onShowToast={showToast} />
      </main>

      <Footer />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification glass-card">
          <CheckCircle2 size={20} className="toast-icon" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="toast-close">
            <X size={16} />
          </button>
        </div>
      )}

      <style>{`
        .app-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1.25rem;
          border-color: var(--border-glass-bright);
          box-shadow: var(--shadow-lg), 0 0 20px var(--accent-glow);
          color: var(--text-main);
          font-size: 0.9rem;
          font-weight: 500;
          animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toast-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .toast-close {
          color: var(--text-muted);
          padding: 0.2rem;
          margin-left: 0.5rem;
          border-radius: 4px;
        }

        .toast-close:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
