import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastIcons = {
    success: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    error: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    info: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  const toastColors = {
    success: { border: '#4ade80', glow: 'rgba(74, 222, 128, 0.25)', bg: '#101d14', icon: '#4ade80' },
    error: { border: '#ff4444', glow: 'rgba(255, 68, 68, 0.25)', bg: '#220f0d', icon: '#ff4444' },
    info: { border: '#ffaa00', glow: 'rgba(255, 170, 0, 0.25)', bg: '#22160a', icon: '#ffaa00' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
        pointerEvents: 'none',
        maxWidth: '380px',
        width: '100%'
      }}>
        <style>{`
          @keyframes toast-in {
            0% { transform: translateY(16px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .toast-item {
            animation: toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            pointer-events: auto;
          }
        `}</style>
        {toasts.map((toast) => {
          const styleCfg = toastColors[toast.type] || toastColors.info;
          return (
            <div
              key={toast.id}
              className="toast-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: styleCfg.bg,
                border: `1.5px solid ${styleCfg.border}`,
                boxShadow: `0 8px 30px ${styleCfg.glow}`,
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                color: '#f5ede6',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.9rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ color: styleCfg.icon, display: 'flex', alignItems: 'center' }}>
                {toastIcons[toast.type] || toastIcons.info}
              </div>
              <div style={{ flex: 1, lineHeight: '1.4', fontWeight: '500' }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
