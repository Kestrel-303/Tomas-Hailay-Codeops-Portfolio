import React, { useState } from 'react';
import { Mail, Send, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export default function Contact({ onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address';
    }
    if (!formData.message.trim()) errs.message = 'Message cannot be empty';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      if (onShowToast) {
        onShowToast('Thank you! Your message has been sent successfully.');
      }
    }, 1000);
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Interested in collaborating or discussing new software opportunities? Reach out below!</p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Direct Info Cards */}
          <div className="contact-info-column">
            <div className="info-card glass-card">
              <div className="info-icon-box">
                <Mail size={22} />
              </div>
              <div className="info-text">
                <span className="info-label">Direct Email</span>
                <a href="mailto:tomashailaygidey@gmail.com" className="info-link">
                  tomashailaygidey@gmail.com
                </a>
              </div>
            </div>

            <div className="info-card glass-card">
              <div className="info-icon-box">
                <GithubIcon size={22} />
              </div>
              <div className="info-text">
                <span className="info-label">GitHub Repository</span>
                <a
                  href="https://github.com/Kestrel-303"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-link"
                >
                  github.com/Kestrel-303
                </a>
              </div>
            </div>

            <div className="info-card glass-card">
              <div className="info-icon-box">
                <LinkedinIcon size={22} />
              </div>
              <div className="info-text">
                <span className="info-label">LinkedIn Profile</span>
                <a
                  href="https://www.linkedin.com/in/tomas-hailay-gidey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-link"
                >
                  linkedin.com/in/tomas-hailay-gidey
                </a>
              </div>
            </div>

            <div className="availability-card glass-card">
              <div className="avail-header">
                <MapPin size={18} className="pin-icon" />
                <span>Open for Remote & On-Site Roles</span>
              </div>
              <p className="avail-desc">
                Currently open for Full-Stack, Backend, or Frontend engineering opportunities. Feel free to connect!
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="contact-form-column glass-card">
            <h3 className="form-heading">Send a Message</h3>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-msg"><AlertCircle size={14} /> {errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-msg"><AlertCircle size={14} /> {errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry / Collaboration"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  className={errors.message ? 'error' : ''}
                ></textarea>
                {errors.message && <span className="error-msg"><AlertCircle size={14} /> {errors.message}</span>}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn submit-btn">
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span> <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 2rem;
          align-items: start;
        }

        .contact-info-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .info-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          background: rgba(162, 32, 191, 0.15);
          border: 1px solid var(--border-glass-bright);
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-text {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 0.75rem;
          color: var(--text-subtle);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-link {
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.95rem;
          word-break: break-all;
        }

        .info-link:hover {
          color: var(--accent-cyan);
          text-decoration: underline;
        }

        .availability-card {
          padding: 1.25rem 1.5rem;
          background: linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(162, 32, 191, 0.1));
          border-color: var(--border-glass-bright);
        }

        .avail-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--accent-cyan);
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .pin-icon {
          color: var(--accent-primary);
        }

        .avail-desc {
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .contact-form-column {
          padding: 2.25rem;
        }

        .form-heading {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 1.5rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          background: rgba(3, 14, 21, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: var(--transition-fast);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 12px var(--accent-glow);
          background: rgba(3, 14, 21, 0.85);
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #ef4444;
        }

        .error-msg {
          color: #ef4444;
          font-size: 0.775rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 0.5rem;
        }

        @media (max-width: 850px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
