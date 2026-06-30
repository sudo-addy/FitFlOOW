import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './ClassesPage.css';

export default function ClassesPage() {
  const [user, setUser] = useState({
    name: 'Marcus Vance',
    tier: 'Warrior Elite',
    powerLevel: 8965,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeDetailsClass, setActiveDetailsClass] = useState(null); // stores class object for modal view

  const weekDays = [
    { label: 'Mon', date: 'Jul 6' },
    { label: 'Tue', date: 'Jul 7' },
    { label: 'Wed', date: 'Jul 8' },
    { label: 'Thu', date: 'Jul 9' },
    { label: 'Fri', date: 'Jul 10' },
    { label: 'Sat', date: 'Jul 11' },
    { label: 'Sun', date: 'Jul 12' }
  ];

  const categories = ['All', 'Strength', 'HIIT', 'Conditioning', 'Recovery'];

  // Mock schedule database
  const [scheduleData, setScheduleData] = useState([
    {
      id: 'c1',
      name: 'Chamber I: Athletic Conditioning',
      category: 'Conditioning',
      time: '08:00 - 08:45',
      day: 'Mon',
      coach: 'Sarah Jenkins',
      coachBio: 'Specializes in high-intensity cardiovascular conditioning and metabolic thresholds.',
      spotsLeft: 4,
      capacity: 12,
      difficulty: 'Intermediate',
      equipment: 'Towel, Hydration flask',
      booked: false,
      waitlisted: false,
    },
    {
      id: 'c2',
      name: 'Lab I: Heavy Strength & Overload',
      category: 'Strength',
      time: '10:00 - 11:00',
      day: 'Mon',
      coach: 'Marcus Vance',
      coachBio: 'Powerlifter and biomechanical movement specialist focusing on hypertrophy.',
      spotsLeft: 0,
      capacity: 8,
      difficulty: 'Advanced',
      equipment: 'Lifting straps, hard-sole footwear',
      booked: false,
      waitlisted: false,
    },
    {
      id: 'c3',
      name: 'Vault II: Hydrotherapy & Recovery',
      category: 'Recovery',
      time: '16:00 - 16:45',
      day: 'Mon',
      coach: 'Sarah Jenkins',
      coachBio: 'Recovery expert specializing in localized cold exposure and tissue regeneration.',
      spotsLeft: 8,
      capacity: 15,
      difficulty: 'Beginner',
      equipment: 'Swimwear required',
      booked: true,
      waitlisted: false,
    },
    {
      id: 'c4',
      name: 'Chamber I: Athletic Conditioning',
      category: 'Conditioning',
      time: '18:30 - 19:15',
      day: 'Mon',
      coach: 'Marcus Vance',
      coachBio: 'Powerlifter and biomechanical movement specialist focusing on hypertrophy.',
      spotsLeft: 2,
      capacity: 12,
      difficulty: 'Intermediate',
      equipment: 'Towel, Hydration flask',
      booked: false,
      waitlisted: false,
    },
    // Tue
    {
      id: 'c5',
      name: 'Lab I: Heavy Strength & Overload',
      category: 'Strength',
      time: '09:00 - 10:00',
      day: 'Tue',
      coach: 'Marcus Vance',
      coachBio: 'Powerlifter and biomechanical movement specialist focusing on hypertrophy.',
      spotsLeft: 3,
      capacity: 8,
      difficulty: 'Advanced',
      equipment: 'Lifting straps, hard-sole footwear',
      booked: false,
      waitlisted: false,
    },
    {
      id: 'c6',
      name: 'Chamber II: HIIT Circuits',
      category: 'HIIT',
      time: '17:30 - 18:15',
      day: 'Tue',
      coach: 'Sarah Jenkins',
      coachBio: 'Specializes in high-intensity cardiovascular conditioning and metabolic thresholds.',
      spotsLeft: 5,
      capacity: 12,
      difficulty: 'Intermediate',
      equipment: 'Athletic wear',
      booked: false,
      waitlisted: false,
    }
  ]);

  const handleBookingToggle = (classId) => {
    setScheduleData(
      scheduleData.map((item) => {
        if (item.id !== classId) return item;
        
        // If waitlisting
        if (item.spotsLeft === 0 && !item.waitlisted && !item.booked) {
          return { ...item, waitlisted: true };
        }
        if (item.waitlisted) {
          return { ...item, waitlisted: false };
        }

        // Standard booking toggle
        if (item.booked) {
          return { ...item, booked: false, spotsLeft: item.spotsLeft + 1 };
        } else {
          return { ...item, booked: true, spotsLeft: item.spotsLeft - 1 };
        }
      })
    );
  };

  const filteredSchedule = scheduleData.filter((item) => {
    const dayMatch = item.day === selectedDay;
    const catMatch = selectedCategory === 'All' || item.category === selectedCategory;
    return dayMatch && catMatch;
  });

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

        {/* Live Booking Page Content */}
        <main className="classes-content">
          {/* Header Row */}
          <div className="classes-header-row">
            <div>
              <h1 className="classes-title">SESSION RESERVATIONS</h1>
              <p className="classes-subtitle">Reserve private training chambers and recovery vaults.</p>
            </div>
          </div>

          {/* Week Days selector bar */}
          <div className="week-selector-bar">
            {weekDays.map((day) => (
              <button
                key={day.label}
                className={`week-day-btn ${selectedDay === day.label ? 'active' : ''}`}
                onClick={() => setSelectedDay(day.label)}
              >
                <span className="week-day-lbl">{day.label}</span>
                <span className="week-day-date">{day.date}</span>
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Schedule List Grid */}
          <div className="schedule-list-grid">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((item) => (
                <div key={item.id} className={`schedule-card ${item.booked ? 'booked' : ''}`}>
                  <div className="card-top-row">
                    <span className={`category-badge ${item.category.toLowerCase()}`}>{item.category}</span>
                    <span className="class-duration-time">{item.time}</span>
                  </div>

                  <h3 className="class-name-title">{item.name}</h3>

                  <div className="class-instructor">
                    <div className="instructor-dot" />
                    <span>Coach: {item.coach}</span>
                  </div>

                  <div className="class-spots-status">
                    <div className="spots-progress-bar">
                      <div
                        className="spots-progress-fill"
                        style={{ width: `${((item.capacity - item.spotsLeft) / item.capacity) * 100}%` }}
                      />
                    </div>
                    <div className="spots-text-row">
                      <span>{item.capacity - item.spotsLeft} / {item.capacity} booked</span>
                      {item.spotsLeft === 0 ? (
                        <span className="spots-alert red">Full</span>
                      ) : (
                        <span className="spots-alert">{item.spotsLeft} left</span>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="class-card-actions">
                    <button
                      type="button"
                      className="details-btn"
                      onClick={() => setActiveDetailsClass(item)}
                    >
                      Details
                    </button>
                    
                    {item.spotsLeft === 0 && !item.booked ? (
                      <button
                        type="button"
                        className={`book-btn waitlist ${item.waitlisted ? 'active' : ''}`}
                        onClick={() => handleBookingToggle(item.id)}
                      >
                        {item.waitlisted ? 'WAITLISTED ✓' : 'JOIN WAITLIST'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`book-btn ${item.booked ? 'active' : ''}`}
                        onClick={() => handleBookingToggle(item.id)}
                      >
                        {item.booked ? 'BOOKED ✓' : 'RESERVE SLOT'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="schedule-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p>No training sessions scheduled for this category on {selectedDay}.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* DETAILED GLASSMORPHIC TRAY MODAL */}
      {activeDetailsClass && (
        <div className="modal-backdrop" onClick={() => setActiveDetailsClass(null)}>
          <div className="success-summary-modal class-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ornament">ℹ</div>
            <h2>{activeDetailsClass.name}</h2>
            <p className="success-tagline">{activeDetailsClass.category} Session</p>

            <div className="details-drawer-content">
              {/* Timing */}
              <div className="drawer-detail-section">
                <h4>Schedule</h4>
                <p>{activeDetailsClass.day} • {activeDetailsClass.time}</p>
              </div>

              {/* Coach details */}
              <div className="drawer-detail-section">
                <h4>Instructor Specialization</h4>
                <p className="coach-highlight">{activeDetailsClass.coach}</p>
                <p className="dim-text">{activeDetailsClass.coachBio}</p>
              </div>

              {/* Requirements & Info */}
              <div className="drawer-detail-section">
                <h4>Difficulty & Requirements</h4>
                <div className="tag-row">
                  <span className="diff-tag">{activeDetailsClass.difficulty}</span>
                </div>
                <p className="dim-text" style={{ marginTop: '0.45rem' }}>
                  <strong>Required gear:</strong> {activeDetailsClass.equipment}
                </p>
              </div>
            </div>

            <div className="modal-actions-row" style={{ marginTop: '1.75rem' }}>
              {activeDetailsClass.spotsLeft === 0 && !activeDetailsClass.booked ? (
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    handleBookingToggle(activeDetailsClass.id);
                    setActiveDetailsClass(null);
                  }}
                >
                  {activeDetailsClass.waitlisted ? 'LEAVE WAITLIST' : 'JOIN WAITLIST'}
                </button>
              ) : (
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    handleBookingToggle(activeDetailsClass.id);
                    setActiveDetailsClass(null);
                  }}
                >
                  {activeDetailsClass.booked ? 'CANCEL RESERVATION' : 'RESERVE SLOT'}
                </button>
              )}
              <button className="modal-cancel-btn" onClick={() => setActiveDetailsClass(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
