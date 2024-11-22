import { useRouter } from 'next/router';
import { useRef, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import Head from 'next/head';
import Link from 'next/link';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebaseConfig';
import { AiOutlineHome } from 'react-icons/ai';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);

export default function NowPlaying() {
  const router = useRouter();
  const { quarter, show } = router.query;
  const audioRef = useRef(null);
  const [trackUrl, setTrackUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');
  const [showName, setShowName] = useState('');

  function formatQuarterName(quarter) {
    if (!quarter) return '';
    const match = quarter.match(/([a-zA-Z]+)(\d{2})$/);
    if (match) {
      const q = match[1];
      const y = match[2];
      const qCapitalized = q.charAt(0).toUpperCase() + q.slice(1);
      return `${qCapitalized} ${y}`;
    }
    return quarter;
  }

  useEffect(() => {
    if (!router.isReady) return;

    if (quarter && show) {
      let audioFile;
      let posterFile;
      if (show === 'Show of the Quarter') {
        audioFile = 'sotq.mp3';
        posterFile = 'sotq.jpg';
      } else {
        const weekNumber = show.replace('Week ', '');
        audioFile = `week${weekNumber}.mp3`;
        posterFile = `week${weekNumber}.jpg`;
      }

      const audioFilePath = `public/${quarter}/${audioFile}`;
      const posterFilePath = `public/${quarter}/${posterFile}`;

      // Fetch audio URL
      const specificAudioRef = ref(storage, audioFilePath);
      getDownloadURL(specificAudioRef)
        .then((url) => setTrackUrl(url))
        .catch((error) => {
          console.error('Specific audio file not found, using default', error);
          setTrackUrl('/default.mp3');
        });

      // Fetch poster URL
      const specificPosterRef = ref(storage, posterFilePath);
      getDownloadURL(specificPosterRef)
        .then((url) => setPosterUrl(url))
        .catch((error) => {
          console.error('Poster file not found, using default', error);
          setPosterUrl('/default.jpg');
        });
    }
  }, [router.isReady, quarter, show]);

  useEffect(() => {
    if (!router.isReady) return;

    if (quarter && show) {
      setShowName('');
      const weekNumber = show.replace('Week ', '').trim();
      const docId = show === 'Show of the Quarter' ? 'sotq' : `week${weekNumber}`;
      const docRef = doc(db, quarter, docId);

      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setShowName(data.name || '');
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        });
    }
  }, [router.isReady, quarter, show]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.load();
  }, [trackUrl]);

  const playAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      const currentTime = audioRef.current.currentTime;
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
        setCurrentTime(formatTime(currentTime));
        setTotalTime(formatTime(duration));
      }
    }
  };

  const seekAudio = (e) => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (e.target.value / 100) * duration;
      setProgress(e.target.value);
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
        />
      </Head>

      <header style={styles.header}>
        <Link href="/">
          <AiOutlineHome style={{ fontSize: '2rem', color: 'white', cursor: 'pointer' }} />
        </Link>
      </header>

      {/* Translucent Rectangle */}
      <div style={styles.backgroundRectangle}></div>

      <div style={styles.trackInfo}>
        <h1 style={styles.trackTitle}>Now Playing</h1>
        <p style={styles.trackDetails}>
          {show} - {formatQuarterName(quarter)}
        </p>
        {posterUrl && <img src={posterUrl} alt="Show Poster" style={styles.poster} />}
        <p style={styles.showName}>{showName || 'Show Name'}</p>
      </div>

      <div style={styles.controls}>
        <button onClick={playAudio} style={styles.playButton}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <div style={styles.progressContainer}>
          <span>{currentTime}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={seekAudio}
            style={styles.progressBar}
          />
          <span>{totalTime}</span>
        </div>

        <div style={styles.volumeContainer}>
          <FaVolumeUp style={styles.volumeIcon} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={changeVolume}
            style={styles.volumeBar}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={trackUrl} type="audio/mp3" />
      </audio>

      <style jsx global>{`
        html,
        body {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #121212;
          color: white;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: '#FFFFFF',
    padding: '20px',
    marginTop: '-20px',
  },
  backgroundRectangle: {
    position: 'absolute',
    top: '5%',
    left: '27.5%',
    width: '45%',
    height: '90%',
    backgroundColor: '#263851',
    borderRadius: '20px',
    zIndex: 0,
  },
  header: {
    position: 'fixed',
    top: '20px',
    left: '20px',
  },
  trackInfo: {
    textAlign: 'center',
    marginBottom: '20px',
    zIndex: 1,
  },
  trackTitle: {
    fontSize: '4rem',
    marginTop: '0px',
    marginBottom: '5px',
  },
  trackDetails: {
    fontSize: '3rem',
    color: '#F2CAED',
    marginTop: '0px',
    marginBottom: '25px',
  },
  showName: {
    fontSize: '2.4rem',
    color: '#F2CAED',
    marginTop: '10px',
    marginBottom: '5px',
  },
  poster: {
    height: '100%',
    maxHeight: '300px',
    borderRadius: '8px',
    marginBottom: '10px',
    zIndex: 1,
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
    zIndex: 1,
  },
  playButton: {
    fontSize: '3rem',
    backgroundColor: '#F2CAED',
    border: 'none',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '150%',
    marginBottom: '20px',
    marginTop: '10px',
    color: '#BBBBBB',
  },
  progressBar: {
    flexGrow: 1,
    margin: '0 10px',
    cursor: 'pointer',
    accentColor: '#F2CAED',
  },
  volumeContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#BBBBBB',
    marginTop: '7px',
  },
  volumeIcon: {
    marginRight: '10px',
  },
  volumeBar: {
    width: '225px',
    cursor: 'pointer',
    accentColor: '#F2CAED',
  },
};

// const styles = {
//   container: {
//     position: 'relative',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#121212',
//     color: '#FFFFFF',
//     padding: '2%',
//   },
//   backgroundRectangle: {
//     position: 'absolute',
//     top: '10%',
//     left: '15%',
//     width: '70%',
//     height: '75%',
//     backgroundColor: '#263851',
//     borderRadius: '2%',
//     zIndex: 0,
//   },
//   header: {
//     position: 'fixed',
//     top: '2%',
//     left: '2%',
//   },
//   trackInfo: {
//     textAlign: 'center',
//     marginBottom: '3%',
//     zIndex: 1,
//   },
//   trackTitle: {
//     fontSize: '3vw', // Scales based on viewport width
//     marginTop: '0px',
//     marginBottom: '1%',
//   },
//   trackDetails: {
//     fontSize: '1.5vw', // Scales based on viewport width
//     color: '#F2CAED',
//     marginTop: '0px',
//     marginBottom: '2%',
//   },
//   showName: {
//     fontSize: '1.2vw', // Scales with viewport width
//     color: '#F2CAED',
//     marginTop: '1%',
//     marginBottom: '1%',
//   },
//   poster: {
//     height: 'auto',
//     maxHeight: '50%',
//     width: 'auto',
//     maxWidth: '80%',
//     borderRadius: '0.5rem',
//     marginBottom: '1%',
//     zIndex: 1,
//   },
//   controls: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     width: '100%',
//     maxWidth: '30vw', // Scales the controls width
//     zIndex: 1,
//   },
//   playButton: {
//     fontSize: '1.5rem',
//     backgroundColor: '#F2CAED',
//     border: 'none',
//     borderRadius: '50%',
//     width: '15%',
//     height: '15%',
//     color: 'white',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     cursor: 'pointer',
//     marginBottom: '2%',
//   },
//   progressContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: '2%',
//     marginTop: '1%',
//     color: '#BBBBBB',
//   },
//   progressBar: {
//     flexGrow: 1,
//     margin: '0 2%',
//     cursor: 'pointer',
//     accentColor: '#F2CAED',
//   },
//   volumeContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     color: '#BBBBBB',
//     marginTop: '2%',
//   },
//   volumeIcon: {
//     marginRight: '2%',
//   },
//   volumeBar: {
//     width: '50%',
//     cursor: 'pointer',
//     accentColor: '#F2CAED',
//   },
// };
