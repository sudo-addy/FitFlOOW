import React, { useState } from 'react';
import PortalLayout from './PortalLayout';
import { useToast } from '../../context/ToastContext';
import './Achievements.css';

const recentAchievements = [
  { id: 'ra1', name: 'Iron Will', earned: '3 days ago', icon: '🔥' },
  { id: 'ra2', name: 'Protein King', earned: '1 week ago', icon: '👑' },
  { id: 'ra3', name: 'Dawn Warrior', earned: '2 weeks ago', icon: '🌅' },
  { id: 'ra4', name: 'Centurion', earned: '1 month ago', icon: '⚔️' },
];

const categories = [
  {
    id: 'strength',
    label: 'Strength Milestones',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
      </svg>
    ),
    achievements: [
      {
        id: 'a1',
        name: 'Deadlift Demon',
        description: 'Pull 200 kg on the deadlift',
        flavor: 'You pulled the earth itself.',
        unlocked: true,
        date: 'Apr 12, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
          </svg>
        ),
      },
      {
        id: 'a2',
        name: 'Triple Plate',
        description: 'Squat 3x your bodyweight',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Squat 3x your bodyweight in a single session.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
          </svg>
        ),
      },
      {
        id: 'a3',
        name: 'Bench God',
        description: 'Bench press 1.5x your bodyweight',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Hit a bench press of 1.5x BW for 1 rep.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="8" rx="2" /><line x1="12" y1="4" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="20" />
          </svg>
        ),
      },
      {
        id: 'a4',
        name: 'Overhead King',
        description: 'Overhead press your bodyweight',
        flavor: 'Push the sky away.',
        unlocked: true,
        date: 'Feb 28, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 15 12 8 19 15" /><line x1="12" y1="8" x2="12" y2="21" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'consistency',
    label: 'Consistency Streaks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    achievements: [
      {
        id: 'b1',
        name: 'Iron Will',
        description: '7-day workout streak',
        flavor: 'Seven days. Seven victories.',
        unlocked: true,
        date: 'Jun 27, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        ),
      },
      {
        id: 'b2',
        name: 'Centurion',
        description: 'Complete 100 total workouts',
        flavor: 'A hundred battles fought.',
        unlocked: true,
        date: 'May 5, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        ),
      },
      {
        id: 'b3',
        name: 'Dawn Warrior',
        description: 'Log a workout before 5 AM',
        flavor: 'While the city sleeps, you train.',
        unlocked: true,
        date: 'Jun 14, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          </svg>
        ),
      },
      {
        id: 'b4',
        name: 'Saiyan God',
        description: '365-day workout streak',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Train every single day for a full year without missing a session.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'endurance',
    label: 'Endurance Feats',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    achievements: [
      {
        id: 'c1',
        name: 'Marathon Soul',
        description: 'Run 42 km total in a week',
        flavor: 'Your lungs are made of iron.',
        unlocked: true,
        date: 'Mar 20, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        ),
      },
      {
        id: 'c2',
        name: 'Iron Lungs',
        description: '60-minute cardio at max heart rate',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Sustain 85%+ of max heart rate for 60 continuous minutes.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
      {
        id: 'c3',
        name: 'Legendary Status',
        description: 'Complete 500 total workouts',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Reach 500 logged workouts total. You are at 134 — keep going.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
      {
        id: 'c4',
        name: 'Sub-4 Minute Mile',
        description: 'Run a mile under 4 minutes',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Record a mile run under 4:00 in a tracked session.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'nutrition',
    label: 'Nutrition Goals',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    achievements: [
      {
        id: 'd1',
        name: 'Protein King',
        description: 'Hit protein goal 30 days in a row',
        flavor: 'Your muscles thank you.',
        unlocked: true,
        date: 'Jun 18, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        ),
      },
      {
        id: 'd2',
        name: 'Calorie Commander',
        description: 'Log every meal for 14 consecutive days',
        flavor: 'What gets tracked, gets mastered.',
        unlocked: true,
        date: 'May 22, 2026',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        id: 'd3',
        name: 'Hydration Monk',
        description: 'Log 3L of water daily for 21 days',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Log at least 3 litres of water every day for 21 straight days.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.5 11 4 15.5 4 18a8 8 0 0 0 16 0c0-2.5-2.5-7-8-16z" />
          </svg>
        ),
      },
      {
        id: 'd4',
        name: 'Shredded Season',
        description: 'Maintain caloric deficit for 60 days',
        flavor: '',
        unlocked: false,
        unlock_hint: 'Sustain a caloric deficit every day for 60 consecutive days.',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
    ],
  },
];

const FILTERS = ['All', 'Unlocked', 'Locked'];

export default function Achievements() {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredLocked, setHoveredLocked] = useState(null);

  const totalAchievements = categories.reduce((sum, c) => sum + c.achievements.length, 0);
  const unlockedCount = categories.reduce(
    (sum, c) => sum + c.achievements.filter((a) => a.unlocked).length,
    0
  );
  const progressPct = Math.round((unlockedCount / totalAchievements) * 100);

  const filterAchievements = (achievements) => {
    if (activeFilter === 'Unlocked') return achievements.filter((a) => a.unlocked);
    if (activeFilter === 'Locked') return achievements.filter((a) => !a.unlocked);
    return achievements;
  };

  const getAchievementEmoji = (id) => {
    const emojiMap = {
      a1: '😈', // Deadlift Demon
      a2: '🏋️‍♂️', // Triple Plate
      a3: '💪', // Bench God
      a4: '👑', // Overhead King
      b1: '🔥', // Iron Will
      b2: '💯', // Centurion
      b3: '🌅', // Dawn Warrior
      b4: '🌟', // Saiyan God
      c1: '🏃‍♂️', // Marathon Soul
      c2: '🫁', // Iron Lungs
      c3: '🏆', // Legendary Status
      c4: '⚡', // Sub-4 Mile
      d1: '🥩', // Protein King
      d2: '📋', // Calorie Commander
      d3: '💧', // Hydration Monk
      d4: '🔪', // Shredded Season
    };
    return emojiMap[id] || '🏆';
  };

  const shareAchievement = (ach) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // 1. Background gradient
    const grad = ctx.createRadialGradient(400, 300, 50, 400, 300, 500);
    grad.addColorStop(0, '#1c0f0a');
    grad.addColorStop(1, '#080403');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);

    // 2. Neon orange/gold double border
    ctx.strokeStyle = '#ff5500';
    ctx.lineWidth = 8;
    ctx.strokeRect(15, 15, 770, 570);

    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 25, 750, 550);

    // 3. Grid design / cyber lines pattern
    ctx.strokeStyle = 'rgba(255, 85, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 40; i < 760; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 40);
      ctx.lineTo(i, 560);
      ctx.stroke();
    }
    for (let j = 40; j < 560; j += 40) {
      ctx.beginPath();
      ctx.moveTo(40, j);
      ctx.lineTo(760, j);
      ctx.stroke();
    }

    // 4. Header branding
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ FITFLOOOW COMMAND CENTER ⚡', 400, 70);

    // 5. Title
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('WARRIOR TITLE UNLOCKED', 400, 115);

    // 6. Glowing badge circle
    ctx.beginPath();
    ctx.arc(400, 240, 75, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 85, 0, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 170, 0, 0.4)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 7. Icon drawing
    ctx.font = '72px Arial';
    ctx.textBaseline = 'middle';
    ctx.fillText(getAchievementEmoji(ach.id), 400, 240);

    // 8. Achievement Name
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(ach.name.toUpperCase(), 400, 375);

    // 9. Achievement Description
    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(ach.description, 400, 415);

    // 10. Flavor text
    if (ach.flavor) {
      ctx.font = 'italic 16px Georgia, serif';
      ctx.fillStyle = '#ffaa00';
      ctx.fillText(`"${ach.flavor}"`, 400, 460);
    }

    // 11. Footer date & motivational line
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`PROVEN IN IRON ON: ${ach.date || 'TODAY'}`, 400, 515);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText('OWN EVERY REP. CONQUER EVERY DAY.', 400, 545);

    const dataUrl = canvas.toDataURL('image/png');

    // Trigger Native Share or Fallback Download
    if (navigator.share) {
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'achievement.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: `Warrior Title: ${ach.name}`,
              text: `I just unlocked the "${ach.name}" warrior title on FitFlOOW! ⚡`,
            }).catch((err) => {
              console.error('Error sharing:', err);
              downloadFallback(dataUrl, ach.name);
            });
          } else {
            downloadFallback(dataUrl, ach.name);
          }
        })
        .catch(() => downloadFallback(dataUrl, ach.name));
    } else {
      downloadFallback(dataUrl, ach.name);
    }
  };

  const downloadFallback = (dataUrl, name) => {
    const link = document.createElement('a');
    link.download = `fitfloow-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
    showToast('Achievement card downloaded! Share it on your socials.', 'success');
  };

  return (
    <PortalLayout>
      <div className="achieve-root">
        {/* Page Header */}
        <div className="portal-page-header achieve-header">
          <div className="achieve-header-left">
            <h1 className="portal-page-title">
              Warrior <span className="portal-highlight">Titles</span>
            </h1>
            <p className="portal-page-subtitle">
              Every rep, every drop of sweat — immortalised in iron.
            </p>
          </div>
          <div className="achieve-header-stats">
            <div className="achieve-stat-pill">
              <span className="achieve-stat-num">{unlockedCount}</span>
              <span className="achieve-stat-sep">/</span>
              <span className="achieve-stat-total">{totalAchievements}</span>
              <span className="achieve-stat-label">Unlocked</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="achieve-progress-block">
          <div className="achieve-progress-top">
            <span className="achieve-progress-label">
              {unlockedCount} / {totalAchievements} Achievements Unlocked
            </span>
            <span className="achieve-progress-pct">{progressPct}%</span>
          </div>
          <div
            className="achieve-progress-track"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="achieve-progress-fill" style={{ width: `${progressPct}%` }}>
              <div className="achieve-progress-glow" />
            </div>
          </div>
        </div>

        {/* Recent Achievements Strip */}
        <div className="achieve-recent-strip">
          <span className="achieve-recent-label">Recent</span>
          {recentAchievements.map((r) => (
            <div key={r.id} className="achieve-recent-pill">
              <span className="achieve-recent-icon" aria-hidden="true">{r.icon}</span>
              <span className="achieve-recent-name">{r.name}</span>
              <span className="achieve-recent-time">{r.earned}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="achieve-filter-tabs" role="tablist" aria-label="Achievement filter">
          {FILTERS.map((f) => (
            <button
              key={f}
              id={`achieve-filter-${f.toLowerCase()}`}
              role="tab"
              aria-selected={activeFilter === f}
              className={`achieve-filter-tab ${activeFilter === f ? 'achieve-filter-tab--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Categories */}
        {categories.map((cat) => {
          const filtered = filterAchievements(cat.achievements);
          if (filtered.length === 0) return null;
          return (
            <section key={cat.id} className="achieve-category">
              <div className="achieve-category-header">
                <span className="achieve-category-icon" aria-hidden="true">{cat.icon}</span>
                <h2 className="portal-section-title achieve-category-title">{cat.label}</h2>
                <span className="achieve-category-count">
                  {cat.achievements.filter((a) => a.unlocked).length}/{cat.achievements.length}
                </span>
              </div>

              <div className="achieve-badge-grid">
                {filtered.map((ach) => (
                  <div
                    key={ach.id}
                    className={`achieve-badge ${ach.unlocked ? 'achieve-badge--unlocked' : 'achieve-badge--locked'}`}
                    onMouseEnter={() => !ach.unlocked && setHoveredLocked(ach.id)}
                    onMouseLeave={() => setHoveredLocked(null)}
                  >
                    {!ach.unlocked && hoveredLocked === ach.id && (
                      <div className="achieve-tooltip" role="tooltip">
                        <svg
                          className="achieve-tooltip-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>{ach.unlock_hint}</span>
                      </div>
                    )}

                    <div className="achieve-badge-icon-wrap">
                      <span className="achieve-badge-icon" aria-hidden="true">{ach.icon}</span>
                      {ach.unlocked && (
                        <span className="achieve-badge-check" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                      {!ach.unlocked && (
                        <span className="achieve-badge-lock" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                      )}
                    </div>

                    <div className="achieve-badge-info">
                      <h3 className="achieve-badge-name">{ach.name}</h3>
                      <p className="achieve-badge-desc">{ach.description}</p>
                      {ach.unlocked ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span className="achieve-badge-date">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {ach.date}
                          </span>
                          <button
                            className="achieve-badge-share-btn"
                            onClick={() => shareAchievement(ach)}
                            title="Share Achievement Card"
                            aria-label={`Share ${ach.name} achievement`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
                            </svg>
                            Share
                          </button>
                        </div>
                      ) : (
                        <span className="achieve-badge-locked-label">???</span>
                      )}
                    </div>

                    {ach.unlocked && ach.flavor && (
                      <div className="achieve-badge-flavor">"{ach.flavor}"</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PortalLayout>
  );
}
