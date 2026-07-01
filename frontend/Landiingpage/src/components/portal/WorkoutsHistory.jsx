import React, { useState, useMemo } from 'react';
import PortalLayout from './PortalLayout';
import './WorkoutsHistory.css';

/* ── Data ─────────────────────────────────────────────────── */
const allWorkouts = [
  {
    id: 1,
    date: 'Jun 30, 2026',
    name: 'Upper Body Hypertrophy',
    duration: '68 min',
    volume: 6840,
    calories: 420,
    status: 'PR',
    category: 'Strength',
    exercises: [
      'Barbell Bench Press  4×8 @ 120 kg',
      'Incline Dumbbell Press  3×10 @ 34 kg',
      'Cable Fly  3×12 @ 20 kg',
      'Overhead Press  4×6 @ 80 kg',
      'Tricep Rope Pushdown  3×15 @ 22 kg',
    ],
  },
  {
    id: 2,
    date: 'Jun 28, 2026',
    name: 'HIIT Sprint Protocol',
    duration: '35 min',
    volume: 0,
    calories: 390,
    status: 'Completed',
    category: 'Cardio',
    exercises: [
      '10× 200m Sprint @ 90% effort — 60s rest',
      '5× Assault Bike 30s on / 30s off',
      '3× Battle Rope 45s sets',
    ],
  },
  {
    id: 3,
    date: 'Jun 27, 2026',
    name: 'Leg Day — Volume Phase',
    duration: '82 min',
    volume: 12400,
    calories: 510,
    status: 'PR',
    category: 'Strength',
    exercises: [
      'Barbell Squat  5×5 @ 140 kg',
      'Romanian Deadlift  3×10 @ 100 kg',
      'Leg Press  4×12 @ 200 kg',
      'Walking Lunges  3×16 @ 24 kg DBs',
      'Seated Calf Raise  4×15 @ 80 kg',
    ],
  },
  {
    id: 4,
    date: 'Jun 25, 2026',
    name: 'Core & Mobility Flow',
    duration: '40 min',
    volume: 320,
    calories: 185,
    status: 'Completed',
    category: 'Mobility',
    exercises: [
      'Dragon Flag  3×6',
      'Ab Wheel Rollout  3×10',
      'Cable Woodchop  3×12 @ 15 kg',
      'Hip 90/90 Stretch — 5 min',
      'Thoracic Rotation — 3×8 per side',
    ],
  },
  {
    id: 5,
    date: 'Jun 24, 2026',
    name: 'Pull Day — Back & Biceps',
    duration: '75 min',
    volume: 9200,
    calories: 455,
    status: 'Completed',
    category: 'Strength',
    exercises: [
      'Weighted Pull-Up  4×6 @ +20 kg',
      'Barbell Row  4×8 @ 110 kg',
      'Seated Cable Row  3×12 @ 70 kg',
      'Face Pulls  3×15 @ 25 kg',
      'EZ-Bar Curl  3×10 @ 50 kg',
    ],
  },
  {
    id: 6,
    date: 'Jun 22, 2026',
    name: 'Push Day — Chest Focus',
    duration: '70 min',
    volume: 7600,
    calories: 430,
    status: 'Completed',
    category: 'Strength',
    exercises: [
      'Flat Barbell Bench Press  4×6 @ 117.5 kg',
      'Dumbbell Incline Press  3×10 @ 32 kg',
      'Pec Deck Fly  3×14 @ 55 kg',
      'Lateral Raise  4×15 @ 12 kg DBs',
      'Close-Grip Bench  3×8 @ 80 kg',
    ],
  },
  {
    id: 7,
    date: 'Jun 21, 2026',
    name: 'Olympic Lifting Technique',
    duration: '90 min',
    volume: 5100,
    calories: 380,
    status: 'Completed',
    category: 'Strength',
    exercises: [
      'Snatch  5×3 @ 70 kg',
      'Clean & Jerk  4×2 @ 90 kg',
      'Hang Power Clean  4×4 @ 80 kg',
      'Front Squat  3×5 @ 100 kg',
    ],
  },
  {
    id: 8,
    date: 'Jun 19, 2026',
    name: 'Endurance Run — Zone 2',
    duration: '55 min',
    volume: 0,
    calories: 520,
    status: 'Completed',
    category: 'Cardio',
    exercises: [
      '8.5 km steady-state run @ 5:20/km pace',
      'Heart rate: Avg 148 bpm / Max 162 bpm',
      'Cadence: 175 spm',
    ],
  },
  {
    id: 9,
    date: 'Jun 18, 2026',
    name: 'Deadlift & Posterior Chain',
    duration: '65 min',
    volume: 11500,
    calories: 490,
    status: 'PR',
    category: 'Strength',
    exercises: [
      'Conventional Deadlift  1×1 @ 180 kg (PR!)',
      'Romanian Deadlift  4×8 @ 110 kg',
      'Good Morning  3×10 @ 60 kg',
      'Hip Thrust  4×10 @ 120 kg',
      'Nordic Hamstring Curl  3×6',
    ],
  },
  {
    id: 10,
    date: 'Jun 17, 2026',
    name: 'Full Body Power Circuit',
    duration: '50 min',
    volume: 4800,
    calories: 560,
    status: 'Completed',
    category: 'HIIT',
    exercises: [
      'Kettlebell Swing  5×20 @ 32 kg',
      'Box Jump  4×8',
      'Barbell Thruster  4×6 @ 60 kg',
      'Sled Push  6× 20m @ 80 kg',
      'Battle Rope Slams  4×30s',
    ],
  },
];

const FILTERS = ['All Time', 'This Week', 'This Month'];
const categoryColor = { Strength: '#ff5500', Cardio: '#ffaa00', Mobility: '#4ade80', HIIT: '#ff6622' };

/* ── Component ────────────────────────────────────────────── */
export default function WorkoutsHistory() {
  const [filter, setFilter] = useState('All Time');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    return allWorkouts.filter((w) => {
      const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.category.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [search]);

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const totalVolume = allWorkouts.reduce((a, w) => a + w.volume, 0);
  const totalDuration = 680; // minutes
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;

  return (
    <PortalLayout>
      <div className="wh-root">
        {/* Header */}
        <div className="portal-page-header wh-header">
          <div>
            <h1 className="portal-page-title">Battle <span className="portal-highlight">Log</span></h1>
            <p className="portal-page-subtitle">Every rep, every drop of sweat — recorded.</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="wh-summary-grid">
          <div className="wh-summary-card">
            <div className="wh-summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
              </svg>
            </div>
            <div className="wh-summary-value">47</div>
            <div className="wh-summary-label">Total Workouts</div>
          </div>
          <div className="wh-summary-card">
            <div className="wh-summary-icon wh-summary-icon--gold" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="wh-summary-value">52,400</div>
            <div className="wh-summary-label">Total Volume (kg)</div>
          </div>
          <div className="wh-summary-card">
            <div className="wh-summary-icon wh-summary-icon--green" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="wh-summary-value">{hours}h {mins}m</div>
            <div className="wh-summary-label">Total Duration</div>
          </div>
          <div className="wh-summary-card">
            <div className="wh-summary-icon wh-summary-icon--fire" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z" />
              </svg>
            </div>
            <div className="wh-summary-value">14 days</div>
            <div className="wh-summary-label">Best Streak 🔥</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="wh-filter-bar">
          <div className="wh-filter-tabs" role="group" aria-label="Time filter">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`wh-filter-tab${filter === f ? ' wh-filter-tab--active' : ''}`}
                onClick={() => setFilter(f)}
                id={`wh-filter-${f.replace(/\s/g, '-').toLowerCase()}`}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="wh-search-wrap">
            <svg className="wh-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="wh-search-input"
              placeholder="Search workouts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search workouts"
              id="wh-search-input"
            />
          </div>
        </div>

        {/* Workout Rows */}
        <div className="wh-table-wrap">
          {/* Table Header */}
          <div className="wh-table-head">
            <div className="wh-th wh-th--date">Date</div>
            <div className="wh-th wh-th--name">Workout</div>
            <div className="wh-th wh-th--duration">Duration</div>
            <div className="wh-th wh-th--volume">Volume</div>
            <div className="wh-th wh-th--calories">Calories</div>
            <div className="wh-th wh-th--status">Status</div>
            <div className="wh-th wh-th--expand" aria-hidden="true" />
          </div>

          <div className="wh-table-body">
            {filtered.map((w) => {
              const isExpanded = expandedId === w.id;
              return (
                <div key={w.id} className={`wh-row-wrap${isExpanded ? ' wh-row-wrap--expanded' : ''}`}>
                  <button
                    className={`wh-row${isExpanded ? ' wh-row--expanded' : ''}`}
                    onClick={() => toggleExpand(w.id)}
                    id={`wh-row-${w.id}`}
                    aria-expanded={isExpanded}
                    aria-label={`${w.name} — click to ${isExpanded ? 'collapse' : 'expand'}`}
                  >
                    <div className="wh-td wh-td--date">
                      <span className="wh-date">{w.date}</span>
                    </div>
                    <div className="wh-td wh-td--name">
                      <div className="wh-workout-dot" style={{ background: categoryColor[w.category] || '#ff5500' }} aria-hidden="true" />
                      <span className="wh-workout-name">{w.name}</span>
                    </div>
                    <div className="wh-td wh-td--duration">
                      <span>{w.duration}</span>
                    </div>
                    <div className="wh-td wh-td--volume">
                      {w.volume > 0 ? (
                        <span>{w.volume.toLocaleString()} kg</span>
                      ) : (
                        <span className="wh-na">—</span>
                      )}
                    </div>
                    <div className="wh-td wh-td--calories">
                      <span>{w.calories} kcal</span>
                    </div>
                    <div className="wh-td wh-td--status">
                      {w.status === 'PR' ? (
                        <span className="portal-badge portal-badge--warning">⚡ PR</span>
                      ) : (
                        <span className="portal-badge portal-badge--success">✓ Done</span>
                      )}
                    </div>
                    <div className="wh-td wh-td--expand">
                      <span className={`wh-expand-icon${isExpanded ? ' wh-expand-icon--open' : ''}`} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </div>
                  </button>

                  {/* Expandable exercises */}
                  <div className={`wh-exercises${isExpanded ? ' wh-exercises--open' : ''}`} aria-hidden={!isExpanded}>
                    <div className="wh-exercises-inner">
                      <div className="wh-exercises-label">Exercises</div>
                      <ul className="wh-exercise-list">
                        {w.exercises.map((ex, i) => (
                          <li key={i} className="wh-exercise-item">
                            <span className="wh-exercise-num">{String(i + 1).padStart(2, '0')}</span>
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="wh-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p>No workouts found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
