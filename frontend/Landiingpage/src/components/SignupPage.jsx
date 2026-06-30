import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Re-use the premium login design system

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [goal, setGoal] = useState('Build Muscle');
  const [level, setLevel] = useState('Beginner');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setError('');
    // TODO: Connect to backend authentication
    console.log('Signup attempt:', { name, email, goal, level });
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
      <nav className="login-navbar" aria-label="Signup navigation">
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
            <span className="login-tagline-sub">Break your physical limits.</span>
            <span className="login-tagline-main">AWAKEN POWER.</span>
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

        {/* --- Right: Signup Card --- */}
        <div className="login-right-panel">
          <div className="login-card" style={{ paddingTop: '2.5rem' }}>
            {/* Dragon Ball top ornament */}
            <div className="login-dragonball-ornament" aria-hidden="true">
              <div className="dragonball-main">
                <span className="db-star" />
              </div>
            </div>

            <div className="login-card-inner">
              {/* Header */}
              <div className="login-card-header">
                <h1 className="login-card-title">
                  BEGIN YOUR
                  <span className="login-card-title-accent">ASCENSION</span>
                </h1>
                <div className="login-card-subtitle">
                  <span className="login-card-subtitle-line" />
                  <span>Join the elite rankings</span>
                  <span className="login-card-subtitle-line" />
                </div>
              </div>

              {/* Form */}
              <form className="login-form" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="login-field-group">
                  <label className="login-field-label" htmlFor="signup-name">Full Name</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="signup-name"
                      className="login-input"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="login-field-group">
                  <label className="login-field-label" htmlFor="signup-email">Email Address</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="signup-email"
                      className="login-input"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Split selectors for Goal & Level */}
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <div className="login-field-group" style={{ flex: 1 }}>
                    <label className="login-field-label" htmlFor="signup-goal">Training Goal</label>
                    <div className="login-input-wrapper">
                      <select
                        id="signup-goal"
                        className="login-input"
                        style={{ paddingLeft: '0.8rem', paddingRight: '0.8rem' }}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                      >
                        <option value="Build Muscle">Build Muscle</option>
                        <option value="Lose Fat">Lose Fat</option>
                        <option value="Endurance">Endurance</option>
                        <option value="General Fitness">General Fitness</option>
                      </select>
                    </div>
                  </div>

                  <div className="login-field-group" style={{ flex: 1 }}>
                    <label className="login-field-label" htmlFor="signup-level">Experience</label>
                    <div className="login-input-wrapper">
                      <select
                        id="signup-level"
                        className="login-input"
                        style={{ paddingLeft: '0.8rem', paddingRight: '0.8rem' }}
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="login-field-group">
                  <label className="login-field-label" htmlFor="signup-password">Password</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="signup-password"
                      className="login-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="login-field-group">
                  <label className="login-field-label" htmlFor="signup-confirm-password">Confirm Password</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="signup-confirm-password"
                      className="login-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Show password checkbox */}
                <div className="login-options-row" style={{ marginTop: '-0.3rem' }}>
                  <label className="login-remember">
                    <input
                      type="checkbox"
                      className="login-remember-checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <span className="login-remember-text">Show Passwords</span>
                  </label>
                </div>

                {/* Error messages */}
                {error && (
                  <div style={{ color: '#ff5533', fontSize: '0.78rem', textAlign: 'center', fontWeight: '500' }}>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" className="login-submit-btn" style={{ marginTop: '0.4rem' }}>
                  START MY INITIATION
                  <svg className="login-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                {/* Sign up */}
                <div className="login-signup-row">
                  <span className="login-signup-text">
                    Already a member?{' '}
                    <Link to="/login" className="login-signup-link">
                      Enter the Portal →
                    </Link>
                  </span>
                </div>
              </form>
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
