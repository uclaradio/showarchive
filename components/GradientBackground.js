import React from 'react';

const GradientBackground = ({ children }) => {
  return (
    <div className="bg-container">
      <div className="flowing-bg">
        {/* Subtle floating orbs/light sources */}
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        
        {/* Content container */}
        <div className="content-wrapper">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .bg-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        
        .bg-orbs {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.2;
        }
        
        .orb-1 {
          width: 50vh;
          height: 50vh;
          background-color: rgba(120, 70, 180, 0.6);
          top: 15%;
          left: 15%;
          animation: float-1 45s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 35vh;
          height: 35vh;
          background-color: rgba(70, 140, 230, 0.5);
          bottom: 15%;
          right: 25%;
          animation: float-2 50s ease-in-out infinite;
        }
        
        .orb-3 {
          width: 25vh;
          height: 25vh;
          background-color: rgba(180, 60, 140, 0.5);
          top: 50%;
          right: 10%;
          animation: float-3 55s ease-in-out infinite;
        }
        
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(8%, 5%); }
          50% { transform: translate(3%, 10%); }
          75% { transform: translate(-5%, 3%); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(-8%, 7%); }
          66% { transform: translate(-4%, -5%); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-6%, 8%); }
          40% { transform: translate(7%, 4%); }
          60% { transform: translate(5%, -6%); }
          80% { transform: translate(-3%, -4%); }
          100% { transform: translate(0, 0); }
        }
        
        .content-wrapper {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default GradientBackground;