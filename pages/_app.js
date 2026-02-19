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

  // Reset browser defaults; allow full-page scroll on all pages
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    body.style.margin = '0';
    body.style.padding = '0';
    html.style.margin = '0';
    html.style.padding = '0';
    body.style.overflowX = 'hidden';
    body.style.minHeight = '100vh';
    html.style.minHeight = '100vh';

    return () => {
      body.style.margin = '';
      body.style.padding = '';
      html.style.margin = '';
      html.style.padding = '';
      body.style.overflowX = '';
      body.style.minHeight = '';
      html.style.minHeight = '';
    };
  }, [router.pathname]);

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