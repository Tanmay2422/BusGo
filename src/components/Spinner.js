import React from 'react';

const Spinner = ({ fullPage, text = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.9)', zIndex: 9999, gap: '1rem'
      }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</p>
      </div>
    );
  }
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</p>
    </div>
  );
};

export default Spinner;
