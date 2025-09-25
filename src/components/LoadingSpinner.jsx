import React from 'react';

function LoadingSpinner() {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div className="spinner" />
      <style>{`
        .spinner {
          width: 24px;
          height: 24px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: #32CD32;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-left: 8px;
        }
 
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;
