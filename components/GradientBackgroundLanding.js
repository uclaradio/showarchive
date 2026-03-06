import React from 'react';

const GradientBackgroundLanding = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: `
        radial-gradient(circle at top, #203853 10%, #0f172a 40%, transparent 70%), 
        radial-gradient(circle at bottom, #203853 10%, #0f172a 40%, #0D0E23 100%),
        #0D0E23`,
      color: 'white',
      padding: 0,
      margin: 0,
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '100%',
        margin: 0,
        width: '100%',
        padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(0.75rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2rem)',
        paddingTop: 'max(clamp(0.75rem, 2vw, 1.25rem), env(safe-area-inset-top))',
        paddingBottom: 'max(clamp(1.5rem, 4vw, 2rem), env(safe-area-inset-bottom))',
        boxSizing: 'border-box'
      }}>
        {children}
      </div>
    </div>
  );
};

export default GradientBackgroundLanding;