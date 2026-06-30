import React, { useState } from 'react';
import './Topbar.css';

export default function Topbar({ user = { name: 'Kakarot', powerLevel: 9001 }, isCollapsed, onToggle }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Coach Vegeta assigned a new program: Saiyan Elite Strength.', time: '10m ago', unread: true },
    { id: 2, text: 'Your session in Chamber 1 (HIIT Floor) starts in 30 minutes.', time: '30m ago', unread: true },
    { id: 3, text: 'Weekly performance summary generated! Check your progress tab.', time: '1d ago', unread: false },
  ];

  return (
    <header className="portal-topbar">
      {/* User Greeting & Scouter HUD Theme */}
      <div className="topbar-hud">
        {/* Sidebar Collapse Toggle Button */}
        <button
          className="topbar-toggle-btn"
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <div className="topbar-scouter-decorator" aria-hidden="true">
          <span className="scouter-line" />
          <span className="scouter-dot animate-pulse" />
        </div>
        <div className="topbar-welcome">
          <span className="topbar-greeting">Welcome back,</span>
          <span className="topbar-username">{user.name}</span>
        </div>
      </div>

      {/* Action triggers: Notifications & Profile */}
      <div className="topbar-actions">
        {/* Notification Bell */}
        <div className="topbar-notification-wrapper">
          <button
            className="topbar-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="topbar-bell-dot" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="topbar-notif-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                <button className="notif-mark-read">Mark all read</button>
              </div>
              <div className="notif-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                    <p className="notif-text">{notif.text}</p>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Card */}
        <div className="topbar-profile">
          <div className="topbar-power-level">
            <span className="power-lbl">LEVEL</span>
            <span className="power-num">{user.powerLevel}</span>
          </div>
          <div className="topbar-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
