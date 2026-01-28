// context/AudioContext.js
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

// Create a context
const AudioContext = createContext();

// Provider component
export const AudioProvider = ({ children }) => {
  const [currentShow, setCurrentShow] = useState(null);
  const [currentQuarter, setCurrentQuarter] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  const router = useRouter();
  
  // Listen for route changes to maintain the mini player
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Keep mini player state during navigation
      if (isPlaying || isMiniPlayerVisible) {
        setIsModalOpen(false); // Close modal during navigation
        // Make sure mini player is visible if audio is playing
        if (isPlaying) {
          setIsMiniPlayerVisible(true);
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router, isPlaying, isMiniPlayerVisible]);
  
  // Initialize the audio element
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up audio event listeners
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Handle audio URL changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      // Only update src if it's different
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
    }
  }, [audioUrl]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Make sure audio is loaded
        if (audioRef.current.src !== audioUrl) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
        }
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
              setIsPlaying(false);
            });
        }
      }
    }
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Handle seek
  const handleSeek = (e) => {
    const seekPosition = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekPosition;
      setCurrentTime(seekPosition);
    }
  };
  
  // Open player with show (can specify initial view: 'modal' or 'mini')
  const openPlayer = (show, quarter, image, audio, viewMode = 'mini') => {
    // If we're switching to a different audio source, stop current playback
    if (audioRef.current && audioUrl && audioUrl !== audio) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    setCurrentShow(show);
    setCurrentQuarter(quarter);
    setImageUrl(image);
    setAudioUrl(audio);
    
    // Set the initial view mode
    if (viewMode === 'modal') {
      setIsModalOpen(true);
      setIsMiniPlayerVisible(false);
    } else {
      setIsMiniPlayerVisible(true);
      setIsModalOpen(false);
    }
  };
  
  // Legacy function names for backward compatibility
  const openModal = (show, quarter, image, audio) => openPlayer(show, quarter, image, audio, 'modal');
  const openMiniPlayer = (show, quarter, image, audio) => openPlayer(show, quarter, image, audio, 'mini');
  
  // Close modal and player completely
  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Clear the source
    }
    setIsPlaying(false);
    setIsModalOpen(false);
    setIsMiniPlayerVisible(false);
    setCurrentShow(null);
    setAudioUrl(null);
    setImageUrl(null);
    setCurrentTime(0);
    setDuration(0);
  };
  
  // Minimize modal to mini player
  const minimizeToPlayer = () => {
    // Don't stop the audio, just hide the modal and show the mini player
    setIsModalOpen(false);
    
    // Small delay to ensure DOM is updated before showing mini player
    setTimeout(() => {
      setIsMiniPlayerVisible(true);
    }, 50);
    
    // If audio was playing, make sure it continues to play
    if (isPlaying && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(error => {
        console.error("Error resuming audio in mini player:", error);
        setIsPlaying(false);
      });
    }
  };
  
  // Expand mini player to modal
  const expandToModal = () => {
    // Don't stop the audio, just show the modal and hide the mini player
    setIsMiniPlayerVisible(false);
    setIsModalOpen(true);
  };

  return (
    <AudioContext.Provider
      value={{
        currentShow,
        currentQuarter,
        imageUrl,
        audioUrl,
        isPlaying,
        isModalOpen,
        isMiniPlayerVisible,
        currentTime,
        duration,
        audioRef,
        togglePlayPause,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleSeek,
        openPlayer,
        openModal, // Legacy support
        openMiniPlayer, // Legacy support
        closePlayer,
        minimizeToPlayer,
        expandToModal,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook to use the audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;