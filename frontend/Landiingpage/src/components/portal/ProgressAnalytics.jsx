import React, { useState, useEffect } from 'react';
import PortalLayout from './PortalLayout';
import './ProgressAnalytics.css';

const TIME_RANGES = ['1W', '1M', '3M', '6M', '1Y'];

const VOLUME_DATA = [
  { week: 'Wk 1', kg: 4800 },
  { week: 'Wk 2', kg: 5400 },
  { week: 'Wk 3', kg: 4200 },
  { week: 'Wk 4', kg: 6100 },
  { week: 'Wk 5', kg: 5800 },
  { week: 'Wk 6', kg: 7200 },
  { week: 'Wk 7', kg: 6600 },
  { week: 'Wk 8', kg: 7900 },
];

const BODY_METRICS = [
  {
    id: 'metric-weight',
    label: 'Body Weight',
    value: '82.4',
    unit: 'kg',
    change: '-2.1 kg',
    changeDir: 'down-good',
    period: 'this month',
    progress: 68,
    sparkData: [85.1, 84.6, 84.0, 83.5, 83.2, 82.9, 82.4],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: 'metric-bodyfat',
    label: 'Body Fat',
    value: '14.2',
    unit: '%',
    change: '-1.8%',
    changeDir: 'down-good',
    period: 'this month',
    progress: 82,
    sparkData: [16.4, 15.9, 15.4, 15.0, 14.7, 14.4, 14.2],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'metric-muscle',
    label: 'Muscle Mass',
    value: '68.1',
    unit: 'kg',
    change: '+1.4 kg',
    changeDir: 'up-good',
    period: 'this month',
    progress: 74,
    sparkData: [66.7, 66.9, 67.2, 67.5, 67.7, 67.9, 68.1],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
      </svg>
    ),
  },
  {
    id: 'metric-vo2',
    label: 'VO2 Max',
    value: '52.4',
    unit: 'ml/kg/min',
    change: '+2.1',
    changeDir: 'up-good',
    period: 'this month',
    progress: 78,
    sparkData: [50.3, 50.7, 51.1, 51.5, 51.8, 52.1, 52.4],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const PR_TABLE = [
  { id: 'pr-squat', exercise: 'Back Squat', current: '180 kg', previous: '172.5 kg', date: 'Jun 22, 2026', diff: '+7.5 kg', icon: '🏋️' },
  { id: 'pr-deadlift', exercise: 'Deadlift', current: '220 kg', previous: '210 kg', date: 'Jun 15, 2026', diff: '+10 kg', icon: '💪' },
  { id: 'pr-bench', exercise: 'Bench Press', current: '130 kg', previous: '125 kg', date: 'May 30, 2026', diff: '+5 kg', icon: '🔥' },
  { id: 'pr-ohp', exercise: 'Overhead Press', current: '90 kg', previous: '87.5 kg', date: 'Jun 18, 2026', diff: '+2.5 kg', icon: '⚡' },
  { id: 'pr-pullups', exercise: 'Pull-ups', current: '22 reps', previous: '18 reps', date: 'Jun 28, 2026', diff: '+4 reps', icon: '🎯' },
];

const MEASUREMENT_TRENDS = [
  { id: 'meas-chest', label: 'Chest', value: '104 cm', change: '+1.5 cm', pct: 72 },
  { id: 'meas-waist', label: 'Waist', value: '80 cm', change: '-2 cm', pct: 60, invert: true },
  { id: 'meas-hips', label: 'Hips', value: '97 cm', change: '-1 cm', pct: 55, invert: true },
  { id: 'meas-larm', label: 'Left Arm', value: '38 cm', change: '+0.8 cm', pct: 80 },
  { id: 'meas-rarm', label: 'Right Arm', value: '38.5 cm', change: '+0.8 cm', pct: 81 },
  { id: 'meas-thigh', label: 'Thigh', value: '61 cm', change: '+1.2 cm', pct: 68 },
];

const MAX_VOL = Math.max(...VOLUME_DATA.map(d => d.kg));

export default function ProgressAnalytics() {
  const [timeRange, setTimeRange] = useState('3M');

  useEffect(() => {
    document.title = 'Analytics | FitFlOOW';
    return () => {
      document.title = 'Saiyan Gym';
    };
  }, []);

  return (
    <PortalLayout>
      <div className="progress-page">
        {/* Header */}
        <div className="portal-page-header">
          <div className="progress-header-row">
            <div>
              <h1 className="portal-page-title">
                Ascension <span className="portal-highlight">Metrics</span>
              </h1>
              <p className="portal-page-subtitle">Track your transformation — every rep recorded, every gain measured</p>
            </div>
            <div className="progress-time-selector" role="group" aria-label="Select time range">
              {TIME_RANGES.map(r => (
                <button
                  key={r}
                  id={`progress-range-${r}`}
                  className={`progress-range-btn ${timeRange === r ? 'progress-range-btn--active' : ''}`}
                  onClick={() => setTimeRange(r)}
                  aria-pressed={timeRange === r}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body Metrics Cards */}
        <div className="portal-card-grid progress-metrics-grid">
          {BODY_METRICS.map(m => (
            <div key={m.id} className="portal-card progress-metric-card" id={m.id}>
              <div className="progress-metric-top">
                <div className="progress-metric-icon" aria-hidden="true">{m.icon}</div>
                <span className={`progress-change-badge ${m.changeDir === 'up-good' || m.changeDir === 'down-good' ? 'progress-change-badge--good' : 'progress-change-badge--bad'}`}>
                  {m.changeDir.startsWith('up') ? '↑' : '↓'} {m.change}
                </span>
              </div>
              <div className="portal-card-label">{m.label}</div>
              <div className="progress-metric-value-row">
                <span className="portal-card-value">{m.value}</span>
                <span className="progress-metric-unit">{m.unit}</span>
              </div>
              <p className="portal-card-meta">{m.period}</p>

              {/* Sparkline */}
              <div className="progress-sparkline" aria-label={`${m.label} trend`}>
                {m.sparkData.map((v, i) => {
                  const minV = Math.min(...m.sparkData);
                  const maxV = Math.max(...m.sparkData);
                  const range = maxV - minV || 1;
                  const pct = ((v - minV) / range) * 100;
                  const isLast = i === m.sparkData.length - 1;
                  return (
                    <div
                      key={i}
                      className={`progress-spark-bar ${isLast ? 'progress-spark-bar--active' : ''}`}
                      style={{ height: `${Math.max(pct, 10)}%` }}
                      title={`${v} ${m.unit}`}
                    />
                  );
                })}
              </div>

              {/* Progress bar vs goal */}
              <div className="progress-goal-row">
                <span className="progress-goal-label">Goal Progress</span>
                <span className="progress-goal-pct">{m.progress}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="portal-divider" />

        {/* Weekly Volume Chart */}
        <section className="progress-chart-section" aria-label="Weekly workout volume chart">
          <div className="progress-section-header">
            <h2 className="portal-section-title">Weekly Workout Volume</h2>
            <span className="progress-chart-unit">Total tonnage lifted (kg)</span>
          </div>
          <div className="progress-chart-card">
            <div className="progress-chart-y-axis" aria-hidden="true">
              {[8000, 6000, 4000, 2000, 0].map(v => (
                <span key={v} className="progress-y-label">{v >= 1000 ? `${v / 1000}k` : v}</span>
              ))}
            </div>
            <div className="progress-chart-bars" role="list" aria-label="Weekly volume bars">
              {VOLUME_DATA.map((d, i) => {
                const heightPct = (d.kg / MAX_VOL) * 100;
                const isLast = i === VOLUME_DATA.length - 1;
                return (
                  <div key={d.week} className="progress-bar-col" role="listitem">
                    <div className="progress-bar-wrapper">
                      <div
                        className={`progress-vol-bar ${isLast ? 'progress-vol-bar--current' : ''}`}
                        style={{ height: `${heightPct}%` }}
                        title={`${d.week}: ${d.kg.toLocaleString()} kg`}
                      >
                        <span className="progress-bar-tooltip">{d.kg.toLocaleString()} kg</span>
                      </div>
                    </div>
                    <span className="progress-bar-label">{d.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="portal-divider" />

        {/* Personal Records Table */}
        <section aria-label="Personal records">
          <h2 className="portal-section-title">Personal Records</h2>
          <div className="progress-pr-table-wrap">
            <table className="progress-pr-table" aria-label="Personal records table">
              <thead>
                <tr>
                  <th scope="col">Exercise</th>
                  <th scope="col">Current PR</th>
                  <th scope="col">Previous PR</th>
                  <th scope="col">Improvement</th>
                  <th scope="col">Date Achieved</th>
                </tr>
              </thead>
              <tbody>
                {PR_TABLE.map(pr => (
                  <tr key={pr.id} id={pr.id} className="progress-pr-row">
                    <td className="progress-pr-exercise">
                      <span className="progress-pr-icon" aria-hidden="true">{pr.icon}</span>
                      {pr.exercise}
                    </td>
                    <td className="progress-pr-current">{pr.current}</td>
                    <td className="progress-pr-prev">{pr.previous}</td>
                    <td>
                      <span className="progress-pr-diff">{pr.diff}</span>
                    </td>
                    <td className="progress-pr-date">{pr.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="portal-divider" />

        {/* Measurement Trends */}
        <section aria-label="Body measurement trends">
          <h2 className="portal-section-title">Measurement Trends</h2>
          <div className="progress-measurements-grid">
            {MEASUREMENT_TRENDS.map(m => (
              <div key={m.id} className="progress-meas-card" id={m.id}>
                <div className="progress-meas-header">
                  <span className="progress-meas-label">{m.label}</span>
                  <span className={`progress-meas-change ${m.invert ? 'progress-meas-change--good' : 'progress-meas-change--good'}`}>
                    {m.change}
                  </span>
                </div>
                <div className="progress-meas-value">{m.value}</div>
                <div className="progress-meas-bar-track">
                  <div
                    className="progress-meas-bar-fill"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
                <div className="progress-meas-pct">{m.pct}% of goal</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalLayout>
  );
}
