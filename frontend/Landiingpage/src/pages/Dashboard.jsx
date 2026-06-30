import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState({
    name: 'Marcus Vance',
    tier: 'Warrior Elite',
    powerLevel: 8965,
    streak: 5,
    sessionsThisWeek: 4,
    volumeThisWeek: 12450,
    caloriesThisWeek: 2840,
  });

  const [countUpLevel, setCountUpLevel] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Animate the Power Level counter on mount
  useEffect(() => {
    let start = 0;
    const end = user.powerLevel;
    const duration = 1200; // ms
    const increment = Math.ceil(end / (duration / 16)); // ~60fps frame rate

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCountUpLevel(end);
        clearInterval(timer);
      } else {
        setCountUpLevel(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [user.powerLevel]);

  return (
    <div className={`portal-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar user={user} isCollapsed={isSidebarCollapsed} />

      {/* Main View Area */}
      <div className="portal-view">
        {/* Topbar Header */}
        <Topbar
          user={user}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dashboard Panels */}
        <main className="dashboard-content">
          <div className="dashboard-grid">

            {/* CARD 1: POWER LEVEL SCANNED HUD */}
            <div className="dash-card power-level-card">
              <div className="scouter-hud-border" />
              <div className="power-card-layout">
                <div className="power-gauge-wrapper">
                  <svg className="power-gauge-svg" viewBox="0 0 120 120">
                    <circle className="gauge-bg" cx="60" cy="60" r="50" />
                    <circle
                      className="gauge-fill"
                      cx="60"
                      cy="60"
                      r="50"
                      style={{
                        strokeDasharray: '314.15',
                        strokeDashoffset: `${314.15 - (countUpLevel / 9999) * 314.15}`,
                      }}
                    />
                  </svg>
                  <div className="power-scouter-readout">
                    <span className="scouter-title">ASCENSION INDEX</span>
                    <span className="scouter-val">{countUpLevel}</span>
                  </div>
                </div>
                <div className="power-rank-details">
                  <span className="power-sub">CURRENT STANDING:</span>
                  <h2 className="power-rank-title">WARRIOR ELITE</h2>
                  <p className="power-rank-desc">
                    Your current biometric indices place you in the top 5% of active members. Complete 3 more sessions to unlock Tier III priority scheduling.
                  </p>
                  <div className="power-progress-badge">
                    <span>90% of current phase completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: TRAINING STREAK */}
            <div className="dash-card streak-card">
              <h3 className="card-heading">TRAINING STREAK</h3>
              <div className="streak-stats">
                <div className="streak-flame-wrapper">
                  <span className="streak-flame-icon">🔥</span>
                  <span className="streak-flame-num">{user.streak}</span>
                </div>
                <div className="streak-flame-details">
                  <span className="streak-status-lbl">ACTIVE STREAK</span>
                  <p className="streak-status-desc">Consistency yields results. Log today's activity to secure your progress.</p>
                </div>
              </div>
              <div className="streak-days-row">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className={`streak-day-circle ${i < user.streak ? 'filled' : ''}`}>
                    <span className="day-name">{day}</span>
                    <span className="day-dot" />
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 3: NEXT RESERVED CLASS */}
            <div className="dash-card next-class-card">
              <h3 className="card-heading">UPCOMING CHAMBER SESSION</h3>
              <div className="class-card-layout">
                <div className="class-time-badge">
                  <span className="class-time-hour">18:30</span>
                  <span className="class-time-date">TODAY</span>
                </div>
                <div className="class-details">
                  <h4>Chamber I — Conditioning Arena</h4>
                  <p>Coach: Sarah Jenkins • 45 min session</p>
                  <div className="class-spots-left red-alert">
                    <span>⚠️ Only 2 spots left on waitlist</span>
                  </div>
                </div>
              </div>
              <div className="class-actions">
                <button className="class-primary-btn">ENTER CHAMBER</button>
                <button className="class-secondary-btn">Cancel Slot</button>
              </div>
            </div>

            {/* CARD 4: THIS WEEK'S SUMMARY STATS */}
            <div className="dash-card stats-card">
              <h3 className="card-heading">WEEKLY TRAINING SUMMARY</h3>
              <div className="weekly-stats-row">
                <div className="stat-metric-box">
                  <div className="stat-icon-wrapper orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div className="stat-metric-text">
                    <span className="metric-val">{user.sessionsThisWeek}</span>
                    <span className="metric-lbl">Sessions Done</span>
                  </div>
                </div>

                <div className="stat-metric-box">
                  <div className="stat-icon-wrapper gold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 18H18V6H6V18Z" />
                      <path d="M12 2v4M12 18v4M4 12h4M16 12h4" />
                    </svg>
                  </div>
                  <div className="stat-metric-text">
                    <span className="metric-val">{(user.volumeThisWeek / 1000).toFixed(1)}t</span>
                    <span className="metric-lbl">Volume Lifted</span>
                  </div>
                </div>

                <div className="stat-metric-box">
                  <div className="stat-icon-wrapper red">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="stat-metric-text">
                    <span className="metric-val">{user.caloriesThisWeek}</span>
                    <span className="metric-lbl">Kcal Burned</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 5: LEADERBOARD PREVIEW (UPGRADE HOOK) */}
            <div className="dash-card leaderboard-card">
              <div className="card-header-with-badge">
                <h3 className="card-heading">LEADERBOARD</h3>
                <span className="locked-badge">WARRIOR ELITE</span>
              </div>
              <div className="leaderboard-blur-wrapper">
                <div className="leaderboard-list">
                  <div className="leader-item gold-medal">
                    <span className="leader-rank">1</span>
                    <div className="leader-avatar">AJ</div>
                    <span className="leader-name">Alex Rivera</span>
                    <span className="leader-score">12,400 XP</span>
                  </div>
                  <div className="leader-item silver-medal">
                    <span className="leader-rank">2</span>
                    <div className="leader-avatar">SJ</div>
                    <span className="leader-name">Sarah Jenkins</span>
                    <span className="leader-score">11,850 XP</span>
                  </div>
                  {/* Blurred row */}
                  <div className="leader-item blurred-row">
                    <span className="leader-rank">3</span>
                    <div className="leader-avatar">?</div>
                    <span className="leader-name">Locked Position</span>
                    <span className="leader-score">???? XP</span>
                  </div>
                </div>
                {/* Locked conversion overlay */}
                <div className="leaderboard-lock-overlay">
                  <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <h4>ELITE MEMBER COMMUNITY</h4>
                  <p>Upgrade to Warrior Elite plan to view live rankings, message coaches, and sync metrics with the community.</p>
                  <Link to="/membership" className="upgrade-action-btn">UPGRADE NOW</Link>
                </div>
              </div>
            </div>

            {/* CARD 6: LATEST ACHIEVEMENT UNLOCKED */}
            <div className="dash-card achievement-card">
              <h3 className="card-heading">LATEST MILESTONE</h3>
              <div className="achievement-layout">
                <div className="badge-emblem">
                  <span className="badge-star">★</span>
                </div>
                <div className="achievement-info">
                  <span className="unlock-date">UNLOCKED TODAY</span>
                  <h4>Threshold Breakthrough</h4>
                  <p>Maintained heart rate threshold inside high-intensity target zones for 45 minutes.</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
