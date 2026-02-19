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
        padding: '1.25rem 1.5rem 2rem',
        boxSizing: 'border-box'
      }}>
        {children}
      </div>
    </div>
  );
};

export default GradientBackgroundLanding;