import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Re-use the premium login design system

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend password reset service
    console.log('Password reset request for:', email);
    setSubmitted(true);
  };

  return (
    <div className="login-page">
      {/* ===== Background ===== */}
      <div className="login-bg" aria-hidden="true">
        <div
          className="login-bg-img"
          style={{ backgroundImage: `url('/login-bg-goku.png')` }}
        />
        <div className="login-bg-gradient" />
      </div>

      {/* ===== Ambient Embers ===== */}
      <div className="login-embers" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="ember" />
        ))}
      </div>

      {/* ===== Subtle HUD Scanlines ===== */}
      <div className="login-scanlines" aria-hidden="true" />

      {/* ===== Navbar ===== */}
      <nav className="login-navbar" aria-label="Password recovery navigation">
        <Link to="/" className="login-nav-logo">
          <svg className="login-nav-logo-svg" viewBox="0 0 256 256" fill="#ffffff" aria-hidden="true">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="login-nav-wordmark">Saiyan Gym</span>
        </Link>

        <div className="login-nav-center">
          <Link to="/" className="login-nav-link">Home</Link>
          <Link to="/#chambers" className="login-nav-link">Facilities</Link>
          <Link to="/#philosophy" className="login-nav-link">Methodology</Link>
          <Link to="/#gallery" className="login-nav-link">Programs</Link>
          <Link to="/#cta" className="login-nav-link">Join Now</Link>
        </div>

        <div className="login-nav-right">
          <Link to="/login" className="login-nav-portal-btn">
            <svg className="login-nav-portal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Member Portal
          </Link>
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <div className="login-content">

        {/* --- Left: Tagline + Stats --- */}
        <div className="login-left-panel">
          <div className="login-tagline">
            <span className="login-tagline-sub">Restore your connection.</span>
            <span className="login-tagline-main">RECLAIM ACCESS.</span>
          </div>

          <div className="login-stats-row">
            <div className="login-stat-card">
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <div className="login-stat-text">
                <span className="login-stat-value">500+</span>
                <span className="login-stat-label">Warriors</span>
              </div>
            </div>

            <div className="login-stat-card">
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <div className="login-stat-text">
                <span className="login-stat-value">25K+</span>
                <span className="login-stat-label">Workouts</span>
              </div>
            </div>

            <div className="login-stat-card">
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              <div className="login-stat-text">
                <span className="login-stat-value">100%</span>
                <span className="login-stat-label">Transformation</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Right: Forgot Password Card --- */}
        <div className="login-right-panel">
          <div className="login-card">
            {/* Dragon Ball top ornament */}
            <div className="login-dragonball-ornament" aria-hidden="true">
              <div className="dragonball-main">
                <span className="db-star" />
              </div>
            </div>

            <div className="login-card-inner" style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="login-card-header">
                    <h1 className="login-card-title">
                      RECOVER YOUR
                      <span className="login-card-title-accent">ACCOUNT</span>
                    </h1>
                    <div className="login-card-subtitle">
                      <span className="login-card-subtitle-line" />
                      <span>Request a password reset link</span>
                      <span className="login-card-subtitle-line" />
                    </div>
                  </div>

                  {/* Form */}
                  <form className="login-form" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="login-field-group">
                      <label className="login-field-label" htmlFor="forgot-email">Email Address</label>
                      <div className="login-input-wrapper">
                        <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input
                          id="forgot-email"
                          className="login-input"
                          type="email"
                          placeholder="Enter registered email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="login-submit-btn" style={{ marginTop: '1rem' }}>
                      SEND RESET LINK
                      <svg className="login-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>

                    {/* Return Link */}
                    <div className="login-signup-row" style={{ marginTop: '0.8rem' }}>
                      <span className="login-signup-text">
                        Remember password?{' '}
                        <Link to="/login" className="login-signup-link">
                          Return to Portal →
                        </Link>
                      </span>
                    </div>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  {/* Success State */}
                  <svg
                    style={{ width: '64px', height: '64px', color: '#ffaa00', marginBottom: '1.2rem', filter: 'drop-shadow(0 0 12px rgba(255, 170, 0, 0.4))' }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h2 className="login-card-title-accent" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>TRANSMISSION SENT</h2>
                  <p style={{ color: 'var(--login-text-dim)', fontSize: '0.86rem', lineHeight: '1.5', margin: '0 auto 1.5rem', maxWidth: '300px' }}>
                    If a warrior account is associated with <strong>{email}</strong>, a link to reset your password will arrive shortly.
                  </p>
                  <Link to="/login" className="login-submit-btn" style={{ textDecoration: 'none' }}>
                    RETURN TO PORTAL
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Dragon Balls Side Decoration ===== */}
      <div className="login-dragonballs-side" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7].map((count) => (
          <div key={count} className="db-side-ball">
            {[...Array(count)].map((_, i) => (
              <span key={i} className="db-side-star" />
            ))}
          </div>
        ))}
      </div>

      {/* ===== Footer ===== */}
      <footer className="login-footer">
        <span className="login-footer-left">© 2026 Saiyan Gym. All rights reserved.</span>
        <div className="login-footer-center" aria-hidden="true">
          <span className="login-footer-slogan">The body achieves</span>
          <div className="login-footer-emblem" />
          <span className="login-footer-slogan">The mind believes.</span>
        </div>
        <div className="login-footer-right">
          <a href="#privacy" className="login-footer-link">Privacy Policy</a>
          <a href="#terms" className="login-footer-link">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
