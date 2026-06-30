import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './ProgressPage.css';

export default function ProgressPage() {
  const [user, setUser] = useState({
    name: 'Marcus Vance',
    tier: 'Warrior Elite',
    powerLevel: 8965,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock performance data over 4 weeks
  const performanceHistory = [
    { week: 'Week 1', volume: 8400, intensity: 82, prCount: 1 },
    { week: 'Week 2', volume: 9200, intensity: 85, prCount: 2 },
    { week: 'Week 3', volume: 10800, intensity: 88, prCount: 3 },
    { week: 'Week 4', volume: 12450, intensity: 90, prCount: 1 },
  ];

  // Mock Muscle Group split data
  const muscleSplits = [
    { group: 'Chest / Push', percentage: 35, color: '#ff5500' },
    { group: 'Back / Pull', percentage: 25, color: '#ffaa00' },
    { group: 'Legs / Lower', percentage: 20, color: '#ffea00' },
    { group: 'Shoulders', percentage: 12, color: '#3b82f6' },
    { group: 'Arms & Core', percentage: 8, color: '#8b5cf6' },
  ];

  // Mock Biometrics log
  const biometrics = [
    { name: 'Body Mass', current: '81.6 kg', change: '-0.8 kg', labelClass: 'negative' },
    { name: 'Body Fat %', current: '13.8%', change: '-0.4%', labelClass: 'negative' },
    { name: 'Lean Mass Ratio', current: '70.3 kg', change: '+0.5 kg', labelClass: 'positive' },
    { name: 'Recovery Score', current: '92%', change: '+4%', labelClass: 'positive' }
  ];

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

        {/* Analytics Dashboard Content */}
        <main className="progress-content">
          <div className="progress-header-row">
            <div>
              <h1 className="progress-title">PERFORMANCE ANALYTICS</h1>
              <p className="progress-subtitle">Review workout logs, biometric trends, and strength outputs.</p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="metrics-summary-row">
            <div className="metric-panel">
              <span className="panel-lbl">TOTAL MONTHLY VOLUME</span>
              <span className="panel-val">40,850 kg</span>
              <span className="panel-trend positive">↑ 12% vs last month</span>
            </div>
            <div className="metric-panel">
              <span className="panel-lbl">ACTIVE WORKOUT TIME</span>
              <span className="panel-val">16.5 hrs</span>
              <span className="panel-trend positive">↑ 2.4 hrs vs last month</span>
            </div>
            <div className="metric-panel">
              <span className="panel-lbl">ESTIMATED RECOVERY RATE</span>
              <span className="panel-val">87%</span>
              <span className="panel-trend neutral">Optimal threshold</span>
            </div>
          </div>

          <div className="progress-grid-layout">
            {/* CARD 1: VOLUME PROGRESSION GRAPH (Custom CSS Chart) */}
            <div className="progress-card chart-card">
              <h3 className="card-heading">VOLUME OVERLOAD TREND</h3>
              <div className="custom-chart-container">
                {/* Y-axis markers */}
                <div className="chart-y-axis">
                  <span>14k</span>
                  <span>10k</span>
                  <span>6k</span>
                  <span>2k</span>
                </div>
                {/* Chart bars */}
                <div className="chart-bars-row">
                  {performanceHistory.map((data, idx) => (
                    <div key={idx} className="chart-column-wrapper">
                      <div className="chart-bar-glow-container">
                        <div
                          className="chart-bar-fill"
                          style={{ height: `${(data.volume / 14000) * 100}%` }}
                        >
                          <span className="bar-hover-val">{data.volume.toLocaleString()} kg</span>
                        </div>
                      </div>
                      <span className="bar-label">{data.week}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2: MUSCLE EMPHASIS SPLITS */}
            <div className="progress-card split-card">
              <h3 className="card-heading">MUSCLE EMPHASIS SPLITS</h3>
              <div className="splits-list">
                {muscleSplits.map((item, idx) => (
                  <div key={idx} className="split-row-item">
                    <div className="split-info">
                      <span className="split-name">{item.group}</span>
                      <span className="split-pct">{item.percentage}%</span>
                    </div>
                    <div className="split-bar-bg">
                      <div
                        className="split-bar-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                          boxShadow: `0 0 10px ${item.color}50`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 3: BIOMETRIC INDEX TRENDS */}
            <div className="progress-card biometrics-card">
              <h3 className="card-heading">BIOMETRIC TRACKING</h3>
              <div className="biometrics-list">
                {biometrics.map((bio, idx) => (
                  <div key={idx} className="bio-row-item">
                    <div>
                      <span className="bio-lbl">{bio.name}</span>
                      <span className="bio-val">{bio.current}</span>
                    </div>
                    <span className={`bio-change ${bio.labelClass}`}>
                      {bio.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 4: RECOVERY & STRESS INDEX */}
            <div className="progress-card recovery-card">
              <h3 className="card-heading">METABOLIC & SLEEP COEFFICIENT</h3>
              <div className="recovery-content-box">
                <div className="recovery-circle-gauge">
                  <svg viewBox="0 0 100 100" className="gauge-svg">
                    <circle className="gauge-track" cx="50" cy="50" r="42" />
                    <circle className="gauge-fill-accent" cx="50" cy="50" r="42" />
                  </svg>
                  <div className="gauge-inner-val">
                    <span className="gauge-number">92</span>
                    <span className="gauge-tag">EXCELLENT</span>
                  </div>
                </div>
                <div className="recovery-details-text">
                  <p>
                    Your HRV (Heart Rate Variability) and sleep depth metrics indices demonstrate <strong>optimum CNS recovery</strong>. 
                  </p>
                  <p className="dim-p">
                    Physical exertion index target for today is set to high capability threshold. Heavy lifts recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
