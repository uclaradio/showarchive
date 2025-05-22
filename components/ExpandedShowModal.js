// components/ExpandedShowModal.js
import { useRef, useEffect } from 'react';
import styles from '../styles/ExpandedShowModal.module.css';

const ExpandedShowModal = ({ 
  show, 
  imageUrl, 
  audioUrl, 
  isOpen, 
  onClose, 
  onMinimize,
  audioRef,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onTimeUpdate,
  onLoadedMetadata
}) => {
  const modalRef = useRef(null);
  const cardRef = useRef(null);
  
  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !cardRef.current.contains(event.target)) {
        onMinimize();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onMinimize]);
  
  // Ensure audio keeps playing when modal is opened
  useEffect(() => {
    if (isOpen && isPlaying && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.error("Error resuming audio:", err));
    }
  }, [isOpen, isPlaying, audioRef]);
  
  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Don't render anything if not open
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay} ref={modalRef}>
      <div className={styles.modalContent} ref={cardRef}>
        <div className={styles.modalHeader}>
          <button className={styles.minimizeButton} onClick={onMinimize}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button className={styles.closeButton} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img 
                src={imageUrl || "/radioblue.jpg"} 
                alt={show.name || "Show"} 
                className={styles.showImage}
              />
              <div className={styles.imageOverlay}></div>
            </div>
          </div>
          
          <div className={styles.infoSection}>
            <h1 className={styles.showTitle}>{show.name || "Show"}</h1>
            
            <div className={styles.showDetails}>
              <p className={styles.hostInfo}>
                Hosted by <span className={styles.hostName}>{show.DJ1 || "DJ"}</span>
                {show.DJ2 && <> and <span className={styles.hostName}>{show.DJ2}</span></>}
              </p>
              
              {show.category && (
                <p className={styles.categoryTag}>{show.category}</p>
              )}
            </div>
            
            {audioUrl ? (
              <div className={styles.customAudioPlayer}>
                <div className={styles.audioControls}>
                  {/* Progress section first */}
                  <div className={styles.progressSection}>
                    <div className={styles.progressBarContainer}>
                      <input
                        type="range"
                        min="0"
                        max={duration || 1}
                        value={currentTime || 0}
                        onChange={onSeek}
                        className={styles.progressBar}
                        disabled={!audioUrl}
                      />
                    </div>
                    
                    <div className={styles.timeInfo}>
                      <div className={styles.timeDisplay}>
                        <span>{formatTime(currentTime)}</span>
                      </div>
                      <div className={styles.durationDisplay}>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Controls section below */}
                  <div className={styles.controlsSection}>
                    <button 
                      onClick={onPlayPause} 
                      className={styles.playButton}
                      disabled={!audioUrl}
                    >
                      {isPlaying ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                          <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                        </svg>
                      ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 4.5L19 12L6 19.5V4.5Z" fill="currentColor" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.noAudioContainer}>
                <p className={styles.noAudioText}>No audio available for this show</p>
              </div>
            )}
            
            {/* Additional show info if available */}
            {show.description && (
              <div className={styles.showDescription}>
                <h2 className={styles.sectionTitle}>About This Show</h2>
                <p>{show.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedShowModal;