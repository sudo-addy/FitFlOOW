import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-bg-grid">
        <div className="grid-line" />
        <div className="grid-line" />
        <div className="grid-line" />
      </div>

      <div className="notfound-card">
        <div className="notfound-warning-icon">⚠</div>
        <span className="notfound-code">ERROR 404</span>
        <h1 className="notfound-title">CHAMBER UNREACHABLE</h1>
        <p className="notfound-desc">
          The biometric coordinates you attempted to synchronize do not map to any active chamber or database record inside the portal.
        </p>

        <div className="notfound-hud-metrics">
          <div className="metric-box">
            <span className="metric-label">STATUS</span>
            <span className="metric-value value-red">OFFLINE</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">COORDS</span>
            <span className="metric-value">X-899</span>
          </div>
        </div>

        <button className="notfound-home-btn" onClick={() => navigate('/dashboard')}>
          RETURN TO DASHBOARD
        </button>
      </div>
    </div>
  );
}
