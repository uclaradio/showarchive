import React from 'react';

const GradientBackgroundLanding = ({ children }) => {
  return (
    <div style={{
      height: '100vh', // Fixed height instead of min-height
      width: '100%',
      background: `
        radial-gradient(circle at top, #203853 10%, #0f172a 40%, transparent 70%), 
        radial-gradient(circle at bottom, #203853 10%, #0f172a 40%, #0D0E23 100%),
        #0D0E23`,
      color: 'white',
      padding: '0', // Remove all padding
      margin: '0', // Ensure no margin
      overflow: 'hidden', // Prevent any overflow
      position: 'relative'
    }}>
      <div style={{ 
        maxWidth: '72rem', 
        margin: '0 auto',
        width: '100%',
        height: '100%', // Full height
        padding: '2rem 1rem', // Move padding here
        boxSizing: 'border-box', // Include padding in height calculation
        overflow: 'auto' // Allow scrolling only within this container if needed
      }}>
        {children}
      </div>
    </div>
  );
};

export default GradientBackgroundLanding;