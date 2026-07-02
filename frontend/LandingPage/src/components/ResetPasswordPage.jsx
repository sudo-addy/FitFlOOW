import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import './LoginPage.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token') || '';
    setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Reset token is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const data = await api.resetPassword(token.trim(), password);
      setIsLoading(false);
      setSuccessMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to reset password.');
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
                  RESET PASSWORD
                  <span className="login-card-title-accent">ENTER NEW VALUES</span>
                </h1>
                <div className="login-card-subtitle">
                  <span className="login-card-subtitle-line" />
                  <span>Restore your Saiyan strength</span>
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

                {/* Token Field */}
                <div className="login-field-group" style={{ marginBottom: '1rem' }}>
                  <label className="login-field-label" htmlFor="reset-token-input">Reset Token</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="reset-token-input"
                      className="login-input"
                      type="text"
                      placeholder="Enter verification token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="login-field-group" style={{ marginBottom: '1rem' }}>
                  <label className="login-field-label" htmlFor="reset-new-password">New Password</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="reset-new-password"
                      className="login-input"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="login-field-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="login-field-label" htmlFor="reset-confirm-password">Confirm Password</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      id="reset-confirm-password"
                      className="login-input"
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      RESET PASSWORD
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
                    Back to{' '}
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
