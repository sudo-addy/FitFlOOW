import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 React Error Boundary caught a crash:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#070302',
          backgroundImage: 'radial-gradient(circle at center, #1b0a04 0%, #070302 70%)',
          color: '#f5ede6',
          fontFamily: 'Outfit, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '550px',
            backgroundColor: '#120906',
            border: '2px solid #ff5500',
            boxShadow: '0 0 30px rgba(255, 85, 0, 0.15)',
            borderRadius: '12px',
            padding: '3rem 2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Scanlines layer */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
              backgroundSize: '100% 4px',
              pointerEvents: 'none',
              opacity: 0.4
            }} />

            {/* Emblem */}
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 85, 0, 0.1)',
              border: '1px solid #ff5500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff5500'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              color: '#ffffff'
            }}>
              SYSTEM OVERLOAD
            </h1>
            
            <p style={{
              color: '#a3958c',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
              A power anomaly has disrupted the training logs. Return to the home base and restore your power levels.
            </p>

            {/* Error Detail (Dev mode helper) */}
            {this.state.error && (
              <div style={{
                textAlign: 'left',
                backgroundColor: 'rgba(7, 3, 2, 0.8)',
                border: '1px solid rgba(255,85,0,0.1)',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '2rem',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                <p style={{
                  color: '#ffaa00',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  margin: 0,
                  wordBreak: 'break-all'
                }}>
                  Error: {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#ff5500',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ff7700'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ff5500'; }}
              >
                TRY AGAIN
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: 'transparent',
                  color: '#a3958c',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ff5500'; e.currentTarget.style.color = '#ffffff'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = '#a3958c'; }}
              >
                RETURN HOME
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
