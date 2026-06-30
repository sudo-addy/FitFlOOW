import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './ProfilePage.css';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'Marcus Vance',
    email: 'marcus.vance@elite.com',
    phone: '+1 (555) 382-9001',
    tier: 'Warrior Elite',
    powerLevel: 8965,
    height: '185',
    weight: '81.6',
    targetWeight: '80.0',
    publicLeaderboard: true,
    hapticFeedback: true,
    scouterHud: true,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleToggleChange = (field) => {
    setUser({ ...user, [field]: !user[field] });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

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

        {/* Profile Settings Page Content */}
        <main className="profile-content">
          <div className="profile-header-row">
            <div>
              <h1 className="profile-title">MEMBER PROFILE</h1>
              <p className="profile-subtitle">Manage your account information, physical indices, and portal preferences.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="profile-form-grid">
            
            {/* Left Column: Avatar & Subscription details */}
            <div className="profile-left-column">
              <div className="profile-card profile-user-card">
                <div className="profile-avatar-large">
                  <span>MV</span>
                  <div className="avatar-glowing-ring" />
                </div>
                <h3>{user.name}</h3>
                <span className="profile-email-lbl">{user.email}</span>
                
                <div className="membership-status-box">
                  <span className="box-lbl">CURRENT PLAN</span>
                  <span className="box-plan">WARRIOR ELITE</span>
                  <p>Membership valid until Jan 1, 2027</p>
                  <button type="button" className="manage-billing-btn">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Edit Profile details & Toggles */}
            <div className="profile-right-column">
              
              {/* Card 1: Personal Information */}
              <div className="profile-card">
                <h3 className="card-heading">PERSONAL METRICS</h3>
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="p-name">Full Name</label>
                    <input
                      id="p-name"
                      type="text"
                      value={user.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="p-email">Email Address</label>
                    <input
                      id="p-email"
                      type="email"
                      value={user.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="p-phone">Phone Number</label>
                    <input
                      id="p-phone"
                      type="tel"
                      value={user.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Biometrics measurements */}
              <div className="profile-card">
                <h3 className="card-heading">BIOMETRIC SPECIFICATIONS</h3>
                <div className="form-row three-cols">
                  <div className="input-group">
                    <label htmlFor="p-height">Height (cm)</label>
                    <input
                      id="p-height"
                      type="number"
                      value={user.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="p-weight">Current Weight (kg)</label>
                    <input
                      id="p-weight"
                      type="number"
                      step="0.1"
                      value={user.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="p-target">Target Weight (kg)</label>
                    <input
                      id="p-target"
                      type="number"
                      step="0.1"
                      value={user.targetWeight}
                      onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Portal Settings & Toggles */}
              <div className="profile-card">
                <h3 className="card-heading">PORTAL CONFIGURATION</h3>
                <div className="toggles-list">
                  
                  <div className="toggle-row-item">
                    <div className="toggle-info">
                      <h4>Sync with Community Leaderboard</h4>
                      <p>Publish your Ascension Index and metrics on the local member board.</p>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch-btn ${user.publicLeaderboard ? 'on' : 'off'}`}
                      onClick={() => handleToggleChange('publicLeaderboard')}
                    >
                      <span className="switch-slider" />
                    </button>
                  </div>

                  <div className="toggle-row-item">
                    <div className="toggle-info">
                      <h4>Enable Scouter HUD Decorations</h4>
                      <p>Display decorative holographic grids, border tags, and status animations.</p>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch-btn ${user.scouterHud ? 'on' : 'off'}`}
                      onClick={() => handleToggleChange('scouterHud')}
                    >
                      <span className="switch-slider" />
                    </button>
                  </div>

                </div>
              </div>

              {/* CTA save button */}
              <div className="profile-actions-bar">
                <button type="submit" className="save-profile-btn">
                  SAVE CHANGES
                </button>
              </div>

            </div>
          </form>
        </main>
      </div>

      {/* TOAST HUD NOTIFICATION */}
      {showToast && (
        <div className="toast-hud-notification">
          <span className="toast-dot" />
          <span>PORTAL CONFIGURATION UPDATED SUCCESSFULY</span>
        </div>
      )}
    </div>
  );
}
