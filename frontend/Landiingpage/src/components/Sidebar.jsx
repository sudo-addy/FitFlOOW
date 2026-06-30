import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ user = { name: 'Marcus Vance', tier: 'Warrior Elite', powerLevel: 8965 }, isCollapsed }) {
  const navItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
    {
      path: '/workouts',
      name: 'Workouts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 6.5h11M6.5 12h11M6.5 17.5h11" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
    },
    {
      path: '/classes',
      name: 'Chamber Sessions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      path: '/progress',
      name: 'Analytics',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
      ),
    },
    {
      path: '/nutrition',
      name: 'Nutrition',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
          <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
          <path d="M12 12L2.5 9.5" />
          <path d="M12 12l9.5-2.5" />
        </svg>
      ),
    },
    {
      path: '/achievements',
      name: 'Milestones',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      ),
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  // Helper to extract initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className={`portal-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Logo */}
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-brand-link">
            <svg className="sidebar-logo-svg" viewBox="0 0 256 256" fill="currentColor">
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="sidebar-logo-text">Saiyan Gym</span>
          </Link>
        </div>

        {/* User Quick Info */}
        <div className="sidebar-user-card">
          <div className="sidebar-avatar-wrapper">
            <div className="sidebar-avatar">
              {getInitials(user.name)}
            </div>
            <div className="sidebar-avatar-glow" />
          </div>
          <div className="sidebar-user-details">
            <span className="sidebar-username">{user.name}</span>
            <span className={`sidebar-usertier ${user.tier.toLowerCase().replace(' ', '-')}`}>
              {user.tier}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-name">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick Performance Index Gauge */}
        <div className="sidebar-gauge-box">
          <div className="sidebar-gauge-header">
            <span>ASCENSION INDEX</span>
            <span className="sidebar-gauge-value">{user.powerLevel}</span>
          </div>
          <div className="sidebar-gauge-bar">
            <div
              className="sidebar-gauge-fill"
              style={{ width: `${(user.powerLevel / 9999) * 100}%` }}
            />
          </div>
        </div>

        {/* Logout */}
        <div className="sidebar-footer">
          <Link to="/login" className="sidebar-logout-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Exit Portal</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="portal-mobile-nav" aria-label="Mobile Navigation">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-name">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
