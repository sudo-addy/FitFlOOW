import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './WorkoutsPage.css';

export default function WorkoutsPage() {
  const [user] = useState({
    name: 'Marcus Vance',
    tier: 'Warrior Elite',
    powerLevel: 8965,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock past workouts data
  const [pastWorkouts] = useState([
    {
      id: 'w1',
      name: 'Push Day — Heavy Chest & Shoulders',
      date: 'June 29, 2026',
      duration: '52 min',
      volume: '8,420 kg',
      exercises: [
        { name: 'Incline Barbell Bench Press', sets: '4 sets × 6 reps (85 kg)' },
        { name: 'Overhead Press', sets: '3 sets × 8 reps (55 kg)' },
        { name: 'Weighted Dips', sets: '3 sets × 10 reps (+15 kg)' },
        { name: 'Lateral Raises', sets: '4 sets × 12 reps (14 kg)' }
      ]
    },
    {
      id: 'w2',
      name: 'Pull Day — Back Width & Rear Delts',
      date: 'June 27, 2026',
      duration: '48 min',
      volume: '7,150 kg',
      exercises: [
        { name: 'Weighted Pullups', sets: '4 sets × 6 reps (+10 kg)' },
        { name: 'Barbell Row', sets: '3 sets × 8 reps (75 kg)' },
        { name: 'Lat Pulldowns', sets: '3 sets × 10 reps (65 kg)' },
        { name: 'Face Pulls', sets: '4 sets × 15 reps (25 kg)' }
      ]
    },
    {
      id: 'w3',
      name: 'Leg Day — Squat Strength',
      date: 'June 25, 2026',
      duration: '60 min',
      volume: '11,200 kg',
      exercises: [
        { name: 'Barbell Back Squat', sets: '5 sets × 5 reps (120 kg)' },
        { name: 'Romanian Deadlift', sets: '4 sets × 8 reps (90 kg)' },
        { name: 'Leg Press', sets: '3 sets × 10 reps (200 kg)' },
        { name: 'Calf Raises', sets: '4 sets × 15 reps (80 kg)' }
      ]
    }
  ]);

  // Mock Personal Records (PRs)
  const [prs] = useState([
    { lift: 'Deadlift', weight: '210 kg', date: 'June 18, 2026' },
    { lift: 'Back Squat', weight: '165 kg', date: 'June 22, 2026' },
    { lift: 'Bench Press', weight: '125 kg', date: 'June 29, 2026' },
    { lift: 'Overhead Press', weight: '80 kg', date: 'June 12, 2026' }
  ]);

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

        {/* Workouts History Page Panel */}
        <main className="workouts-content">
          {/* Header Row */}
          <div className="workouts-header-row">
            <div>
              <h1 className="workouts-title">WORKOUT LOG</h1>
              <p className="workouts-subtitle">Track, analyze, and exceed your physical benchmarks.</p>
            </div>
            <Link to="/workouts/log" className="start-workout-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              START NEW SESSION
            </Link>
          </div>

          <div className="workouts-layout-grid">
            {/* Left: Past Session Logs */}
            <div className="workouts-left-column">
              <h2 className="section-label">SESSION HISTORY</h2>
              <div className="workouts-list">
                {pastWorkouts.map((workout) => (
                  <div key={workout.id} className="workout-log-card">
                    <div className="log-card-header">
                      <div className="log-card-info">
                        <h3>{workout.name}</h3>
                        <span className="log-card-date">{workout.date}</span>
                      </div>
                      <div className="log-card-meta">
                        <div className="meta-badge duration">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{workout.duration}</span>
                        </div>
                        <div className="meta-badge volume">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 18H18V6H6V18Z" />
                            <path d="M12 2v4M12 18v4M4 12h4M16 12h4" />
                          </svg>
                          <span>{workout.volume}</span>
                        </div>
                      </div>
                    </div>

                    {/* Short preview of exercises inside card */}
                    <div className="log-card-exercises">
                      {workout.exercises.map((exercise, idx) => (
                        <div key={idx} className="exercise-row-item">
                          <span className="ex-item-name">{exercise.name}</span>
                          <span className="ex-item-sets">{exercise.sets}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Personal Records (PRs) */}
            <div className="workouts-right-column">
              <h2 className="section-label">PERSONAL RECORDS</h2>
              <div className="prs-grid">
                {prs.map((pr, idx) => (
                  <div key={idx} className="pr-metric-card">
                    <div className="pr-card-border" />
                    <div className="pr-card-header">
                      <span className="pr-lift-name">{pr.lift}</span>
                      <svg className="pr-trophy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                        <path d="M12 2a5 5 0 0 0-5 5v5a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                      </svg>
                    </div>
                    <div className="pr-weight-display">
                      <span className="pr-weight">{pr.weight}</span>
                      <span className="pr-date">Set on {pr.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Training Tips box */}
              <div className="training-insights-box">
                <h4>Performance Tip</h4>
                <p>
                  To maximize hypertrophic output, aim for progressive overload on your compound exercises. Increment weights by 1.5% - 2% weekly while maintaining absolute control inside the eccentric phase.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
