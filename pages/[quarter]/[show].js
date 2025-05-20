// // pages/[quarter]/[show].js
// import { useState, useEffect } from "react";
// import { initializeApp, getApps } from "firebase/app";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";
// import firebaseConfig from "../../lib/firebaseClient";      // your client‐SDK config
// import { dbAdmin }        from "../../lib/firebaseAdmin";   // your admin‐SDK
// import GradientBackground from "../../components/GradientBackground";

// export async function getStaticPaths() {
//   // 1) list all quarters
//   const quarters = await dbAdmin.listCollections().then(cols => cols.map(c => c.id));

//   // 2) for each quarter, list all show doc IDs
//   const paths = [];
//   for (const q of quarters) {
//     const docs = await dbAdmin.collection(q).listDocuments();
//     docs.forEach(docRef => {
//       paths.push({ params: { quarter: q, show: docRef.id } });
//     });
//   }

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   const { quarter, show } = params;
//   const docSnap            = await dbAdmin.collection(quarter).doc(show).get();

//   if (!docSnap.exists) {
//     return { notFound: true };
//   }

//   return {
//     props: {
//       quarter,
//       showId:   show,
//       showData: docSnap.data(),  // e.g. { name: "DFG Live!", DJ1: "Days for Girls", … }
//     },
//     revalidate: 60,
//   };
// }

// export default function ShowPage({ quarter, showId, showData }) {
//   const [audioUrl, setAudioUrl] = useState(null);

//   useEffect(() => {
//     // init Firebase client if not already
//     if (!getApps().length) initializeApp(firebaseConfig);

//     const storage = getStorage();
//     const mp3Ref  = ref(storage, `public/${quarter}/${showId}.mp3`);

//     getDownloadURL(mp3Ref)
//       .then(url => setAudioUrl(url))
//       .catch((err) => {
//         console.error("Could not load audio URL:", err);
//       });
//   }, [quarter, showId]);

//   return (
    
//       <div className="p-8">
//         <h1 className="text-5xl font-bold text-pink-400 mb-4">
//           {showData.name}
//         </h1>
//         {/* any other metadata: DJ1, category, etc… */}
//         <p className="mb-6 text-white">
//           Hosted by <strong>{showData.DJ1}</strong>
//         </p>

//         {audioUrl ? (
//           <audio controls src={audioUrl} className="w-full outline-none" />
//         ) : (
//           <p className="text-gray-400">Loading audio…</p>
//         )}
//       </div>
    
//   );
// }

// pages/[quarter]/[show].js
import { useState, useEffect, useRef } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import firebaseConfig from "../../lib/firebaseClient";      // your client‐SDK config
import { dbAdmin } from "../../lib/firebaseAdmin";   // your admin‐SDK
import GradientBackground from "../../components/GradientBackground";
import styles from "../../styles/ShowPage.module.css";

export async function getStaticPaths() {
  // 1) list all quarters
  const quarters = await dbAdmin.listCollections().then(cols => cols.map(c => c.id));

  // 2) for each quarter, list all show doc IDs
  const paths = [];
  for (const q of quarters) {
    const docs = await dbAdmin.collection(q).listDocuments();
    docs.forEach(docRef => {
      paths.push({ params: { quarter: q, show: docRef.id } });
    });
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { quarter, show } = params;
  const docSnap = await dbAdmin.collection(quarter).doc(show).get();

  if (!docSnap.exists) {
    return { notFound: true };
  }

  return {
    props: {
      quarter,
      showId: show,
      showData: docSnap.data(),  // e.g. { name: "DFG Live!", DJ1: "Days for Girls", … }
    },
    revalidate: 60,
  };
}

export default function ShowPage({ quarter, showId, showData }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  
  useEffect(() => {
    // init Firebase client if not already
    if (!getApps().length) initializeApp(firebaseConfig);

    const storage = getStorage();
    
    // Get audio file
    const mp3Ref = ref(storage, `public/${quarter}/${showId}.mp3`);
    getDownloadURL(mp3Ref)
      .then(url => setAudioUrl(url))
      .catch((err) => {
        console.error("Could not load audio URL:", err);
      });
      
    // Get image file (using same pattern as QuarterPage)
    const imgRef = ref(storage, `public/${quarter}/${showId}.png`);
    getDownloadURL(imgRef)
      .then(url => setImageUrl(url))
      .catch(() => {
        // Fall back to default image, no need to log this error
        setImageUrl("/radioblue.jpg");
      });
  }, [quarter, showId]);
  
  // Handle audio player controls
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleSeek = (e) => {
    const seekPosition = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = seekPosition;
      setCurrentTime(seekPosition);
    }
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.showContent}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={showData.name} 
                className={styles.showImage}
              />
            )}
          </div>
        </div>
        
        <div className={styles.infoSection}>
          <h1 className={styles.showTitle}>{showData.name}</h1>
          
          <div className={styles.showDetails}>
            <p className={styles.hostInfo}>
              Hosted by <span className={styles.hostName}>{showData.DJ1}</span>
              {showData.DJ2 && <> and <span className={styles.hostName}>{showData.DJ2}</span></>}
            </p>
            
            {showData.category && (
              <p className={styles.categoryTag}>{showData.category}</p>
            )}
          </div>
          
          {audioUrl ? (
            <div className={styles.customAudioPlayer}>
              <audio 
                ref={audioRef}
                src={audioUrl} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className={styles.hiddenAudio}
              />
              
              <div className={styles.audioControls}>
                <button 
                  onClick={togglePlayPause} 
                  className={styles.playButton}
                >
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4.5L19 12L6 19.5V4.5Z" fill="currentColor" />
                    </svg>
                  )}
                </button>
                
                <div className={styles.timeDisplay}>
                  <span>{formatTime(currentTime)}</span>
                </div>
                
                <div className={styles.progressBarContainer}>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className={styles.progressBar}
                  />
                </div>
                
                <div className={styles.durationDisplay}>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingPulse}></div>
              <p className={styles.loadingText}>Loading audio...</p>
            </div>
          )}
          
          {/* Additional show info if available */}
          {showData.description && (
            <div className={styles.showDescription}>
              <h2 className={styles.sectionTitle}>About This Show</h2>
              <p>{showData.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}