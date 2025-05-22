import React from 'react';

const GradientBackgroundLanding = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at top, #203853 10%, #0f172a 40%, transparent 70%), 
        radial-gradient(circle at bottom, #203853 10%, #0f172a 40%, #0D0E23 100%),
        #0D0E23`,
      color: 'white',
      padding: '5rem 2rem 4rem 2rem'
    }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        {children}
      </div>
    </div>
    
  );
};

export default GradientBackgroundLanding; 