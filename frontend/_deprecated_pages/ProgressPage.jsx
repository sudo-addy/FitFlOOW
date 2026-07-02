import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './ProgressPage.css';

export default function ProgressPage() {
  const { user, isSidebarCollapsed } = useAuth();

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
    { group: 'Shoulders', percentage: 12, color: '#ff8800' },
    { group: 'Arms & Core', percentage: 8, color: '#cc4400' },
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
      <Sidebar />

      {/* Main View Area */}
      <div className="portal-view">
        {/* Topbar Header */}
        <Topbar />

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
              <div className="custom-chart-container" style={{ height: '220px', padding: '10px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff5500" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ff5500" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="week" 
                      stroke="#6e6157" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#6e6157" 
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#120906', 
                        borderColor: '#ff5500', 
                        borderRadius: '6px',
                        color: '#f5ede6',
                        fontFamily: 'Outfit'
                      }}
                      itemStyle={{ color: '#ffaa00' }}
                      labelStyle={{ color: '#a3958c' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#ff5500" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorVolume)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
