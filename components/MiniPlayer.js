// components/MiniPlayer.js
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/MiniPlayer.module.css';

const MiniPlayer = ({ 
  show, 
  imageUrl, 
  audioUrl, 
  isVisible,
  audioRef,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onExpand,
  onClose
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const miniPlayerRef = useRef(null);
  
  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Calculate progress percentage for the progress bar
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Ensure the mini player stays completely fixed and unaffected by scrolling
  useEffect(() => {
    if (!isVisible) return;

    // Lock the mini player position immediately when it becomes visible
    const lockPosition = () => {
      if (miniPlayerRef.current) {
        const container = miniPlayerRef.current;
        
        // Force fixed positioning with inline styles to override any CSS conflicts
        container.style.position = 'fixed';
        container.style.bottom = '0px';
        container.style.left = '0px';
        container.style.right = '0px';
        container.style.zIndex = '9999';
        container.style.transform = 'translateZ(0)';
        container.style.webkitTransform = 'translateZ(0)';
        
        // Prevent any potential movement
        container.style.willChange = 'auto';
        container.style.contain = 'layout style paint';
      }
    };

    // Apply positioning immediately
    lockPosition();

    // Create a more comprehensive event listener to prevent any movement
    const preventMovement = (e) => {
      // Don't interfere with interactions within the mini player
      if (miniPlayerRef.current && miniPlayerRef.current.contains(e.target)) {
        return;
      }
      
      // Ensure position stays locked during any page interaction
      requestAnimationFrame(lockPosition);
    };

    // Use capture phase to catch events early
    const passiveOptions = { passive: true, capture: true };
    
    // Listen for all events that might cause movement
    document.addEventListener('scroll', preventMovement, passiveOptions);
    document.addEventListener('touchstart', preventMovement, passiveOptions);
    document.addEventListener('touchmove', preventMovement, passiveOptions);
    document.addEventListener('touchend', preventMovement, passiveOptions);
    window.addEventListener('resize', lockPosition);
    window.addEventListener('orientationchange', () => {
      setTimeout(lockPosition, 100);
    });

    // Also prevent movement on viewport changes (common on mobile)
    let resizeTimer;
    const handleViewportChange = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(lockPosition, 50);
    };
    
    window.addEventListener('resize', handleViewportChange);
    
    // Listen for visibility changes that might affect layout
    document.addEventListener('visibilitychange', lockPosition);

    return () => {
      document.removeEventListener('scroll', preventMovement, passiveOptions);
      document.removeEventListener('touchstart', preventMovement, passiveOptions);
      document.removeEventListener('touchmove', preventMovement, passiveOptions);
      document.removeEventListener('touchend', preventMovement, passiveOptions);
      window.removeEventListener('resize', lockPosition);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', lockPosition);
      document.removeEventListener('visibilitychange', lockPosition);
      clearTimeout(resizeTimer);
    };
  }, [isVisible]);
  
  // Handle audio state changes
  useEffect(() => {
    if (isVisible && isPlaying && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.error("Error resuming audio:", err));
    }
  }, [isVisible, isPlaying, audioRef]);
  
  // Prevent rendering if the component is not visible
  if (!isVisible) return null;
  
  return (
    <div className={styles.miniPlayerContainer} ref={miniPlayerRef}>
      <div className={styles.miniPlayer}>
        <div className={styles.miniPlayerContent}>
          {/* Header with action buttons */}
          <div className={styles.playerHeader}>
            <div className={styles.showInfo}>
              <div className={styles.albumArt}>
                <img 
                  src={imageUrl || "/radioblue.jpg"} 
                  alt={show?.name || "Show"} 
                  className={styles.albumImage}
                  onClick={onExpand}
                  onDragStart={(e) => e.preventDefault()} // Prevent image dragging
                />
              </div>
              
              <div className={styles.textInfo} onClick={onExpand}>
                <h3 className={styles.showName}>{show?.name || "Show"}</h3>
                <p className={styles.hostName}>{show?.DJ1 || "DJ"}</p>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <button 
                className={styles.expandButton} 
                onClick={onExpand}
                type="button" // Explicit button type
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 15L12 8L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              <button 
                className={styles.closeButton} 
                onClick={onClose}
                type="button" // Explicit button type
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className={styles.playerControls}>
            <button 
              onClick={onPlayPause} 
              className={styles.playButton}
              disabled={!audioUrl}
              type="button" // Explicit button type
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="5" width="3" height="14" rx="1" fill="currentColor" />
                  <rect x="14" y="5" width="3" height="14" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5L19 12L7 19V5Z" fill="currentColor" />
                </svg>
              )}
            </button>
            
            <div className={styles.timeDisplay}>
              <span>{formatTime(currentTime)}</span>
            </div>
            
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBackground}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 1}
                value={currentTime || 0}
                onChange={onSeek}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className={styles.progressBarInput}
                disabled={!audioUrl}
                style={{ touchAction: 'manipulation' }} // Prevent scroll when interacting
              />
            </div>
            
            <div className={styles.durationDisplay}>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;