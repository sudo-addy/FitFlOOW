import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import './LoginPage.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      await api.signup(name.trim(), email.trim(), password);
      setIsLoading(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrors({ form: error.message || 'Registration failed.' });
    }
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="login-page">
      {/* ===== Background ===== */}
      <div className="login-bg">
        <div
          className="login-bg-img"
          style={{ backgroundImage: `url('/login-bg-goku.png')` }}
        />
        <div className="login-bg-gradient" />
      </div>

      {/* ===== Ambient Embers ===== */}
      <div className="login-embers">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="ember" />
        ))}
      </div>

      {/* ===== Subtle HUD Scanlines ===== */}
      <div className="login-scanlines" />

      {/* ===== Navbar ===== */}
      <nav className="login-navbar">
        <Link to="/" className="login-nav-logo">
          <svg className="login-nav-logo-svg" viewBox="0 0 256 256" fill="#ffffff">
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
          <button className="login-nav-portal-btn" onClick={() => navigate('/login')}>
            <svg className="login-nav-portal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Member Portal
          </button>
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <div className="login-content" style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '20px', paddingBottom: '20px' }}>
        {/* --- Left Panel --- */}
        <div className="login-left-panel">
          <div className="login-tagline">
            <span className="login-tagline-sub">Awaken your limitless power.</span>
            <span className="login-tagline-main">BEGIN ASCENSION.</span>
          </div>

          <div className="login-stats-row">
            <div className="login-stat-card">
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <div className="login-stat-text">
                <span className="login-stat-value">25K+</span>
                <span className="login-stat-label">Workouts</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Right: Registration Card --- */}
        <div className="login-right-panel">
          <div className="login-card" style={{ marginTop: '0' }}>
            <div className="login-dragonball-ornament">
              <div className="dragonball-main">
                <span className="db-star" />
              </div>
            </div>

            <div className="login-card-inner" style={{ padding: '2rem' }}>
              <div className="login-card-header" style={{ marginBottom: '1.5rem' }}>
                <h1 className="login-card-title">
                  CREATE ACCOUNT
                  <span className="login-card-title-accent">SAIYAN</span>
                </h1>
                <div className="login-card-subtitle">
                  <span className="login-card-subtitle-line" />
                  <span>Start tracking your progress</span>
                  <span className="login-card-subtitle-line" />
                </div>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {/* Form Error */}
                {errors.form && <div className="login-error-banner" style={{ color: '#ff4444', backgroundColor: 'rgba(255,68,68,0.1)', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(255,68,68,0.3)', textAlign: 'center' }}>{errors.form}</div>}

                {/* Name */}
                <div className="login-field-group" style={{ marginBottom: '1rem' }}>
                  <label className="login-field-label" htmlFor="register-name">Full Name</label>
                  <div className={`login-input-wrapper ${errors.name ? 'login-input-wrapper--error' : ''}`}>
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="register-name"
                      className="login-input"
                      type="text"
                      placeholder="e.g. Son Goku"
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearError('name'); }}
                      required
                    />
                  </div>
                  {errors.name && <span className="login-error-text" style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="login-field-group" style={{ marginBottom: '1rem' }}>
                  <label className="login-field-label" htmlFor="register-email">Email Address</label>
                  <div className={`login-input-wrapper ${errors.email ? 'login-input-wrapper--error' : ''}`}>
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="register-email"
                      className="login-input"
                      type="email"
                      placeholder="warrior@saiyangym.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                      required
                    />
                  </div>
                  {errors.email && <span className="login-error-text" style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                </div>

                {/* Password */}
                <div className="login-field-group" style={{ marginBottom: '1rem' }}>
                  <label className="login-field-label" htmlFor="register-password">Password</label>
                  <div className={`login-input-wrapper ${errors.password ? 'login-input-wrapper--error' : ''}`}>
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="register-password"
                      className="login-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                      required
                    />
                  </div>
                  {errors.password && <span className="login-error-text" style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div className="login-field-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="login-field-label" htmlFor="register-confirm">Confirm Password</label>
                  <div className={`login-input-wrapper ${errors.confirmPassword ? 'login-input-wrapper--error' : ''}`}>
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="register-confirm"
                      className="login-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                      required
                    />
                  </div>
                  {errors.confirmPassword && <span className="login-error-text" style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
                </div>

                {/* Submit Button */}
                <button type="submit" className="login-submit-btn" disabled={isLoading || submitSuccess} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '52px' }}>
                  {isLoading ? (
                    <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#ff5500', borderRadius: '50%', animation: 'login-spin 0.8s linear infinite' }} />
                  ) : submitSuccess ? (
                    <span style={{ color: '#34A853', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ASCENSION GRANTED
                    </span>
                  ) : (
                    <>
                      BEGIN ASCENSION
                      <svg className="login-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Sign in redirect */}
                <div className="login-signup-row" style={{ marginTop: '1.5rem' }}>
                  <span className="login-signup-text">
                    Already a member?{' '}
                    <Link to="/login" className="login-signup-link">
                      Sign In →
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Dragon Ball Side Decoration ===== */}
      <div className="login-dragonballs-side">
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
        <span className="login-footer-left">© 2025 Saiyan Gym. All rights reserved.</span>
        <div className="login-footer-center">
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
