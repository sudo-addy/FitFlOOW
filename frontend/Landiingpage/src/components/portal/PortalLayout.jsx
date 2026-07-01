import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './PortalLayout.css';

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'workouts',
    label: 'Workouts',
    path: '/workouts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
      </svg>
    ),
  },
  {
    id: 'classes',
    label: 'Classes',
    path: '/classes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    path: '/nutrition',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: 'achievements',
    label: 'Achievements',
    path: '/achievements',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'membership',
    label: 'Membership',
    path: '/membership',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

export default function PortalLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = api.getUser() || { name: 'Warrior', tier: 'Elite' };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  return (
    <div className="portal-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="portal-mobile-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`portal-sidebar ${mobileOpen ? 'portal-sidebar--open' : ''}`} aria-label="Portal navigation">
        {/* Logo */}
        <div className="portal-sidebar-logo">
          <Link to="/" className="portal-logo-link" aria-label="Go to Saiyan Gym homepage">
            <svg className="portal-logo-svg" viewBox="0 0 256 256" fill="#ff7700">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="portal-logo-text">Saiyan Gym</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="portal-user-card">
          <div className="portal-user-avatar" aria-hidden="true">
            <span>{user.name ? user.name[0].toUpperCase() : 'W'}</span>
          </div>
          <div className="portal-user-info">
            <span className="portal-user-name">{user.name}</span>
            <span className="portal-user-tier">{user.tier === 'Ascension' ? 'Ascension Member' : 'Elite Member'}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="portal-nav" aria-label="Portal sections">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`portal-nav-item ${isActive ? 'portal-nav-item--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
                id={`portal-nav-${item.id}`}
              >
                <span className="portal-nav-icon" aria-hidden="true">{item.icon}</span>
                <span className="portal-nav-label">{item.label}</span>
                {isActive && <span className="portal-nav-indicator" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        {/* Log Workout shortcut */}
        <div className="portal-sidebar-cta">
          <Link
            to="/workouts/log"
            className="portal-log-btn"
            id="portal-log-workout-btn"
            aria-label="Log a new workout"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Log Workout
          </Link>
        </div>

        {/* Bottom: logout */}
        <div className="portal-sidebar-bottom">
          <button
            className="portal-logout-btn"
            onClick={handleLogout}
            id="portal-logout-btn"
            aria-label="Sign out of member portal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="portal-main">
        {/* Mobile topbar */}
        <header className="portal-topbar" aria-label="Portal top bar">
          <button
            className="portal-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            id="portal-hamburger-btn"
          >
            <span className={`portal-hamburger-bar ${mobileOpen ? 'open' : ''}`} />
            <span className={`portal-hamburger-bar ${mobileOpen ? 'open' : ''}`} />
            <span className={`portal-hamburger-bar ${mobileOpen ? 'open' : ''}`} />
          </button>
          <span className="portal-topbar-title">
            {navItems.find(n => location.pathname.startsWith(n.path))?.label ?? 'Portal'}
          </span>
          <Link to="/workouts/log" className="portal-topbar-log" aria-label="Log workout" id="portal-topbar-log-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Link>
        </header>

        {/* Page content */}
        <main className="portal-content" id="portal-content-main">
          {children}
        </main>
      </div>
    </div>
  );
}
