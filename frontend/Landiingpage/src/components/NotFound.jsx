import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      {/* Background */}
      <div className="notfound-bg" />
      <div className="notfound-scanlines" />

      {/* Content */}
      <div className="notfound-content">
        <div className="notfound-code-wrapper">
          <span className="notfound-code">404</span>
          <div className="notfound-code-glow" />
        </div>

        <div className="notfound-divider">
          <span className="notfound-divider-line" />
          <span className="notfound-divider-icon">
            {/* Lightning bolt SVG */}
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          <span className="notfound-divider-line" />
        </div>

        <h1 className="notfound-title">REALM NOT FOUND</h1>
        <p className="notfound-desc">
          This dimension does not exist. The path you seek has vanished beyond the veil.
          Return to the sanctum and continue your ascension.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="notfound-btn-primary" id="notfound-home-btn">
            Return to Sanctum
          </Link>
          <Link to="/dashboard" className="notfound-btn-secondary" id="notfound-dashboard-btn">
            Member Portal
          </Link>
        </div>

        {/* Ambient orbs */}
        <div className="notfound-orb notfound-orb-1" />
        <div className="notfound-orb notfound-orb-2" />
      </div>
    </div>
  );
}
