import React from 'react';

const ShutdownScreen = ({ onRestart }) => {
  return (
    <div className="shutdown-screen">
      <div className="shutdown-message">
        It is now safe to turn off your computer.
        <br />
        <span style={{ fontSize: '1rem', color: '#ff7700', opacity: 0.8, display: 'block', marginTop: '10px' }}>
          Distorted Pixels OS V4.0.95 has terminated successfully.
        </span>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          className="btn" 
          onClick={onRestart}
          style={{
            background: 'none',
            border: '2px solid #ff5722',
            color: '#ff5722',
            boxShadow: 'none',
            fontSize: '1rem',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#ff5722';
            e.currentTarget.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ff5722';
          }}
        >
          🔄 Restart System
        </button>
      </div>
    </div>
  );
};

export default ShutdownScreen;
