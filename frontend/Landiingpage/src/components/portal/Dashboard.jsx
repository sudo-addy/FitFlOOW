import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from './PortalLayout';
import { api } from '../../utils/api';
import './Dashboard.css';
import SkeletonLoader from './SkeletonLoader';

/* ── Animated number hook ─────────────────────────────────── */
function useCountUp(target, duration = 1500, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let timeout;
    let raf;
    const start = () => {
      const startTime = performance.now();
      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    timeout = setTimeout(start, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return value;
}

const categoryColor = { Strength: '#ff5500', Cardio: '#ffaa00', Mobility: '#4ade80', HIIT: '#ff5500', Yoga: '#a78bfa' };

export default function Dashboard() {
  const [data, setData] = useState({
    stats: { caloriesBurned: 0, workoutsThisWeek: 0, streak: 0, personalRecords: 0 },
    recentWorkouts: [],
    upcomingClasses: []
  });
  const [loading, setLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    document.title = 'Dashboard | FitFlOOW';
    api.getDashboard()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
    return () => {
      document.title = 'Saiyan Gym';
    };
  }, []);

  const calories = useCountUp(data.stats.caloriesBurned, 1500, 100);
  const workouts = useCountUp(data.stats.workoutsThisWeek, 800, 300);
  const streak = useCountUp(data.stats.streak, 1000, 500);
  const prs = useCountUp(data.stats.personalRecords, 600, 700);

  if (loading) {
    return (
      <PortalLayout>
        <SkeletonLoader type="dashboard" />
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="dash-root">
        {/* Page Header */}
        <div className="portal-page-header dash-header">
          <div>
            <h1 className="portal-page-title">Command <span className="portal-highlight">Center</span></h1>
            <p className="portal-page-subtitle">Your ascension overview — keep pushing, warrior.</p>
          </div>
          <div className="dash-header-date">
            <span className="dash-date-label">Today</span>
            <span className="dash-date-value">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="dash-stat-grid">
          <div className="dash-stat-card dash-stat-card--calories">
            <div className="dash-stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div className="portal-card-label">Today's Calories Burned</div>
            <div className="dash-stat-value">
              <span className="dash-stat-number">{calories.toLocaleString()}</span>
              <span className="dash-stat-unit">kcal</span>
            </div>
            <div className="dash-stat-bar"><div className="dash-stat-bar-fill" style={{ width: `${Math.min(100, (calories / 1200) * 100)}%` }} /></div>
            <div className="portal-card-meta">Goal: 1,200 kcal · {Math.round((calories / 1200) * 100)}% complete</div>
          </div>

          <div className="dash-stat-card dash-stat-card--workouts">
            <div className="dash-stat-icon dash-stat-icon--gold" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" /></svg>
            </div>
            <div className="portal-card-label">Workouts This Week</div>
            <div className="dash-stat-value">
              <span className="dash-stat-number">{workouts}</span>
              <span className="dash-stat-unit">/ 6</span>
            </div>
            <div className="dash-week-dots">
              {['M','T','W','T','F','S','S'].map((day, i) => (
                <div key={i} className={`dash-week-dot${i < workouts ? ' dash-week-dot--done' : ''}`}><span>{day}</span></div>
              ))}
            </div>
            <div className="portal-card-meta">{Math.max(0, 6 - workouts)} more to hit your weekly target</div>
          </div>

          <div className="dash-stat-card dash-stat-card--streak">
            <div className="dash-stat-icon dash-stat-icon--fire" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 6-6 8-6 14a6 6 0 0 0 12 0c0-6-6-8-6-14z" /><path d="M12 12c0 3-2 4-2 6a2 2 0 0 0 4 0c0-2-2-3-2-6z" /></svg>
            </div>
            <div className="portal-card-label">Current Streak</div>
            <div className="dash-stat-value">
              <span className="dash-stat-number">{streak}</span>
              <span className="dash-stat-unit">days 🔥</span>
            </div>
            <div className="dash-streak-msg">Personal best: 21 days</div>
            <div className="portal-card-meta">Don't break the chain!</div>
          </div>

          <div className="dash-stat-card dash-stat-card--pr">
            <div className="dash-stat-icon dash-stat-icon--trophy" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16M12 17v5" /><rect x="6" y="2" width="12" height="13" rx="2" /></svg>
            </div>
            <div className="portal-card-label">Personal Records</div>
            <div className="dash-stat-value">
              <span className="dash-stat-number dash-stat-number--gold">{prs}</span>
              <span className="dash-stat-unit">unlocked</span>
            </div>
            <div className="dash-pr-list"><span>Deadlift Demon</span><span>·</span><span>Iron Will</span><span>·</span><span>Dawn Warrior</span></div>
            <div className="portal-card-meta">Beast mode activated ⚡</div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2 className="portal-section-title">Recent Activity</h2>
            <Link to="/workouts" className="dash-see-all" id="dash-see-all-workouts">
              View All
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="dash-activity-list">
            {data.recentWorkouts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No recent workouts logged yet.</div>
            ) : (
              data.recentWorkouts.map((w) => (
                <div
                  key={w.id}
                  className={`dash-activity-row${hoveredRow === w.id ? ' dash-activity-row--hover' : ''}`}
                  onMouseEnter={() => setHoveredRow(w.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div className="dash-activity-dot" style={{ background: '#ff5500' }} aria-hidden="true" />
                  <div className="dash-activity-info">
                    <span className="dash-activity-name">{w.name}</span>
                    <span className="dash-activity-meta">{new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="dash-activity-tags"><span className="dash-activity-tag">{w.volume} kg</span></div>
                  <div className="dash-activity-stats">
                    <div className="dash-activity-stat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {w.duration} min
                    </div>
                    <div className="dash-activity-stat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                      {w.calories} kcal
                    </div>
                  </div>
                  <div className="dash-activity-chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Bottom Grid ── */}
        <div className="dash-bottom-grid">
          {/* Upcoming Bookings */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="portal-section-title">Upcoming Classes</h2>
              <Link to="/classes" className="dash-see-all" id="dash-see-all-classes">
                Book More
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="dash-classes-list">
              {data.upcomingClasses.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No upcoming bookings. Join a class session!</div>
              ) : (
                data.upcomingClasses.map((cls) => (
                  <div key={cls.id} className="dash-class-card">
                    <div className="dash-class-badge" style={{ background: '#ff5500' }}>{cls.intensity}</div>
                    <div className="dash-class-info">
                      <span className="dash-class-name">{cls.className}</span>
                      <span className="dash-class-time">{cls.date} · {cls.time}</span>
                      <span className="dash-class-instructor">with {cls.instructor}</span>
                    </div>
                    <div className="dash-class-meta">
                      <span className="portal-badge portal-badge--success">Booked</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-section">
            <h2 className="portal-section-title">Quick Actions</h2>
            <div className="dash-quick-actions">
              <Link to="/workouts/log" className="dash-action-card" id="dash-action-log-workout" aria-label="Log a new workout">
                <div className="dash-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" /></svg>
                </div>
                <span className="dash-action-label">Log Workout</span>
                <span className="dash-action-sub">Track your session</span>
              </Link>
              <Link to="/classes" className="dash-action-card" id="dash-action-book-class" aria-label="Book a class">
                <div className="dash-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </div>
                <span className="dash-action-label">Book Class</span>
                <span className="dash-action-sub">Join a live session</span>
              </Link>
              <Link to="/progress" className="dash-action-card" id="dash-action-view-progress" aria-label="View progress charts">
                <div className="dash-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                </div>
                <span className="dash-action-label">View Progress</span>
                <span className="dash-action-sub">Charts & milestones</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

