// // components/MiniPlayer.js
// import { useEffect, useState, useRef } from 'react';
// import styles from '../styles/MiniPlayer.module.css';

// const MiniPlayer = ({ 
//   show, 
//   imageUrl, 
//   audioUrl, 
//   isVisible,
//   audioRef,
//   isPlaying,
//   currentTime,
//   duration,
//   onPlayPause,
//   onSeek,
//   onExpand,
//   onClose
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const miniPlayerRef = useRef(null);
  
//   // Format time from seconds to MM:SS
//   const formatTime = (timeInSeconds) => {
//     if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
//     const minutes = Math.floor(timeInSeconds / 60);
//     const seconds = Math.floor(timeInSeconds % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };
  
//   // Calculate progress percentage for the progress bar
//   const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
//   // Handle component visibility changes
//   useEffect(() => {
//     if (isVisible && isPlaying && audioRef.current && audioRef.current.paused) {
//       // If the mini player becomes visible and audio should be playing but isn't, resume it
//       audioRef.current.play().catch(err => console.error("Error resuming audio:", err));
//     }
    
//     // When the player becomes visible, make sure it's in view
//     if (isVisible && miniPlayerRef.current) {
//       // Add a small delay to ensure DOM is updated
//       setTimeout(() => {
//         const rect = miniPlayerRef.current.getBoundingClientRect();
//         const viewportHeight = window.innerHeight;
        
//         // If part of the miniplayer is below the viewport
//         if (rect.bottom > viewportHeight) {
//           // Adjust position to be fully visible
//           miniPlayerRef.current.style.bottom = (rect.bottom - viewportHeight + 20) + "px";
//         }
//       }, 10);
//     }
//   }, [isVisible, isPlaying, audioRef]);
  
//   // Prevent rendering if the component is not visible
//   if (!isVisible) return null;
  
//   return (
//     <div className={styles.miniPlayerContainer} ref={miniPlayerRef}>
//       <div className={styles.miniPlayer}>
//         <div className={styles.miniPlayerContent}>
//           <div className={styles.showInfo}>
//             <div className={styles.albumArt}>
//               <img 
//                 src={imageUrl || "/radioblue.jpg"} 
//                 alt={show?.name || "Show"} 
//                 className={styles.albumImage}
//                 onClick={onExpand}
//               />
//             </div>
            
//             <div className={styles.textInfo} onClick={onExpand}>
//               <h3 className={styles.showName}>{show?.name || "Show"}</h3>
//               <p className={styles.hostName}>{show?.DJ1 || "DJ"}</p>
//             </div>
//           </div>
          
//           <div className={styles.playerControls}>
//             <button 
//               onClick={onPlayPause} 
//               className={styles.playButton}
//               disabled={!audioUrl}
//             >
//               {isPlaying ? (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <rect x="7" y="5" width="3" height="14" rx="1" fill="currentColor" />
//                   <rect x="14" y="5" width="3" height="14" rx="1" fill="currentColor" />
//                 </svg>
//               ) : (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M7 5L19 12L7 19V5Z" fill="currentColor" />
//                 </svg>
//               )}
//             </button>
            
//             <div className={styles.timeDisplay}>
//               <span>{formatTime(currentTime)}</span>
//             </div>
            
//             <div className={styles.progressBarContainer}>
//               <div className={styles.progressBackground}>
//                 <div
//                   className={styles.progressFill}
//                   style={{ width: `${progressPercentage}%` }}
//                 ></div>
//               </div>
//               <input
//                 type="range"
//                 min="0"
//                 max={duration || 1}
//                 value={currentTime || 0}
//                 onChange={onSeek}
//                 onMouseDown={() => setIsDragging(true)}
//                 onMouseUp={() => setIsDragging(false)}
//                 onTouchStart={() => setIsDragging(true)}
//                 onTouchEnd={() => setIsDragging(false)}
//                 className={styles.progressBarInput}
//                 disabled={!audioUrl}
//               />
//             </div>
            
//             <div className={styles.durationDisplay}>
//               <span>{formatTime(duration)}</span>
//             </div>
//           </div>
          
//           <div className={styles.actionButtons}>
//             <button className={styles.expandButton} onClick={onExpand}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M19 15L12 8L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </button>
            
//             <button className={styles.closeButton} onClick={onClose}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </button>
//           </div>
//         </div>
        
//         {/* Animated progress indicator at the very bottom */}
//         <div className={styles.progressIndicator}>
//           <div 
//             className={styles.progressIndicatorFill}
//             style={{ width: `${progressPercentage}%` }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MiniPlayer;

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
  
  // Handle component visibility changes
  useEffect(() => {
    if (isVisible && isPlaying && audioRef.current && audioRef.current.paused) {
      // If the mini player becomes visible and audio should be playing but isn't, resume it
      audioRef.current.play().catch(err => console.error("Error resuming audio:", err));
    }
    
    // When the player becomes visible, make sure it's in view
    if (isVisible && miniPlayerRef.current) {
      // Add a small delay to ensure DOM is updated
      setTimeout(() => {
        const rect = miniPlayerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // If part of the miniplayer is below the viewport
        if (rect.bottom > viewportHeight) {
          // Adjust position to be fully visible
          miniPlayerRef.current.style.bottom = (rect.bottom - viewportHeight + 20) + "px";
        }
      }, 10);
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
                />
              </div>
              
              <div className={styles.textInfo} onClick={onExpand}>
                <h3 className={styles.showName}>{show?.name || "Show"}</h3>
                <p className={styles.hostName}>{show?.DJ1 || "DJ"}</p>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <button className={styles.expandButton} onClick={onExpand}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 15L12 8L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              <button className={styles.closeButton} onClick={onClose}>
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