import React, { useState, useEffect } from 'react';

export default function SkeletonLoader({ type = 'dashboard' }) {
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    // Show cold-start message if loading takes longer than 2 seconds
    const timer = setTimeout(() => {
      setShowSlowWarning(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skeleton-container" style={{ padding: '2rem 1.5rem', width: '100%', minHeight: '60vh' }}>
      <style>{`
        @keyframes skeleton-pulse {
          0% { background-color: rgba(255, 85, 0, 0.04); border-color: rgba(255, 85, 0, 0.1); }
          50% { background-color: rgba(255, 85, 0, 0.12); border-color: rgba(255, 85, 0, 0.2); }
          100% { background-color: rgba(255, 85, 0, 0.04); border-color: rgba(255, 85, 0, 0.1); }
        }
        .sk-box {
          animation: skeleton-pulse 1.6s ease-in-out infinite;
          border: 1px solid rgba(255, 85, 0, 0.1);
          border-radius: 8px;
        }
        @keyframes sk-loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .sk-bar-fill {
          animation: sk-loading-bar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '250px' }}>
          <div className="sk-box" style={{ height: '32px', width: '80%' }} />
          <div className="sk-box" style={{ height: '16px', width: '100%' }} />
        </div>
        <div className="sk-box" style={{ height: '40px', width: '140px' }} />
      </div>

      {/* Cold Start Notice */}
      {showSlowWarning && (
        <div style={{
          backgroundColor: 'rgba(255, 170, 0, 0.05)',
          border: '1px solid rgba(255, 170, 0, 0.2)',
          padding: '1.25rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'heroReveal 0.5s ease-out forwards',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffaa00', fontWeight: 'bold', fontSize: '0.95rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1.5s linear infinite' }}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>BACKEND SERVER IS WAKING UP</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', maxWidth: '500px', margin: 0, lineHeight: '1.4' }}>
            Our free-tier API server is spinning down after inactivity. Waking it up can take <strong>15 to 30 seconds</strong>. Thank you for your patience, warrior!
          </p>
          <div style={{ width: '100%', maxWidth: '300px', height: '3px', backgroundColor: 'rgba(255, 170, 0, 0.1)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
            <div className="sk-bar-fill" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ffaa00', width: '50%' }} />
          </div>
        </div>
      )}

      {/* Layout Grid skeletons depending on type */}
      {type === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="sk-box" style={{ height: '140px', padding: '1.5rem' }}>
                <div className="sk-box" style={{ height: '14px', width: '50%', marginBottom: '1.25rem', opacity: 0.5 }} />
                <div className="sk-box" style={{ height: '36px', width: '70%', marginBottom: '1rem', opacity: 0.8 }} />
                <div className="sk-box" style={{ height: '8px', width: '100%', opacity: 0.4 }} />
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Card 1 */}
            <div className="sk-box" style={{ height: '320px', padding: '1.5rem' }}>
              <div className="sk-box" style={{ height: '20px', width: '40%', marginBottom: '1.5rem' }} />
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', opacity: 0.6 }}>
                  <div className="sk-box" style={{ height: '18px', width: '60%' }} />
                  <div className="sk-box" style={{ height: '18px', width: '20%' }} />
                </div>
              ))}
            </div>
            {/* Card 2 */}
            <div className="sk-box" style={{ height: '320px', padding: '1.5rem' }}>
              <div className="sk-box" style={{ height: '20px', width: '45%', marginBottom: '1.5rem' }} />
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center', opacity: 0.6 }}>
                  <div className="sk-box" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    <div className="sk-box" style={{ height: '16px', width: '40%' }} />
                    <div className="sk-box" style={{ height: '12px', width: '25%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'list' && (
        <div className="sk-box" style={{ height: '450px', padding: '2rem' }}>
          <div className="sk-box" style={{ height: '24px', width: '200px', marginBottom: '2rem' }} />
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem 0', borderBottom: '1px solid rgba(255,85,0,0.05)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '40%' }}>
                <div className="sk-box" style={{ height: '18px', width: '80%' }} />
                <div className="sk-box" style={{ height: '12px', width: '50%', opacity: 0.5 }} />
              </div>
              <div className="sk-box" style={{ height: '20px', width: '15%' }} />
              <div className="sk-box" style={{ height: '30px', width: '10%' }} />
            </div>
          ))}
        </div>
      )}

      {type === 'form' && (
        <div className="sk-box" style={{ padding: '2rem' }}>
          <div className="sk-box" style={{ height: '24px', width: '200px', marginBottom: '2rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="sk-box" style={{ height: '14px', width: '100px' }} />
                <div className="sk-box" style={{ height: '46px', width: '100%' }} />
              </div>
            ))}
            <div className="sk-box" style={{ height: '50px', width: '180px', marginTop: '1rem', alignSelf: 'flex-start' }} />
          </div>
        </div>
      )}
    </div>
  );
}
