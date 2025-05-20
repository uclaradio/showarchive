// pages/_app.js
import { useEffect } from 'react';
import "../styles/global.css";
import GradientBackground from "../components/GradientBackground";
import { AudioProvider } from '../context/AudioContext';

function MyApp({ Component, pageProps }) {
  // Handle keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Example: Space bar to toggle play/pause when a player element is focused
      if (e.code === 'Space' && 
          (document.activeElement.classList.contains('playButton') || 
           document.activeElement.classList.contains('progressBarInput'))) {
        e.preventDefault(); // Prevent page scrolling
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AudioProvider>
      <GradientBackground>
        <Component {...pageProps} />
      </GradientBackground>
    </AudioProvider>
  );
}

export default MyApp;