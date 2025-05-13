import React from 'react';

const GradientBackground = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0e0b16, #1a0e2a, #84226b)',
      color: 'white',
      padding: '5rem 2rem 4rem 2rem'
    }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
};

export default GradientBackground; 