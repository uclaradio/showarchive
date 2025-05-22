// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import "../styles/global.css";
import GradientBackground from "../components/GradientBackground";
import GradientBackgroundLanding from "../components/GradientBackgroundLanding";
import { AudioProvider } from '../context/AudioContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Handle keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && 
          (document.activeElement.classList.contains('playButton') || 
           document.activeElement.classList.contains('progressBarInput'))) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fix the root cause - reset browser defaults and prevent extra space
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const isLandingPage = router.pathname === '/';
    
    // Reset all default margins and padding
    body.style.margin = '0';
    body.style.padding = '0';
    html.style.margin = '0';
    html.style.padding = '0';
    body.style.overflowX = 'hidden';
    
    if (isLandingPage) {
      // Only apply scroll prevention on landing page
      body.style.height = '100vh';
      html.style.height = '100vh';
      body.style.overflowY = 'hidden';
    } else {
      // Allow normal scrolling on other pages
      body.style.height = 'auto';
      html.style.height = 'auto';
      body.style.overflowY = 'auto';
    }
    
    return () => {
      // Cleanup
      body.style.margin = '';
      body.style.padding = '';
      html.style.margin = '';
      html.style.padding = '';
      body.style.height = '';
      html.style.height = '';
      body.style.overflowX = '';
      body.style.overflowY = '';
    };
  }, [router.pathname]); // Re-run when route changes

  // Determine which background component to use based on the current route
  const isLandingPage = router.pathname === '/';
  const BackgroundComponent = isLandingPage ? GradientBackgroundLanding : GradientBackground;

  return (
    <AudioProvider>
      <BackgroundComponent>
        <Component {...pageProps} />
      </BackgroundComponent>
    </AudioProvider>
  );
}

export default MyApp;