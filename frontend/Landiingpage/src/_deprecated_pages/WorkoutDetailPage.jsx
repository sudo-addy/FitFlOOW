import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import './WorkoutDetailPage.css';

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useAuth();

  // Mock list of full workouts history for lookup
  const workoutsDatabase = {
    w1: {
      id: 'w1',
      name: 'Push Day — Heavy Chest & Shoulders',
      date: 'June 29, 2026',
      duration: '52 min',
      volume: '8,420 kg',
      exercises: [
        {
          name: 'Incline Barbell Bench Press',
          sets: [
            { weight: 85, reps: 6, rpe: '8.5', completed: true },
            { weight: 85, reps: 6, rpe: '9', completed: true },
            { weight: 85, reps: 5, rpe: '9.5', completed: true },
            { weight: 80, reps: 6, rpe: '8', completed: true }
          ]
        },
        {
          name: 'Overhead Press',
          sets: [
            { weight: 55, reps: 8, rpe: '8.5', completed: true },
            { weight: 55, reps: 7, rpe: '9', completed: true },
            { weight: 50, reps: 8, rpe: '8', completed: true }
          ]
        },
        {
          name: 'Weighted Dips',
          sets: [
            { weight: 15, reps: 10, rpe: '9', completed: true },
            { weight: 15, reps: 9, rpe: '9.5', completed: true },
            { weight: 0, reps: 12, rpe: '8', completed: true }
          ]
        },
        {
          name: 'Dumbbell Lateral Raises',
          sets: [
            { weight: 14, reps: 12, rpe: '9', completed: true },
            { weight: 14, reps: 12, rpe: '9', completed: true },
            { weight: 12, reps: 14, rpe: '8.5', completed: true },
            { weight: 12, reps: 14, rpe: '9', completed: true }
          ]
        }
      ]
    },
    w2: {
      id: 'w2',
      name: 'Pull Day — Back Width & Rear Delts',
      date: 'June 27, 2026',
      duration: '48 min',
      volume: '7,150 kg',
      exercises: [
        {
          name: 'Weighted Pullups',
          sets: [
            { weight: 10, reps: 6, rpe: '9', completed: true },
            { weight: 10, reps: 6, rpe: '9', completed: true },
            { weight: 10, reps: 5, rpe: '9.5', completed: true },
            { weight: 0, reps: 8, rpe: '8', completed: true }
          ]
        },
        {
          name: 'Barbell Row',
          sets: [
            { weight: 75, reps: 8, rpe: '8', completed: true },
            { weight: 75, reps: 8, rpe: '8.5', completed: true },
            { weight: 75, reps: 7, rpe: '9', completed: true }
          ]
        },
        {
          name: 'Lat Pulldowns',
          sets: [
            { weight: 65, reps: 10, rpe: '8', completed: true },
            { weight: 65, reps: 10, rpe: '8.5', completed: true },
            { weight: 60, reps: 12, rpe: '8', completed: true }
          ]
        },
        {
          name: 'Face Pulls',
          sets: [
            { weight: 25, reps: 15, rpe: '8', completed: true },
            { weight: 25, reps: 15, rpe: '8', completed: true },
            { weight: 25, reps: 15, rpe: '8.5', completed: true },
            { weight: 25, reps: 15, rpe: '9', completed: true }
          ]
        }
      ]
    },
    w3: {
      id: 'w3',
      name: 'Leg Day — Squat Strength',
      date: 'June 25, 2026',
      duration: '60 min',
      volume: '11,200 kg',
      exercises: [
        {
          name: 'Barbell Back Squat',
          sets: [
            { weight: 120, reps: 5, rpe: '8.5', completed: true },
            { weight: 120, reps: 5, rpe: '9', completed: true },
            { weight: 120, reps: 5, rpe: '9', completed: true },
            { weight: 120, reps: 4, rpe: '9.5', completed: true },
            { weight: 100, reps: 8, rpe: '8', completed: true }
          ]
        },
        {
          name: 'Romanian Deadlift',
          sets: [
            { weight: 90, reps: 8, rpe: '8', completed: true },
            { weight: 90, reps: 8, rpe: '8', completed: true },
            { weight: 90, reps: 8, rpe: '8.5', completed: true },
            { weight: 90, reps: 8, rpe: '9', completed: true }
          ]
        },
        {
          name: 'Leg Press',
          sets: [
            { weight: 200, reps: 10, rpe: '8', completed: true },
            { weight: 200, reps: 10, rpe: '8', completed: true },
            { weight: 220, reps: 8, rpe: '9', completed: true }
          ]
        },
        {
          name: 'Calf Raises',
          sets: [
            { weight: 80, reps: 15, rpe: '8', completed: true },
            { weight: 80, reps: 15, rpe: '8.5', completed: true },
            { weight: 80, reps: 15, rpe: '8.5', completed: true },
            { weight: 80, reps: 15, rpe: '9', completed: true }
          ]
        }
      ]
    }
  };

  const workout = workoutsDatabase[id] || workoutsDatabase.w1;

  return (
    <div className={`portal-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="portal-view">
        <Topbar />
        
        <main className="detail-content">
          {/* Header Row */}
          <div className="detail-header-row">
            <Link to="/workouts" className="back-link-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="back-arrow-svg">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              BACK TO LOG
            </Link>
          </div>

          {/* Main Detail HUD Card */}
          <div className="detail-hud-card">
            <div className="detail-bg-accent" />
            <div className="detail-hud-meta">
              <span className="detail-date">{workout.date.toUpperCase()}</span>
              <h1 className="detail-title">{workout.name.toUpperCase()}</h1>
              
              <div className="detail-stats-grid">
                <div className="detail-stat-box">
                  <span className="stat-label">DURATION</span>
                  <span className="stat-value">{workout.duration}</span>
                </div>
                <div className="detail-stat-box">
                  <span className="stat-label">TOTAL VOLUME</span>
                  <span className="stat-value">{workout.volume}</span>
                </div>
                <span className="scouter-hud-accent-bar" />
              </div>
            </div>
          </div>

          {/* Exercises breakdown */}
          <div className="detail-exercises-section">
            <h3 className="section-label">PERFORMANCE SPECIFICATIONS</h3>
            <div className="detail-exercises-list">
              {workout.exercises.map((ex, index) => (
                <div key={index} className="detail-ex-card">
                  <div className="ex-card-header">
                    <h4>{ex.name}</h4>
                    <span className="ex-sets-count">{ex.sets.length} sets completed</span>
                  </div>

                  <div className="ex-sets-table-wrapper">
                    <table className="ex-sets-table">
                      <thead>
                        <tr>
                          <th>SET</th>
                          <th>WEIGHT</th>
                          <th>REPS</th>
                          <th>RPE</th>
                          <th>1RM EST.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ex.sets.map((set, sIdx) => {
                          const estimated1RM = (set.weight * (1 + set.reps / 30)).toFixed(1);
                          return (
                            <tr key={sIdx}>
                              <td>{sIdx + 1}</td>
                              <td>{set.weight} kg</td>
                              <td>{set.reps}</td>
                              <td>@{set.rpe}</td>
                              <td className="pr-val">{estimated1RM} kg</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
