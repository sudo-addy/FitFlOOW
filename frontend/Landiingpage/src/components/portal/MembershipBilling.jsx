import React, { useState, useEffect } from 'react';
import PortalLayout from './PortalLayout';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './MembershipBilling.css';

export default function MembershipBilling() {
  const [copied, setCopied] = useState(false);
  const { user: authUser, updateUser } = useAuth();
  const user = authUser || { tier: 'Elite' };
  const plan = (user.tier || 'Elite').toLowerCase();

  useEffect(() => {
    document.title = 'Membership | FitFlOOW';
    return () => {
      document.title = 'Saiyan Gym';
    };
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WARRIOR-X9K2');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTierChange = async (newTier) => {
    try {
      await api.updateTier(newTier);
      updateUser({ tier: newTier });
    } catch (err) {
      console.error('Failed to change tier:', err);
    }
  };

  const invoices = [
    { id: 'INV-2026-006', date: 'Jun 30, 2026', amount: '₹4,999', status: 'Paid' },
    { id: 'INV-2026-005', date: 'May 30, 2026', amount: '₹4,999', status: 'Paid' },
    { id: 'INV-2026-004', date: 'Apr 30, 2026', amount: '₹4,999', status: 'Paid' },
    { id: 'INV-2026-003', date: 'Mar 30, 2026', amount: '₹4,999', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Feb 28, 2026', amount: '₹4,999', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Jan 30, 2026', amount: '₹4,999', status: 'Paid' },
  ];

  return (
    <PortalLayout>
      <div className="billing-page">
        {/* Header */}
        <div className="portal-page-header">
          <h1 className="portal-page-title">
            SANCTUM <span className="portal-highlight">ACCESS</span>
          </h1>
          <p className="portal-page-subtitle">Manage your membership plans, billing history, and warrior privileges.</p>
        </div>

        <div className="billing-grid">
          {/* Left Column: Plan and Billing Details */}
          <div className="billing-left-col">
            {/* Current Plan Card */}
            <div className="portal-card billing-plan-card">
              <div className="billing-plan-header">
                <div>
                  <span className="portal-card-label">CURRENT MEMBERSHIP</span>
                  <h2 className="billing-plan-name">
                    {plan === 'elite' ? 'ELITE WARRIOR' : 'ASCENSION LEGEND'}
                  </h2>
                </div>
                <div className="billing-plan-price-box">
                  <span className="billing-plan-price">{plan === 'elite' ? '₹4,999' : '₹7,999'}</span>
                  <span className="billing-plan-freq">/ month</span>
                </div>
              </div>

              <div className="portal-divider" />

              <div className="billing-plan-details">
                <div className="billing-detail-item">
                  <span className="billing-detail-label">Status</span>
                  <span className="portal-badge portal-badge--success">Active</span>
                </div>
                <div className="billing-detail-item">
                  <span className="billing-detail-label">Next Renewal</span>
                  <span className="billing-detail-value">Jul 30, 2026</span>
                </div>
                <div className="billing-detail-item">
                  <span className="billing-detail-label">Payment Method</span>
                  <span className="billing-detail-value">Visa ending in 4242</span>
                </div>
              </div>

              <div className="portal-divider" />

              <div className="billing-plan-features">
                <span className="portal-section-title">Included Privileges</span>
                <ul className="billing-features-list">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polyline points="20 6 9 17 4 12"/></svg>
                    Unlimited Access to Hyperbolic Strength Chambers
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polyline points="20 6 9 17 4 12"/></svg>
                    Real-time Pulmonary & Biometric Kinetics Tracking
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polyline points="20 6 9 17 4 12"/></svg>
                    Infrared Restoration & Cold Plunge Pool Access
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polyline points="20 6 9 17 4 12"/></svg>
                    1-on-1 Biomechanical Adjustment Coaching
                  </li>
                  {plan === 'ascension' && (
                    <>
                      <li className="premium-feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polyline points="20 6 9 17 4 12"/></svg>
                        Priority Booking for Premium Private Sanctums
                      </li>
                      <li className="premium-feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><polyline points="20 6 9 17 4 12"/></svg>
                        Dedicated Master Coach & Personalized Peptide Plans
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {plan === 'elite' ? (
                <button 
                  className="portal-btn-primary billing-upgrade-btn" 
                  onClick={() => handleTierChange('Ascension')}
                  id="billing-upgrade-plan-btn"
                >
                  UPGRADE TO ASCENSION TIER
                </button>
              ) : (
                <button 
                  className="portal-btn-secondary billing-upgrade-btn" 
                  onClick={() => handleTierChange('Elite')}
                  id="billing-downgrade-plan-btn"
                >
                  DOWNGRADE TO ELITE TIER
                </button>
              )}
            </div>

            {/* Referral Card */}
            <div className="portal-card billing-referral-card">
              <h3 className="portal-section-title">WARRIOR REFERRAL CODE</h3>
              <p className="billing-referral-desc">
                Invite fellow warriors to ascend. Get 1 month of free membership for every 2 referrals who join the sanctum.
              </p>
              <div className="billing-referral-box">
                <span className="billing-referral-code">WARRIOR-X9K2</span>
                <button 
                  className="portal-btn-secondary billing-copy-btn" 
                  onClick={handleCopyCode}
                  id="billing-referral-copy-btn"
                  aria-label="Copy referral code to clipboard"
                >
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
              <div className="billing-referral-status">
                <span>Active Referrals: <strong className="portal-highlight">1</strong> (1 more for free month)</span>
                <div className="billing-progress-bar">
                  <div className="billing-progress-fill" style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method & Invoices */}
          <div className="billing-right-col">
            {/* Payment Method Card */}
            <div className="portal-card billing-payment-card">
              <h3 className="portal-section-title">PAYMENT METHOD</h3>
              <div className="billing-card-info">
                <div className="billing-card-brand">
                  {/* Visa Logo SVG placeholder */}
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" className="visa-svg">
                    <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm5.2 12.8a1.2 1.2 0 0 1-1 1.2H6.8a1.2 1.2 0 0 1-1.2-1.2V9.2a1.2 1.2 0 0 1 1.2-1.2h9.4a1.2 1.2 0 0 1 1.2 1.2Z" />
                  </svg>
                  <div>
                    <span className="billing-card-number">•••• •••• •••• 4242</span>
                    <span className="billing-card-exp">Expires 12/28</span>
                  </div>
                </div>
                <button className="portal-btn-secondary" id="billing-update-card-btn">Update</button>
              </div>
            </div>

            {/* Invoices List */}
            <div className="portal-card billing-invoice-card">
              <h3 className="portal-section-title">INVOICE HISTORY</h3>
              <div className="billing-table-wrapper">
                <table className="billing-table">
                  <thead>
                    <tr>
                      <th>INVOICE</th>
                      <th>DATE</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="inv-id">{inv.id}</td>
                        <td className="inv-date">{inv.date}</td>
                        <td className="inv-amount">{inv.amount}</td>
                        <td>
                          <span className="portal-badge portal-badge--success">{inv.status}</span>
                        </td>
                        <td>
                          <button className="billing-download-btn" aria-label={`Download invoice ${inv.id}`} id={`btn-download-${inv.id}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="billing-danger-card">
              <h4 className="billing-danger-title">Pause or Terminate Access</h4>
              <p className="billing-danger-desc">
                If you pause your ascension portal, your metrics profile, booking history, and coach correspondence will be frozen.
              </p>
              <button className="billing-cancel-btn" id="billing-cancel-membership-btn">Cancel Membership</button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
