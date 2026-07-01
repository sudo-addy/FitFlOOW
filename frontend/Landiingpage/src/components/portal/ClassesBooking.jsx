import React, { useState, useEffect } from 'react';
import PortalLayout from './PortalLayout';
import { useToast } from '../../context/ToastContext';
import './ClassesBooking.css';

const DAYS = [
  { key: 'mon', label: 'Mon', date: '30' },
  { key: 'tue', label: 'Tue', date: '1' },
  { key: 'wed', label: 'Wed', date: '2' },
  { key: 'thu', label: 'Thu', date: '3' },
  { key: 'fri', label: 'Fri', date: '4' },
  { key: 'sat', label: 'Sat', date: '5' },
  { key: 'sun', label: 'Sun', date: '6' },
];

const TODAY_KEY = 'mon';

const CLASS_DATA = {
  mon: [
    {
      id: 'cls-001',
      name: 'Hyperion HIIT',
      time: '06:00 AM',
      duration: '45 min',
      instructor: 'Coach Takeda',
      spotsUsed: 9,
      spotsTotal: 12,
      intensity: 'Elite',
      category: 'HIIT',
      description: 'High-velocity intervals pushing your anaerobic threshold to its limit.',
    },
    {
      id: 'cls-002',
      name: 'Dragon Strength Protocol',
      time: '08:30 AM',
      duration: '60 min',
      instructor: 'Master Reyes',
      spotsUsed: 3,
      spotsTotal: 10,
      intensity: 'Champion',
      category: 'Strength',
      description: 'Compound barbell movements forging raw power from ground up.',
    },
    {
      id: 'cls-003',
      name: 'Zenith Mobility Flow',
      time: '12:00 PM',
      duration: '40 min',
      instructor: 'Sensei Yuna',
      spotsUsed: 5,
      spotsTotal: 15,
      intensity: 'Warrior',
      category: 'Mobility',
      description: 'Dynamic stretching and joint mobility protocols for peak performance.',
    },
  ],
  tue: [
    {
      id: 'cls-004',
      name: 'Combat Conditioning',
      time: '07:00 AM',
      duration: '50 min',
      instructor: 'Coach Takeda',
      spotsUsed: 11,
      spotsTotal: 12,
      intensity: 'Champion',
      category: 'Combat',
      description: 'Boxing and MMA-style circuits to sharpen reflexes and endurance.',
    },
    {
      id: 'cls-005',
      name: 'Power Ascension',
      time: '09:00 AM',
      duration: '55 min',
      instructor: 'Master Reyes',
      spotsUsed: 2,
      spotsTotal: 8,
      intensity: 'Elite',
      category: 'Strength',
      description: 'Olympic lifting technique and progressive overload cycles.',
    },
    {
      id: 'cls-006',
      name: 'Iron Endurance',
      time: '06:00 PM',
      duration: '45 min',
      instructor: 'Coach Voss',
      spotsUsed: 7,
      spotsTotal: 12,
      intensity: 'Warrior',
      category: 'Cardio',
      description: 'Aerobic conditioning drills to build an engine that never quits.',
    },
  ],
  wed: [
    {
      id: 'cls-007',
      name: 'Hyperion HIIT',
      time: '06:00 AM',
      duration: '45 min',
      instructor: 'Coach Takeda',
      spotsUsed: 8,
      spotsTotal: 12,
      intensity: 'Elite',
      category: 'HIIT',
      description: 'High-velocity intervals pushing your anaerobic threshold to its limit.',
    },
    {
      id: 'cls-008',
      name: 'Apex Calisthenics',
      time: '10:00 AM',
      duration: '50 min',
      instructor: 'Sensei Yuna',
      spotsUsed: 4,
      spotsTotal: 12,
      intensity: 'Warrior',
      category: 'Calisthenics',
      description: 'Bodyweight mastery — rings, bars, and plyometrics combined.',
    },
    {
      id: 'cls-009',
      name: 'Dragon Strength Protocol',
      time: '05:30 PM',
      duration: '60 min',
      instructor: 'Master Reyes',
      spotsUsed: 6,
      spotsTotal: 10,
      intensity: 'Champion',
      category: 'Strength',
      description: 'Compound barbell movements forging raw power from ground up.',
    },
  ],
  thu: [
    {
      id: 'cls-010',
      name: 'Zenith Mobility Flow',
      time: '07:30 AM',
      duration: '40 min',
      instructor: 'Sensei Yuna',
      spotsUsed: 3,
      spotsTotal: 15,
      intensity: 'Warrior',
      category: 'Mobility',
      description: 'Dynamic stretching and joint mobility protocols for peak performance.',
    },
    {
      id: 'cls-011',
      name: 'Combat Conditioning',
      time: '12:00 PM',
      duration: '50 min',
      instructor: 'Coach Takeda',
      spotsUsed: 10,
      spotsTotal: 12,
      intensity: 'Champion',
      category: 'Combat',
      description: 'Boxing and MMA-style circuits to sharpen reflexes and endurance.',
    },
    {
      id: 'cls-012',
      name: 'Inferno Cardio',
      time: '07:00 PM',
      duration: '35 min',
      instructor: 'Coach Voss',
      spotsUsed: 1,
      spotsTotal: 20,
      intensity: 'Elite',
      category: 'Cardio',
      description: 'Bike and rower sprint intervals for maximum caloric burn.',
    },
  ],
  fri: [
    {
      id: 'cls-013',
      name: 'Power Ascension',
      time: '06:30 AM',
      duration: '55 min',
      instructor: 'Master Reyes',
      spotsUsed: 5,
      spotsTotal: 8,
      intensity: 'Elite',
      category: 'Strength',
      description: 'Olympic lifting technique and progressive overload cycles.',
    },
    {
      id: 'cls-014',
      name: 'Hyperion HIIT',
      time: '09:00 AM',
      duration: '45 min',
      instructor: 'Coach Takeda',
      spotsUsed: 12,
      spotsTotal: 12,
      intensity: 'Elite',
      category: 'HIIT',
      description: 'High-velocity intervals pushing your anaerobic threshold to its limit.',
    },
    {
      id: 'cls-015',
      name: 'Apex Calisthenics',
      time: '06:00 PM',
      duration: '50 min',
      instructor: 'Sensei Yuna',
      spotsUsed: 4,
      spotsTotal: 12,
      intensity: 'Warrior',
      category: 'Calisthenics',
      description: 'Bodyweight mastery — rings, bars, and plyometrics combined.',
    },
  ],
  sat: [
    {
      id: 'cls-016',
      name: 'Saiyan Surge (Full Body)',
      time: '08:00 AM',
      duration: '75 min',
      instructor: 'Master Reyes',
      spotsUsed: 14,
      spotsTotal: 16,
      intensity: 'Champion',
      category: 'Full Body',
      description: 'The ultimate weekend warrior session — no muscle left untouched.',
    },
    {
      id: 'cls-017',
      name: 'Iron Endurance',
      time: '10:30 AM',
      duration: '45 min',
      instructor: 'Coach Voss',
      spotsUsed: 8,
      spotsTotal: 12,
      intensity: 'Warrior',
      category: 'Cardio',
      description: 'Aerobic conditioning drills to build an engine that never quits.',
    },
    {
      id: 'cls-018',
      name: 'Zenith Mobility Flow',
      time: '01:00 PM',
      duration: '40 min',
      instructor: 'Sensei Yuna',
      spotsUsed: 6,
      spotsTotal: 15,
      intensity: 'Warrior',
      category: 'Mobility',
      description: 'Dynamic stretching and joint mobility protocols for peak performance.',
    },
  ],
  sun: [
    {
      id: 'cls-019',
      name: 'Dragon Strength Protocol',
      time: '09:00 AM',
      duration: '60 min',
      instructor: 'Master Reyes',
      spotsUsed: 4,
      spotsTotal: 10,
      intensity: 'Champion',
      category: 'Strength',
      description: 'Compound barbell movements forging raw power from ground up.',
    },
    {
      id: 'cls-020',
      name: 'Combat Conditioning',
      time: '11:00 AM',
      duration: '50 min',
      instructor: 'Coach Takeda',
      spotsUsed: 9,
      spotsTotal: 12,
      intensity: 'Champion',
      category: 'Combat',
      description: 'Boxing and MMA-style circuits to sharpen reflexes and endurance.',
    },
    {
      id: 'cls-021',
      name: 'Recovery & Restore',
      time: '02:00 PM',
      duration: '45 min',
      instructor: 'Sensei Yuna',
      spotsUsed: 2,
      spotsTotal: 20,
      intensity: 'Warrior',
      category: 'Recovery',
      description: 'Guided deep tissue work, breathwork and active recovery protocols.',
    },
  ],
};

const INTENSITY_CONFIG = {
  Warrior: { cls: 'classes-badge--warrior', label: 'Warrior' },
  Elite: { cls: 'classes-badge--elite', label: 'Elite' },
  Champion: { cls: 'classes-badge--champion', label: 'Champion' },
};

export default function ClassesBooking() {
  const { showToast } = useToast();
  const [activeDay, setActiveDay] = useState(TODAY_KEY);
  const [bookedIds, setBookedIds] = useState(new Set(['cls-002', 'cls-007']));
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    document.title = 'Book Classes | FitFlOOW';
    return () => {
      document.title = 'Saiyan Gym';
    };
  }, []);

  const toggleBook = (id, isFull) => {
    const allCls = Object.values(CLASS_DATA).flat();
    const targetClass = allCls.find(c => c.id === id);
    const className = targetClass ? targetClass.name : 'Class';

    if (isFull && !bookedIds.has(id)) {
      showToast('Class is full! Try another chamber.', 'error');
      return;
    }

    setBookedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast(`Cancelled booking for: ${className}`, 'info');
      } else {
        next.add(id);
        showToast(`Successfully booked: ${className}!`, 'success');
      }
      return next;
    });
  };

  const dayClasses = CLASS_DATA[activeDay] || [];
  const allBooked = Object.values(CLASS_DATA).flat().filter(c => bookedIds.has(c.id));

  const filteredClasses = dayClasses.filter(c => {
    if (filter === 'booked') return bookedIds.has(c.id);
    if (filter === 'available') return !bookedIds.has(c.id) && c.spotsUsed < c.spotsTotal;
    return true;
  });

  const CategoryIcon = ({ cat }) => {
    const icons = {
      HIIT: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
      Strength: <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />,
      Mobility: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></>,
      Cardio: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
      Combat: <><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" /><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" /></>,
      Calisthenics: <><circle cx="12" cy="5" r="2" /><path d="M12 7v6m0 0-3 4m3-4 3 4" /><path d="M8 14H5m11 0h3" /></>,
      'Full Body': <><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /></>,
      Recovery: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    };
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icons[cat] || icons['Strength']}
      </svg>
    );
  };

  return (
    <PortalLayout>
      <div className="classes-page">
        {/* Header */}
        <div className="portal-page-header">
          <div className="classes-header-row">
            <div>
              <h1 className="portal-page-title">
                Ascension <span className="portal-highlight">Chambers</span>
              </h1>
              <p className="portal-page-subtitle">Book your training sessions — claim your spot before it's gone</p>
            </div>
            <div className="classes-header-stats">
              <div className="classes-stat-pill">
                <span className="classes-stat-num">{bookedIds.size}</span>
                <span className="classes-stat-lbl">Booked</span>
              </div>
              <div className="classes-stat-pill classes-stat-pill--gold">
                <span className="classes-stat-num">3</span>
                <span className="classes-stat-lbl">This Week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Week selector */}
        <div className="classes-week-selector" role="tablist" aria-label="Select training day">
          {DAYS.map(day => (
            <button
              key={day.key}
              id={`classes-day-${day.key}`}
              role="tab"
              aria-selected={activeDay === day.key}
              className={`classes-day-tab ${activeDay === day.key ? 'classes-day-tab--active' : ''} ${day.key === TODAY_KEY ? 'classes-day-tab--today' : ''}`}
              onClick={() => setActiveDay(day.key)}
            >
              <span className="classes-day-label">{day.label}</span>
              <span className="classes-day-date">{day.date}</span>
              {day.key === TODAY_KEY && <span className="classes-today-dot" aria-label="Today" />}
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="classes-filter-row">
          <div className="classes-filter-tabs">
            {['all', 'available', 'booked'].map(f => (
              <button
                key={f}
                id={`classes-filter-${f}`}
                className={`classes-filter-btn ${filter === f ? 'classes-filter-btn--active' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'booked' && bookedIds.size > 0 && (
                  <span className="classes-filter-count">{bookedIds.size}</span>
                )}
              </button>
            ))}
          </div>
          <p className="classes-showing-label">
            Showing <strong>{filteredClasses.length}</strong> class{filteredClasses.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Class cards grid */}
        {filteredClasses.length === 0 ? (
          <div className="classes-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p>No classes match this filter for the selected day.</p>
          </div>
        ) : (
          <div className="classes-grid">
            {filteredClasses.map(cls => {
              const isBooked = bookedIds.has(cls.id);
              const isFull = cls.spotsUsed >= cls.spotsTotal;
              const spotsLeft = cls.spotsTotal - cls.spotsUsed;
              const fillPct = (cls.spotsUsed / cls.spotsTotal) * 100;
              const intensityCfg = INTENSITY_CONFIG[cls.intensity];
              return (
                <article
                  key={cls.id}
                  className={`classes-card ${isBooked ? 'classes-card--booked' : ''} ${isFull && !isBooked ? 'classes-card--full' : ''}`}
                  aria-label={`${cls.name} class`}
                >
                  <div className="classes-card-top">
                    <div className="classes-card-icon" aria-hidden="true">
                      <CategoryIcon cat={cls.category} />
                    </div>
                    <div className="classes-card-badges">
                      <span className={`classes-intensity-badge ${intensityCfg.cls}`}>
                        {intensityCfg.label}
                      </span>
                      {isBooked && (
                        <span className="classes-booked-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Booked
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="classes-card-name">{cls.name}</h3>
                  <p className="classes-card-desc">{cls.description}</p>

                  <div className="classes-card-meta-row">
                    <span className="classes-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {cls.time}
                    </span>
                    <span className="classes-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {cls.duration}
                    </span>
                    <span className="classes-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      {cls.instructor}
                    </span>
                  </div>

                  <div className="classes-spots-row">
                    <span className="classes-spots-text">
                      {isFull ? 'Class Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                    </span>
                    <span className="classes-spots-count">{cls.spotsUsed}/{cls.spotsTotal}</span>
                  </div>
                  <div className="classes-spots-bar" role="progressbar" aria-valuenow={cls.spotsUsed} aria-valuemax={cls.spotsTotal}>
                    <div
                      className={`classes-spots-fill ${fillPct >= 90 ? 'classes-spots-fill--danger' : fillPct >= 60 ? 'classes-spots-fill--warning' : 'classes-spots-fill--ok'}`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>

                  <button
                    id={`classes-book-btn-${cls.id}`}
                    className={`classes-book-btn ${isBooked ? 'classes-book-btn--cancel' : isFull ? 'classes-book-btn--full' : 'classes-book-btn--book'}`}
                    onClick={() => toggleBook(cls.id, isFull)}
                    disabled={isFull && !isBooked}
                    aria-label={isBooked ? `Cancel booking for ${cls.name}` : isFull ? `${cls.name} is full` : `Book ${cls.name}`}
                  >
                    {isBooked ? 'Cancel Booking' : isFull ? 'Class Full' : 'Book Session'}
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {/* Booked classes section */}
        {allBooked.length > 0 && (
          <section className="classes-booked-section" aria-label="Your booked classes">
            <div className="portal-divider" />
            <h2 className="portal-section-title">Your Upcoming Sessions</h2>
            <div className="classes-booked-list">
              {allBooked.map(cls => (
                <div key={cls.id} className="classes-booked-item">
                  <div className="classes-booked-accent" aria-hidden="true" />
                  <div className="classes-booked-info">
                    <span className="classes-booked-name">{cls.name}</span>
                    <span className="classes-booked-detail">{cls.time} &middot; {cls.duration} &middot; {cls.instructor}</span>
                  </div>
                  <span className={`classes-intensity-badge ${INTENSITY_CONFIG[cls.intensity].cls}`}>
                    {cls.intensity}
                  </span>
                  <button
                    id={`classes-cancel-booked-${cls.id}`}
                    className="classes-cancel-icon-btn"
                    onClick={() => toggleBook(cls.id, false)}
                    aria-label={`Cancel booking for ${cls.name}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PortalLayout>
  );
}
