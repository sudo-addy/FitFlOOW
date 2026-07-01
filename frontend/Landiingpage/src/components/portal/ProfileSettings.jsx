import React, { useState, useRef } from 'react';
import PortalLayout from './PortalLayout';
import { useToast } from '../../context/ToastContext';
import './ProfileSettings.css';

export default function ProfileSettings() {
  /* ---- Personal Info ---- */
  const [personal, setPersonal] = useState({
    firstName: 'Arjun',
    lastName: 'Varma',
    email: 'arjun.varma@saiyanfit.com',
    dob: '1997-03-15',
    phone: '+91 98765 43210',
  });

  /* ---- Fitness Profile ---- */
  const [fitness, setFitness] = useState({
    height: '183',
    weight: '82.4',
    goal: 'Hypertrophy',
    experience: 'Intermediate',
  });

  /* ---- Preferences ---- */
  const [prefs, setPrefs] = useState({
    emailNotif: true,
    pushNotif: true,
    smsNotif: false,
    workoutTime: 'Early Morning (5–7 AM)',
    language: 'English',
  });

  /* ---- Security ---- */
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFA: true,
  });

  const { showToast } = useToast();

  /* ---- Save feedback states ---- */
  const [saved, setSaved] = useState({ personal: false, fitness: false, prefs: false, security: false });

  const handleSave = (section) => {
    setSaved((prev) => ({ ...prev, [section]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [section]: false })), 2200);

    const labels = {
      personal: 'Personal info',
      fitness: 'Fitness profile',
      prefs: 'Preferences',
      security: 'Security configuration'
    };
    showToast(`${labels[section] || 'Settings'} updated successfully!`, 'success');
  };

  /* ---- Avatar upload simulation ---- */
  const fileInputRef = useRef(null);
  const [avatarInitials] = useState('W');

  return (
    <PortalLayout>
      <div className="profile-root">
        {/* Page Header */}
        <div className="portal-page-header">
          <h1 className="portal-page-title">
            Warrior <span className="portal-highlight">Profile</span>
          </h1>
          <p className="portal-page-subtitle">
            Forge your identity. Configure your training preferences.
          </p>
        </div>

        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-ring">
              <div className="profile-avatar-circle" aria-label="Profile avatar showing initials">
                <span className="profile-avatar-initials">{avatarInitials}</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="profile-avatar-file-input"
              id="profile-avatar-upload"
              aria-label="Upload profile photo"
              onChange={() => {}}
            />
            <button
              className="profile-avatar-edit-btn"
              onClick={() => fileInputRef.current?.click()}
              id="profile-avatar-edit-btn"
              aria-label="Change profile photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          <div className="profile-avatar-info">
            <p className="profile-avatar-name">Arjun Varma</p>
            <span className="portal-badge portal-badge--warning">Elite Warrior</span>
            <p className="profile-avatar-since">Member since Jan 2024 &nbsp;·&nbsp; 134 workouts completed</p>
          </div>
        </div>

        <div className="portal-divider" />

        {/* ---- 1. Personal Info ---- */}
        <section className="profile-section" aria-labelledby="profile-personal-heading">
          <div className="profile-section-header">
            <div className="profile-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 id="profile-personal-heading" className="profile-section-title">Personal Info</h2>
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-first-name">First Name</label>
              <input
                id="profile-first-name"
                type="text"
                className="profile-input"
                value={personal.firstName}
                onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                autoComplete="given-name"
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-last-name">Last Name</label>
              <input
                id="profile-last-name"
                type="text"
                className="profile-input"
                value={personal.lastName}
                onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                autoComplete="family-name"
              />
            </div>
            <div className="profile-field profile-field--full">
              <label className="profile-label" htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                type="email"
                className="profile-input"
                value={personal.email}
                onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-dob">Date of Birth</label>
              <input
                id="profile-dob"
                type="date"
                className="profile-input"
                value={personal.dob}
                onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-phone">Phone Number</label>
              <input
                id="profile-phone"
                type="tel"
                className="profile-input"
                value={personal.phone}
                onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="profile-section-footer">
            <button
              id="profile-save-personal-btn"
              className={`portal-btn-primary profile-save-btn ${saved.personal ? 'profile-save-btn--saved' : ''}`}
              onClick={() => handleSave('personal')}
            >
              {saved.personal ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </section>

        <div className="portal-divider" />

        {/* ---- 2. Fitness Profile ---- */}
        <section className="profile-section" aria-labelledby="profile-fitness-heading">
          <div className="profile-section-header">
            <div className="profile-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
              </svg>
            </div>
            <h2 id="profile-fitness-heading" className="profile-section-title">Fitness Profile</h2>
          </div>

          <div className="profile-form-grid">
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-height">Height</label>
              <div className="profile-input-unit-wrap">
                <input
                  id="profile-height"
                  type="number"
                  className="profile-input profile-input--unit"
                  value={fitness.height}
                  onChange={(e) => setFitness({ ...fitness, height: e.target.value })}
                  min="100"
                  max="250"
                />
                <span className="profile-input-unit">cm</span>
              </div>
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-weight">Weight</label>
              <div className="profile-input-unit-wrap">
                <input
                  id="profile-weight"
                  type="number"
                  className="profile-input profile-input--unit"
                  value={fitness.weight}
                  onChange={(e) => setFitness({ ...fitness, weight: e.target.value })}
                  step="0.1"
                  min="30"
                  max="300"
                />
                <span className="profile-input-unit">kg</span>
              </div>
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-goal">Training Goal</label>
              <select
                id="profile-goal"
                className="profile-input profile-select"
                value={fitness.goal}
                onChange={(e) => setFitness({ ...fitness, goal: e.target.value })}
              >
                <option value="Strength">Strength</option>
                <option value="Hypertrophy">Hypertrophy</option>
                <option value="Endurance">Endurance</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-experience">Training Experience</label>
              <select
                id="profile-experience"
                className="profile-input profile-select"
                value={fitness.experience}
                onChange={(e) => setFitness({ ...fitness, experience: e.target.value })}
              >
                <option value="Beginner">Beginner (0–1 year)</option>
                <option value="Intermediate">Intermediate (1–3 years)</option>
                <option value="Advanced">Advanced (3–5 years)</option>
                <option value="Elite">Elite (5+ years)</option>
              </select>
            </div>
          </div>

          <div className="profile-bmi-strip">
            <div className="profile-bmi-item">
              <span className="profile-bmi-label">BMI</span>
              <span className="profile-bmi-value">
                {(fitness.weight / ((fitness.height / 100) ** 2)).toFixed(1)}
              </span>
              <span className="profile-bmi-cat portal-badge portal-badge--success">Normal</span>
            </div>
            <div className="profile-bmi-item">
              <span className="profile-bmi-label">Ideal Weight Range</span>
              <span className="profile-bmi-value">
                {(18.5 * (fitness.height / 100) ** 2).toFixed(0)}–{(24.9 * (fitness.height / 100) ** 2).toFixed(0)} kg
              </span>
            </div>
            <div className="profile-bmi-item">
              <span className="profile-bmi-label">TDEE (est.)</span>
              <span className="profile-bmi-value">2,840 kcal</span>
            </div>
          </div>

          <div className="profile-section-footer">
            <button
              id="profile-save-fitness-btn"
              className={`portal-btn-primary profile-save-btn ${saved.fitness ? 'profile-save-btn--saved' : ''}`}
              onClick={() => handleSave('fitness')}
            >
              {saved.fitness ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </section>

        <div className="portal-divider" />

        {/* ---- 3. Preferences ---- */}
        <section className="profile-section" aria-labelledby="profile-prefs-heading">
          <div className="profile-section-header">
            <div className="profile-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h2 id="profile-prefs-heading" className="profile-section-title">Preferences</h2>
          </div>

          <div className="profile-prefs-group">
            <p className="profile-prefs-group-label">Notification Channels</p>
            <div className="profile-toggle-list">
              {[
                { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive workout reminders and summaries via email.' },
                { key: 'pushNotif', label: 'Push Notifications', desc: 'Instant alerts on your phone or browser.' },
                { key: 'smsNotif', label: 'SMS Alerts', desc: 'Text messages for class confirmations and bookings.' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="profile-toggle-row">
                  <div className="profile-toggle-info">
                    <span className="profile-toggle-label">{label}</span>
                    <span className="profile-toggle-desc">{desc}</span>
                  </div>
                  <button
                    id={`profile-toggle-${key}`}
                    role="switch"
                    aria-checked={prefs[key]}
                    aria-label={label}
                    className={`profile-toggle-switch ${prefs[key] ? 'profile-toggle-switch--on' : ''}`}
                    onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}
                  >
                    <span className="profile-toggle-knob" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-form-grid profile-form-grid--half">
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-workout-time">Preferred Workout Time</label>
              <select
                id="profile-workout-time"
                className="profile-input profile-select"
                value={prefs.workoutTime}
                onChange={(e) => setPrefs({ ...prefs, workoutTime: e.target.value })}
              >
                <option>Early Morning (5–7 AM)</option>
                <option>Morning (7–9 AM)</option>
                <option>Noon (12–2 PM)</option>
                <option>Evening (5–7 PM)</option>
                <option>Night (8–10 PM)</option>
              </select>
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-language">Language</label>
              <select
                id="profile-language"
                className="profile-input profile-select"
                value={prefs.language}
                onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Kannada</option>
                <option>Marathi</option>
              </select>
            </div>
          </div>

          <div className="profile-section-footer">
            <button
              id="profile-save-prefs-btn"
              className={`portal-btn-primary profile-save-btn ${saved.prefs ? 'profile-save-btn--saved' : ''}`}
              onClick={() => handleSave('prefs')}
            >
              {saved.prefs ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </section>

        <div className="portal-divider" />

        {/* ---- 4. Security ---- */}
        <section className="profile-section" aria-labelledby="profile-security-heading">
          <div className="profile-section-header">
            <div className="profile-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2 id="profile-security-heading" className="profile-section-title">Security</h2>
          </div>

          <div className="profile-form-grid">
            <div className="profile-field profile-field--full">
              <label className="profile-label" htmlFor="profile-current-pw">Current Password</label>
              <input
                id="profile-current-pw"
                type="password"
                className="profile-input"
                value={security.currentPassword}
                placeholder="Enter your current password"
                onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                autoComplete="current-password"
              />
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-new-pw">New Password</label>
              <input
                id="profile-new-pw"
                type="password"
                className="profile-input"
                value={security.newPassword}
                placeholder="Min. 8 characters"
                onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                autoComplete="new-password"
              />
              {security.newPassword.length > 0 && (
                <div className="profile-pw-strength">
                  <div className={`profile-pw-bar ${security.newPassword.length >= 8 ? 'profile-pw-bar--good' : 'profile-pw-bar--weak'}`} />
                  <span className={`profile-pw-label ${security.newPassword.length >= 8 ? 'profile-pw-label--good' : 'profile-pw-label--weak'}`}>
                    {security.newPassword.length < 6 ? 'Too short' : security.newPassword.length < 8 ? 'Weak' : security.newPassword.length < 12 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>
            <div className="profile-field">
              <label className="profile-label" htmlFor="profile-confirm-pw">Confirm New Password</label>
              <input
                id="profile-confirm-pw"
                type="password"
                className="profile-input"
                value={security.confirmPassword}
                placeholder="Repeat new password"
                onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                autoComplete="new-password"
              />
              {security.confirmPassword.length > 0 && (
                <p className={`profile-pw-match ${security.newPassword === security.confirmPassword ? 'profile-pw-match--ok' : 'profile-pw-match--err'}`}>
                  {security.newPassword === security.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>
          </div>

          <div className="profile-toggle-list profile-2fa-row">
            <div className="profile-toggle-row">
              <div className="profile-toggle-info">
                <span className="profile-toggle-label">Two-Factor Authentication (2FA)</span>
                <span className="profile-toggle-desc">Require a verification code on each login. Highly recommended.</span>
              </div>
              <button
                id="profile-toggle-2fa"
                role="switch"
                aria-checked={security.twoFA}
                aria-label="Two-factor authentication"
                className={`profile-toggle-switch ${security.twoFA ? 'profile-toggle-switch--on' : ''}`}
                onClick={() => setSecurity({ ...security, twoFA: !security.twoFA })}
              >
                <span className="profile-toggle-knob" />
              </button>
            </div>
          </div>

          <div className="profile-section-footer">
            <button
              id="profile-save-security-btn"
              className={`portal-btn-primary profile-save-btn ${saved.security ? 'profile-save-btn--saved' : ''}`}
              onClick={() => handleSave('security')}
            >
              {saved.security ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Update Password
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
}
