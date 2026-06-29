import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend authentication
    console.log('Login attempt:', { email, rememberMe });
  };

  return (
    <div className="login-page">
      {/* ========== Background ========== */}
      <div className="login-bg">
        <div
          className="login-bg-img"
          style={{ backgroundImage: `url('/login-bg-goku.png')` }}
        />
        <div className="login-bg-gradient" />
        <div className="login-bg-vignette" />
      </div>

      {/* ========== Floating Embers ========== */}
      <div className="login-embers">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="ember" />
        ))}
      </div>

      {/* ========== Navbar ========== */}
      <nav className="login-navbar">
        {/* Left: Logo */}
        <Link to="/" className="login-nav-logo">
          <svg className="login-nav-logo-svg" viewBox="0 0 256 256" fill="#ffffff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span className="login-nav-wordmark">Saiyan Gym</span>
        </Link>

        {/* Center: Nav Pills */}
        <div className="login-nav-center">
          <Link to="/" className="login-nav-link">Home</Link>
          <Link to="/#chambers" className="login-nav-link">Facilities</Link>
          <Link to="/#philosophy" className="login-nav-link">Methodology</Link>
          <Link to="/#gallery" className="login-nav-link">Programs</Link>
          <Link to="/#cta" className="login-nav-link">Join Now</Link>
        </div>

        {/* Right: Member Portal */}
        <div className="login-nav-right">
          <button className="login-nav-portal-btn">
            {/* User circle icon */}
            <svg className="login-nav-portal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Member Portal
          </button>
        </div>
      </nav>

      {/* ========== Main Content ========== */}
      <div className="login-content">

        {/* ---------- Left Panel: Tagline + Stats ---------- */}
        <div className="login-left-panel">
          <div className="login-tagline">
            <span className="login-tagline-sub">Your journey didn't stop.</span>
            <span className="login-tagline-main">IT EVOLVED.</span>
          </div>

          <div className="login-stats-row">
            {/* Stat: Warriors */}
            <div className="login-stat-card">
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <div className="login-stat-text">
                <span className="login-stat-value">500+</span>
                <span className="login-stat-label">Warriors</span>
              </div>
            </div>

            {/* Stat: Workouts */}
            <div className="login-stat-card">
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <div className="login-stat-text">
                <span className="login-stat-value">25K+</span>
                <span className="login-stat-label">Workouts</span>
              </div>
            </div>

            {/* Stat: Transformation */}
            <div className="login-stat-card">
              <svg className="login-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* ---------- Right Panel: Login Card ---------- */}
        <div className="login-right-panel">
          <div className="login-card">
            {/* Dragon Ball ornament */}
            <div className="login-dragonball-ornament">
              <div className="dragonball-main">
                <span className="db-star" />
              </div>
            </div>

            <div className="login-card-inner">
              {/* Header */}
              <div className="login-card-header">
                <h1 className="login-card-title">
                  WELCOME BACK
                  <span className="login-card-title-accent">WARRIOR</span>
                </h1>
                <div className="login-card-subtitle">
                  <span className="login-card-subtitle-line" />
                  <span>Continue your ascension</span>
                  <span className="login-card-subtitle-line" />
                </div>
              </div>

              {/* Form */}
              <form className="login-form" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="login-field-group">
                  <label className="login-field-label" htmlFor="login-email">Email</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      id="login-email"
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

                {/* Password */}
                <div className="login-field-group">
                  <label className="login-field-label" htmlFor="login-password">Password</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="login-password"
                      className="login-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        /* Eye-off icon */
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        </svg>
                      ) : (
                        /* Eye icon */
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="login-options-row">
                  <label className="login-remember">
                    <input
                      type="checkbox"
                      className="login-remember-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="login-remember-text">Remember Me</span>
                  </label>
                  <button type="button" className="login-forgot-link">Forgot Password?</button>
                </div>

                {/* Submit Button */}
                <button type="submit" className="login-submit-btn">
                  ENTER THE SANCTUM
                  <svg className="login-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                {/* Divider */}
                <div className="login-divider">
                  <div className="login-divider-line" />
                  <span className="login-divider-text">Or continue with</span>
                  <div className="login-divider-line" />
                </div>

                {/* Social Buttons */}
                <div className="login-social-row">
                  <button type="button" className="login-social-btn">
                    {/* Google icon */}
                    <svg className="login-social-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button type="button" className="login-social-btn">
                    {/* Apple icon */}
                    <svg className="login-social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Sign Up Link */}
                <div className="login-signup-row">
                  <span className="login-signup-text">
                    New here?{' '}
                    <button type="button" className="login-signup-link">
                      Begin Your Ascension →
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Dragon Ball Side Decoration ========== */}
      <div className="login-dragonballs-side">
        {[1, 2, 3, 4, 5, 6, 7].map((count) => (
          <div key={count} className="db-side-ball">
            {[...Array(count)].map((_, i) => (
              <span key={i} className="db-side-star" />
            ))}
          </div>
        ))}
      </div>

      {/* ========== Footer ========== */}
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
