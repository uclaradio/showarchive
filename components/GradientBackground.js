import React from 'react';

const GradientBackground = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0e0b16, #1a0e2a, #84226b)',
      color: 'white',
      padding: 'clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem) clamp(3rem, 6vw, 4rem)',
      paddingTop: 'max(clamp(2rem, 6vw, 5rem), env(safe-area-inset-top))',
      paddingBottom: 'max(clamp(3rem, 6vw, 4rem), env(safe-area-inset-bottom))'
    }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default GradientBackground; 