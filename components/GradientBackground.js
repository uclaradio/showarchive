// "use client";
// import React from 'react';

// const GradientBackground = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0e0b16] via-[#1a0e2a] to-[#84226b] text-white pt-20 px-8 pb-16">
//       <div className="max-w-6xl mx-auto">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default GradientBackground;

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