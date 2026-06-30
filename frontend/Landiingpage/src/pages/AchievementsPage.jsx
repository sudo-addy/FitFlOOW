import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './AchievementsPage.css';

export default function AchievementsPage() {
  const [user, setUser] = useState({
    name: 'Marcus Vance',
    tier: 'Warrior Elite',
    powerLevel: 8965,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock milestones database
  const [achievements] = useState([
    {
      id: 'a1',
      name: 'Threshold Breakthrough',
      description: 'Maintained heart rate threshold inside high-intensity target zones for 45 minutes.',
      date: 'Unlocked Today',
      unlocked: true,
      points: '1,000 XP',
      icon: '⚡'
    },
    {
      id: 'a2',
      name: 'Consistent Warrior',
      description: 'Maintained a training streak of 5 consecutive active days.',
      date: 'Unlocked 3 days ago',
      unlocked: true,
      points: '800 XP',
      icon: '🔥'
    },
    {
      id: 'a3',
      name: 'Centurion Lifter',
      description: 'Log any compound lift matching or exceeding 100 kg.',
      date: 'Unlocked 1 week ago',
      unlocked: true,
      points: '1,200 XP',
      icon: '🏋️'
    },
    {
      id: 'a4',
      name: 'Recovery Vault Master',
      description: 'Complete 5 sessions in the cold exposure recovery pools.',
      date: 'Unlocked 2 weeks ago',
      unlocked: true,
      points: '500 XP',
      icon: '❄️'
    },
    // Locked
    {
      id: 'a5',
      name: 'Chamber Master',
      description: 'Attend 20 high-intensity classes in the Conditioning Chambers.',
      date: 'Locked',
      unlocked: false,
      points: '2,000 XP',
      icon: '👑'
    },
    {
      id: 'a6',
      name: 'Apex Athlete',
      description: 'Reach a target Ascension Index rating of 9,500.',
      date: 'Locked',
      unlocked: false,
      points: '3,000 XP',
      icon: '☄️'
    },
    {
      id: 'a7',
      name: 'Iron Giant',
      description: 'Lift a cumulative total volume of 50,000 kg.',
      date: 'Locked',
      unlocked: false,
      points: '1,500 XP',
      icon: '🛡️'
    }
  ]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

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

        {/* Achievements Page Content */}
        <main className="achievements-content">
          <div className="achievements-header-row">
            <div>
              <h1 className="achievements-title">ATHLETIC MILESTONES</h1>
              <p className="achievements-subtitle">Track your unlock history, milestones, and status achievements.</p>
            </div>
          </div>

          {/* Progress summary banner */}
          <div className="achievements-summary-banner">
            <div className="banner-stats-col">
              <span className="banner-lbl">UNLOCKED STATUS</span>
              <div className="banner-count-row">
                <h2>{unlockedCount} / {achievements.length}</h2>
                <span className="banner-badge">WARRIOR LEVEL II</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="banner-points-col">
              <span className="banner-lbl">TOTAL ACCUMULATED POINTS</span>
              <h3>3,500 XP</h3>
              <p>Top 8% of local gym cohort</p>
            </div>
          </div>

          <h2 className="section-label">MILESTONE DATABASE</h2>
          
          {/* Grid list of achievements */}
          <div className="achievements-grid">
            {achievements.map((item) => (
              <div
                key={item.id}
                className={`achievement-card-panel ${item.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon-emblem">
                  <span className="emblem-symbol">{item.icon}</span>
                </div>

                <div className="achievement-card-details">
                  <div className="card-heading-row">
                    <h3>{item.name}</h3>
                    <span className="xp-points">{item.points}</span>
                  </div>
                  <p>{item.description}</p>
                  
                  <div className="card-footer-row">
                    {item.unlocked ? (
                      <span className="unlock-status-badge unlocked">✓ {item.date}</span>
                    ) : (
                      <span className="unlock-status-badge locked">🔒 Locked</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
