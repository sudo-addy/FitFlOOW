import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import './LoginPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState(null); // Displaying token in UI for testing/development!

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const data = await api.forgotPassword(email.trim());
      setIsLoading(false);
      setSuccessMessage(data.message);
      if (data.token) {
        setResetToken(data.token);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to request password reset.');
    }
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
      </nav>

      {/* ===== Main Content ===== */}
      <div className="login-content" style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '40px' }}>
        <div className="login-right-panel" style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
          <div className="login-card">
            <div className="login-dragonball-ornament">
              <div className="dragonball-main">
                <span className="db-star" />
              </div>
            </div>

            <div className="login-card-inner" style={{ padding: '2.5rem' }}>
              <div className="login-card-header" style={{ marginBottom: '2rem' }}>
                <h1 className="login-card-title">
                  RECOVER POWER
                  <span className="login-card-title-accent">RESET PASSWORD</span>
                </h1>
                <div className="login-card-subtitle">
                  <span className="login-card-subtitle-line" />
                  <span>Enter your email to restore your access</span>
                  <span className="login-card-subtitle-line" />
                </div>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {error && (
                  <div className="login-error-banner" style={{ color: '#ff4444', backgroundColor: 'rgba(255,68,68,0.1)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(255,68,68,0.3)', textAlign: 'center' }}>
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="login-success-banner" style={{ color: '#34A853', backgroundColor: 'rgba(52,168,83,0.1)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid rgba(52,168,83,0.3)', textAlign: 'center' }}>
                    {successMessage}
                  </div>
                )}

                {resetToken && (
                  <div style={{ backgroundColor: 'rgba(255,85,0,0.1)', border: '1px dashed #ff5500', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: '#ff5500', fontSize: '0.85rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                      🔑 Local Testing Mode:
                    </p>
                    <p style={{ color: '#ffffff', fontSize: '0.8rem', margin: '0 0 0.75rem 0', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      Token: {resetToken}
                    </p>
                    <Link
                      to={`/reset-password?token=${resetToken}`}
                      style={{ display: 'inline-block', backgroundColor: '#ff5500', color: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      Proceed to Reset Form →
                    </Link>
                  </div>
                )}

                {/* Email Field */}
                <div className="login-field-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="login-field-label" htmlFor="reset-email">Email Address</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      id="reset-email"
                      className="login-input"
                      type="email"
                      placeholder="your.email@saiyangym.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="login-submit-btn"
                  disabled={isLoading}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '52px' }}
                >
                  {isLoading ? (
                    <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#ff5500', borderRadius: '50%', animation: 'login-spin 0.8s linear infinite' }} />
                  ) : (
                    <>
                      SEND RESET LINK
                      <svg className="login-submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Navigation Back */}
                <div className="login-signup-row" style={{ marginTop: '1.5rem' }}>
                  <span className="login-signup-text">
                    Remember your key?{' '}
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

      {/* ===== Footer ===== */}
      <footer className="login-footer">
        <span className="login-footer-left">© 2025 Saiyan Gym. All rights reserved.</span>
        <div className="login-footer-center">
          <span className="login-footer-slogan">The body achieves</span>
          <div className="login-footer-emblem" />
          <span className="login-footer-slogan">The mind believes.</span>
        </div>
      </footer>
    </div>
  );
}
