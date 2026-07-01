import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import './MembershipPage.css';

export default function MembershipPage() {
  const navigate = useNavigate();
  const { user, isSidebarCollapsed } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Credit Card Form state
  const [cardDetails, setCardDetails] = useState({
    number: '4111 •••• •••• 9001',
    expiry: '12/28',
    cvc: '123'
  });

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const plans = [
    {
      name: 'INITIATE',
      price: '$0',
      period: 'Forever Free',
      description: 'Essential tracking tools for casual gym members starting their journey.',
      features: [
        'Log up to 3 workouts weekly',
        'Standard exercise library',
        'Basic biometrics tracking',
        'Profile page personalization'
      ],
      ctaText: 'CURRENT PLAN',
      isCurrent: false,
      popular: false
    },
    {
      name: 'WARRIOR',
      price: '$29',
      period: 'per month',
      description: 'Advanced features for dedicated athletes tracking consistent overload.',
      features: [
        'Unlimited workout logging',
        'Historical progress analytics',
        'Global Leaderboard access',
        'Custom exercise creation'
      ],
      ctaText: 'UPGRADE NOW',
      isCurrent: false,
      popular: false
    },
    {
      name: 'WARRIOR ELITE',
      price: '$49',
      period: 'per month',
      description: 'Maximum performance optimization tools for elite athletes and competitors.',
      features: [
        'Olympic Plate Calculator tool',
        'Warmup Ramp Set Generator',
        'Estimated 1-Rep Max graphs',
        'Priority chamber booking options',
        'HRV CNS recovery analytics'
      ],
      ctaText: 'ACTIVE PLAN',
      isCurrent: true,
      popular: true
    }
  ];

  const handleOpenCheckout = (plan) => {
    if (plan.isCurrent) return;
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setCheckoutComplete(true);
    setTimeout(() => {
      // Simulate tier update
      setUser({ ...user, tier: selectedPlan.name });
      setShowCheckoutModal(false);
      setCheckoutComplete(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className={`portal-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main View Area */}
      <div className="portal-view">
        {/* Topbar Header */}
        <Topbar />

        {/* Membership Pricing Portal Content */}
        <main className="membership-content">
          <div className="membership-header-row">
            <div>
              <h1 className="membership-title">MEMBERSHIP PASS</h1>
              <p className="membership-subtitle">Choose the plan matching your current training intensity and performance needs.</p>
            </div>
          </div>

          {/* Pricing cards grid */}
          <div className="plans-grid">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`plan-card-box ${plan.popular ? 'popular' : ''} ${plan.isCurrent ? 'current' : ''}`}
              >
                {plan.popular && <span className="popular-badge">RECOMMENDED</span>}
                {plan.isCurrent && <span className="active-badge">CURRENT PLAN</span>}

                <div className="plan-header">
                  <span className="plan-name-label">{plan.name}</span>
                  <div className="plan-price-row">
                    <span className="price-num">{plan.price}</span>
                    <span className="price-period">{plan.period}</span>
                  </div>
                  <p className="plan-desc-text">{plan.description}</p>
                </div>

                <ul className="plan-features-list">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx}>
                      <svg className="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`plan-action-btn ${plan.isCurrent ? 'active' : ''}`}
                  onClick={() => handleOpenCheckout(plan)}
                  disabled={plan.isCurrent}
                >
                  {plan.isCurrent ? 'ACTIVE PLAN' : 'UPGRADE NOW'}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* CHECKOUT SIMULATOR MODAL */}
      {showCheckoutModal && (
        <div className="modal-backdrop" onClick={() => setShowCheckoutModal(false)}>
          <div className="success-summary-modal checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-ornament">💳</div>
            <h2>CHECKOUT SIMULATOR</h2>
            <p className="success-tagline">Secure Billing Pipeline</p>

            {checkoutComplete ? (
              <div className="checkout-success-animation">
                <div className="spinner-hud" />
                <p>PROCESSING PAYMENT METRICS...</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit}>
                <div className="checkout-summary-box">
                  <span>Selected Plan:</span>
                  <h4>{selectedPlan.name} • {selectedPlan.price}/mo</h4>
                </div>

                <div className="checkout-form-inputs">
                  <div className="form-input-group">
                    <label htmlFor="card-num">Card Number</label>
                    <input
                      id="card-num"
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row-macros">
                    <div className="form-input-group">
                      <label htmlFor="card-exp">Expiry</label>
                      <input
                        id="card-exp"
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-input-group">
                      <label htmlFor="card-cvc">CVC</label>
                      <input
                        id="card-cvc"
                        type="password"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        maxLength="3"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-actions-row" style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="modal-close-btn">
                    PAY & ACTIVATE
                  </button>
                  <button type="button" className="modal-cancel-btn" onClick={() => setShowCheckoutModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
