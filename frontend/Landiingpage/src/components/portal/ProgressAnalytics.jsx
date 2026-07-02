import React, { useState, useEffect } from 'react';
import PortalLayout from './PortalLayout';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
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

// BODY_METRICS is now dynamically defined inside ProgressAnalytics component.

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
  const [weightLogs, setWeightLogs] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchWeightLogs = () => {
    api.getBodyWeightLogs()
      .then(data => {
        setWeightLogs(data);
      })
      .catch(err => {
        console.error("Failed to load weight logs", err);
      });
  };

  useEffect(() => {
    document.title = 'Analytics | FitFlOOW';
    fetchWeightLogs();
    return () => {
      document.title = 'Saiyan Gym';
    };
  }, []);

  const handleLogWeightSubmit = async (e) => {
    e.preventDefault();
    if (!weightInput || parseFloat(weightInput) <= 0) {
      showToast('Please enter a valid weight in kg.', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.logBodyWeight(weightInput, dateInput);
      showToast('Weight log saved successfully!', 'success');
      setWeightInput('');
      setShowLogForm(false);
      fetchWeightLogs();
    } catch (err) {
      showToast(err.message || 'Failed to save weight log.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const latestWeightLog = weightLogs[weightLogs.length - 1];
  const firstWeightLog = weightLogs[0];
  
  const currentWeightVal = latestWeightLog ? latestWeightLog.weight.toFixed(1) : '75.0';
  const weightChange = latestWeightLog && firstWeightLog 
    ? (latestWeightLog.weight - firstWeightLog.weight)
    : 0.0;
  const weightChangeStr = `${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} kg`;
  const weightChangeDir = weightChange <= 0 ? 'down-good' : 'up-bad';
  
  const weightSparkData = weightLogs.length > 0 
    ? weightLogs.slice(-7).map(l => l.weight)
    : [75.0];

  const bodyMetrics = [
    {
      id: 'metric-weight',
      label: 'Body Weight',
      value: currentWeightVal,
      unit: 'kg',
      change: weightChangeStr,
      changeDir: weightChangeDir,
      period: 'since first log',
      progress: Math.max(Math.min(Math.round((parseFloat(currentWeightVal) / 80) * 100), 100), 10),
      sparkData: weightSparkData,
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

  const renderWeightChart = () => {
    if (!weightLogs || weightLogs.length === 0) {
      return (
        <div className="progress-empty-chart">
          <p>No weight logs recorded yet. Begin by logging your weight!</p>
        </div>
      );
    }

    const padding = 40;
    const width = 800;
    const height = 200;

    const weights = weightLogs.map(l => l.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const rangeY = maxW - minW || 1;

    const points = weightLogs.map((log, index) => {
      const x = padding + (index / (weightLogs.length - 1 || 1)) * (width - 2 * padding);
      const y = height - padding - ((log.weight - minW) / rangeY) * (height - 2 * padding);
      return { x, y, weight: log.weight, date: log.date };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <div className="weight-svg-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="progress-weight-svg">
          {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
            const yVal = height - padding - val * (height - 2 * padding);
            const wLabel = (minW + val * rangeY).toFixed(1);
            return (
              <g key={idx} className="chart-grid-line">
                <line x1={padding} y1={yVal} x2={width - padding} y2={yVal} stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3" />
                <text x={padding - 10} y={yVal + 4} textAnchor="end" fill="var(--portal-text-muted)" fontSize="10">{wLabel} kg</text>
              </g>
            );
          })}

          {points.length > 1 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill="url(#weight-area-grad)"
            />
          )}

          <path d={pathD} fill="none" stroke="var(--portal-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          <defs>
            <linearGradient id="weight-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--portal-accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--portal-accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {points.map((p, i) => (
            <g key={i} className="chart-point-group">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#0d0603"
                stroke="var(--portal-accent)"
                strokeWidth="2.5"
              />
              <title>{`${p.date}: ${p.weight} kg`}</title>
            </g>
          ))}

          {points.map((p, i) => {
            const total = points.length;
            const shouldShow = i === 0 || i === total - 1 || (total > 5 && i === Math.floor(total / 2));
            if (!shouldShow) return null;
            
            let dLabel = p.date;
            try {
              const d = new Date(p.date);
              dLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            } catch {}

            return (
              <text key={i} x={p.x} y={height - 12} textAnchor="middle" fill="var(--portal-text-muted)" fontSize="10">
                {dLabel}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

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
            <div className="progress-header-actions">
              <button
                className="portal-btn-primary progress-log-weight-btn"
                onClick={() => setShowLogForm(!showLogForm)}
                id="progress-log-weight-btn"
              >
                {showLogForm ? 'Close Log' : 'Log Weight'}
              </button>
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
        </div>

        {showLogForm && (
          <form onSubmit={handleLogWeightSubmit} className="portal-card progress-log-weight-form">
            <h3 className="portal-section-title">Log New Body Weight</h3>
            <div className="progress-form-fields">
              <div className="profile-field" style={{ flex: 1, minWidth: '150px' }}>
                <label className="profile-label" htmlFor="weight-log-input">Weight (kg)</label>
                <input
                  id="weight-log-input"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  required
                  placeholder="e.g. 78.5"
                  className="profile-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                />
              </div>
              <div className="profile-field" style={{ flex: 1, minWidth: '150px' }}>
                <label className="profile-label" htmlFor="weight-date-input">Date</label>
                <input
                  id="weight-date-input"
                  type="date"
                  required
                  className="profile-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className="portal-btn-primary progress-form-submit-btn">
                {loading ? 'Saving...' : 'Submit Log'}
              </button>
            </div>
          </form>
        )}

        {/* Body Metrics Cards */}
        <div className="portal-card-grid progress-metrics-grid">
          {bodyMetrics.map(m => (
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

        {/* Body Weight Trend Chart */}
        <section className="progress-chart-section" aria-label="Body weight trend chart">
          <div className="progress-section-header">
            <h2 className="portal-section-title">Body Weight Trend</h2>
            <span className="progress-chart-unit">Weight kinetics history (kg)</span>
          </div>
          <div className="progress-chart-card" style={{ height: 'auto', minHeight: '220px' }}>
            {renderWeightChart()}
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
