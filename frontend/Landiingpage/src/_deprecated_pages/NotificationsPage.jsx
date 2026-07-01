import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import './WorkoutDetailPage.css'; // Share the base HUD detail structures

export default function NotificationsPage() {
  const { isSidebarCollapsed } = useAuth();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'program',
      title: 'New Program Assigned',
      desc: 'Coach Vegeta assigned a new program: Saiyan Elite Strength Phase 2.',
      time: '10 minutes ago',
      unread: true,
      icon: '🛡️'
    },
    {
      id: 2,
      type: 'chamber',
      title: 'Chamber Session Warning',
      desc: 'Your scheduled reservation in Chamber 1 (Conditioning Arena) begins in 30 minutes.',
      time: '30 minutes ago',
      unread: true,
      icon: '⚠️'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Milestone Unlocked',
      desc: 'Congratulations! You unlocked the "Consistent Warrior" milestone today.',
      time: '2 hours ago',
      unread: false,
      icon: '🔥'
    },
    {
      id: 4,
      type: 'system',
      title: 'Weekly Performance Report',
      desc: 'Your weekly performance report has been compiled and is ready for inspection in the analytics tab.',
      time: '1 day ago',
      unread: false,
      icon: '📊'
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleClearNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className={`portal-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="portal-view">
        <Topbar />

        <main className="detail-content">
          <div className="detail-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/dashboard" className="back-link-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="back-arrow-svg">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              DASHBOARD
            </Link>
            
            {notifications.some(n => n.unread) && (
              <button 
                onClick={handleMarkAllRead} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-orange)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.05em'
                }}
              >
                MARK ALL AS READ
              </button>
            )}
          </div>

          <div className="detail-hud-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div className="detail-bg-accent" />
            <h1 className="detail-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>COMMUNICATIONS VAULT</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Read and manage gym announcements, schedules alerts, and system notices.</p>
          </div>

          <div className="detail-exercises-section" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    style={{
                      background: notif.unread ? 'rgba(255, 85, 0, 0.03)' : 'rgba(18, 9, 6, 0.3)',
                      border: notif.unread ? '1px solid rgba(255, 85, 0, 0.2)' : '1px solid rgba(255, 85, 0, 0.05)',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'flex-start',
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem' }}>{notif.icon}</div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>{notif.title}</h4>
                        {notif.unread && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-orange)' }} />}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>{notif.desc}</p>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{notif.time}</span>
                    </div>

                    <button 
                      onClick={() => handleClearNotif(notif.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                      aria-label="Remove alert"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>All quiet in the communications hub. You are fully up to date.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
