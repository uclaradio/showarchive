



// import { useRouter } from 'next/router';
// import { useRef, useEffect, useState } from 'react';
// import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa'; // Add Volume Icon
// import Head from 'next/head';
// import Link from 'next/link';
// import Image from 'next/image';

// export default function NowPlaying() {
//   const router = useRouter();
//   const { show } = router.query;
//   const audioRef = useRef(null);
//   const [trackUrl, setTrackUrl] = useState('');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [progress, setProgress] = useState(0);
//   const [currentTime, setCurrentTime] = useState('00:00');
//   const [totalTime, setTotalTime] = useState('00:00');

//   useEffect(() => {
//     if (show) {
//       const trackMapping = {
//         'Week 1': '/audio/week1.mp3',
//         'Week 2': '/audio/week2.mp3',
//         'Week 3': '/audio/week3.mp3',
//       };
//       setTrackUrl(trackMapping[show] || '/audio/default.mp3');
//     }
//   }, [show]);

//   const playAudio = () => {
//     if (audioRef.current.paused) {
//       audioRef.current.play();
//       setIsPlaying(true);
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const changeVolume = (e) => {
//     const newVolume = e.target.value;
//     audioRef.current.volume = newVolume;
//     setVolume(newVolume);
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const updateProgress = () => {
//     const duration = audioRef.current.duration;
//     const currentTime = audioRef.current.currentTime;

//     if (duration > 0) {
//       setProgress((currentTime / duration) * 100);
//       setCurrentTime(formatTime(currentTime));
//       setTotalTime(formatTime(duration));
//     }
//   };

//   const seekAudio = (e) => {
//     const duration = audioRef.current.duration;
//     const newValue = e.target.value;
//     audioRef.current.currentTime = (newValue / 100) * duration;
//     setProgress(newValue);
//   };

//   if (!show) return <p>Loading...</p>;

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px', backgroundColor: '#F2CAED', padding: '50px', height: '100vh', position: 'relative' }}>
//       <Head>
//         <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" />
//       </Head>

//       {/* Logo in the top-left corner as a Home button */}
//       <header style={{ position: 'absolute', top: '-75px', left: '15px' }}>
//         <Link href="/">
//           <Image src="/logo.png" alt="UCLA Radio Logo" width={300} height={150} style={{ cursor: 'pointer' }} />
//         </Link>
//       </header>

//       <h1>Now Playing: {show}</h1>

//       {/* Progress Bar */}
//       <input
//         type="range"
//         min="0"
//         max="100"
//         value={progress}
//         onChange={seekAudio}
//         style={{ width: '80%', marginTop: '20px' }}
//       />

// {/* Time Display and Play Button */}
// <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
//   <div style={{ fontSize: '18px' }}>{currentTime} / {totalTime}</div>
//   <button
//     onClick={playAudio}
//     style={{
//       width: '50px',
//       height: '50px',
//       borderRadius: '50%',
//       backgroundColor: '#333',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       color: 'white',
//       border: 'none',
//       cursor: 'pointer',
//       fontSize: '24px',
//       marginTop: '15px',
//     }}
//   >
//     {isPlaying ? <FaPause /> : <FaPlay />}
//   </button>
// </div>


//       {/* Volume Control and Icon */}
//       <div style={{ position: 'absolute', bottom: '200px', right: '20px', display: 'flex', alignItems: 'center' }}>
//         <FaVolumeUp style={{ fontSize: '24px', marginRight: '10px' }} />
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.01"
//           value={volume}
//           onChange={changeVolume}
//           style={{ width: '150px', height: '10px' }}
//         />
//       </div>

//       <audio
//         ref={audioRef}
//         src={trackUrl}
//         style={{ display: 'none' }}
//         onTimeUpdate={updateProgress}
//       />

//       <style jsx global>{`
//         html, body {
//           font-family: 'Space Grotesk', sans-serif;
//           margin: 0;
//           padding: 0;
//           background-color: #F2CAED; /* Pink background */
//         }
//       `}</style>
//     </div>
//   );
// }

// import { useRouter } from 'next/router';
// import { useRef, useEffect, useState } from 'react';
// import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
// import Head from 'next/head';
// import Link from 'next/link';
// import Image from 'next/image';

// // Import Firebase modules
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getStorage, ref, getDownloadURL } from 'firebase/storage';
// import firebaseConfig from '../firebaseConfig'; // Adjust the path if necessary

// // Initialize Firebase app
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const storage = getStorage(app);

// export default function NowPlaying() {
//   const router = useRouter();
//   const { show } = router.query;
//   const audioRef = useRef(null);
//   const [trackUrl, setTrackUrl] = useState('');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [progress, setProgress] = useState(0);
//   const [currentTime, setCurrentTime] = useState('00:00');
//   const [totalTime, setTotalTime] = useState('00:00');

//   useEffect(() => {
//     if (show) {
//       const trackMapping = {
//         'Week 1': 'week1.mp3',
//         'Week 2': 'week2.mp3',
//         'Week 3': 'week3.mp3',
//       };
//       const audioFile = trackMapping[show] || 'default.mp3';
//       const audioRefFirebase = ref(storage, audioFile);

//       getDownloadURL(audioRefFirebase)
//         .then((url) => {
//           setTrackUrl(url);
//         })
//         .catch((error) => {
//           console.error('Error getting download URL', error);
//         });
//     }
//   }, [show]);

//   const playAudio = () => {
//     if (audioRef.current.paused) {
//       audioRef.current.play();
//       setIsPlaying(true);
//     } else {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const changeVolume = (e) => {
//     const newVolume = e.target.value;
//     audioRef.current.volume = newVolume;
//     setVolume(newVolume);
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const updateProgress = () => {
//     const duration = audioRef.current.duration;
//     const currentTime = audioRef.current.currentTime;

//     if (duration > 0) {
//       setProgress((currentTime / duration) * 100);
//       setCurrentTime(formatTime(currentTime));
//       setTotalTime(formatTime(duration));
//     }
//   };

//   const seekAudio = (e) => {
//     const duration = audioRef.current.duration;
//     const newValue = e.target.value;
//     audioRef.current.currentTime = (newValue / 100) * duration;
//     setProgress(newValue);
//   };

//   if (!show || !trackUrl) return <p>Loading...</p>;

//   return (
//     <div
//       style={{
//         textAlign: 'center',
//         marginTop: '50px',
//         backgroundColor: '#F2CAED',
//         padding: '50px',
//         height: '100vh',
//         position: 'relative',
//       }}
//     >
//       <Head>
//         <link
//           rel="stylesheet"
//           href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
//         />
//       </Head>

//       {/* Logo in the top-left corner as a Home button */}
//       <header style={{ position: 'absolute', top: '-75px', left: '15px' }}>
//         <Link href="/">
//           <Image
//             src="/logo.png"
//             alt="UCLA Radio Logo"
//             width={300}
//             height={150}
//             style={{ cursor: 'pointer' }}
//           />
//         </Link>
//       </header>

//       <h1>Now Playing: {show}</h1>

//       {/* Progress Bar */}
//       <input
//         type="range"
//         min="0"
//         max="100"
//         value={progress}
//         onChange={seekAudio}
//         style={{ width: '80%', marginTop: '20px' }}
//       />

//       {/* Time Display and Play Button */}
//       <div
//         style={{
//           marginTop: '10px',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <div style={{ fontSize: '18px' }}>
//           {currentTime} / {totalTime}
//         </div>
//         <button
//           onClick={playAudio}
//           style={{
//             width: '50px',
//             height: '50px',
//             borderRadius: '50%',
//             backgroundColor: '#333',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             color: 'white',
//             border: 'none',
//             cursor: 'pointer',
//             fontSize: '24px',
//             marginTop: '15px',
//           }}
//         >
//           {isPlaying ? <FaPause /> : <FaPlay />}
//         </button>
//       </div>

//       {/* Volume Control and Icon */}
//       <div
//         style={{
//           position: 'absolute',
//           bottom: '200px',
//           right: '20px',
//           display: 'flex',
//           alignItems: 'center',
//         }}
//       >
//         <FaVolumeUp style={{ fontSize: '24px', marginRight: '10px' }} />
//         <input
//           type="range"
//           min="0"
//           max="1"
//           step="0.01"
//           value={volume}
//           onChange={changeVolume}
//           style={{ width: '150px', height: '10px' }}
//         />
//       </div>

//       <audio
//         ref={audioRef}
//         src={trackUrl}
//         style={{ display: 'none' }}
//         onTimeUpdate={updateProgress}
//       />

//       <style jsx global>{`
//         html,
//         body {
//           font-family: 'Space Grotesk', sans-serif;
//           margin: 0;
//           padding: 0;
//           background-color: #f2caed; /* Pink background */
//         }
//       `}</style>
//     </div>
//   );
// }


import { useRouter } from 'next/router';
import { useRef, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Import Firebase modules
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebaseConfig'; // Adjust the path if necessary

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export default function NowPlaying() {
  const router = useRouter();
  const { show } = router.query;
  const audioRef = useRef(null);
  const [trackUrl, setTrackUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');

  useEffect(() => {
    if (!router.isReady) return; // Wait until router is ready

    if (show) {
      const trackMapping = {
        'Week 1': 'week1.mp3',
        'Week 2': 'week2.mp3',
        'Week 3': 'week3.mp3',
      };
      const audioFile = trackMapping[show] || 'default.mp3';
      const audioRefFirebase = ref(storage, `public/spring24/${audioFile}`);


      

      getDownloadURL(audioRefFirebase)
        .then((url) => {
          setTrackUrl(url);
        })
        .catch((error) => {
          console.error('Error getting download URL', error);
        });
    }
  }, [router.isReady, show]);

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
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const updateProgress = () => {
    const duration = audioRef.current.duration;
    const currentTime = audioRef.current.currentTime;

    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
      setCurrentTime(formatTime(currentTime));
      setTotalTime(formatTime(duration));
    }
  };

  const seekAudio = (e) => {
    const duration = audioRef.current.duration;
    const newValue = e.target.value;
    audioRef.current.currentTime = (newValue / 100) * duration;
    setProgress(newValue);
  };

  // Check if router is ready, and if show and trackUrl are available
  if (!router.isReady || !show || !trackUrl) return <p>Loading...</p>;

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        backgroundColor: '#F2CAED',
        padding: '50px',
        height: '100vh',
        position: 'relative',
      }}
    >
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
        />
      </Head>

      {/* Logo in the top-left corner as a Home button */}
      <header style={{ position: 'absolute', top: '-75px', left: '15px' }}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="UCLA Radio Logo"
            width={300}
            height={150}
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </header>

      <h1>Now Playing: {show}</h1>

      {/* Progress Bar */}
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={seekAudio}
        style={{ width: '80%', marginTop: '20px' }}
      />

      {/* Time Display and Play Button */}
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: '18px' }}>
          {currentTime} / {totalTime}
        </div>
        <button
          onClick={playAudio}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#333',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            marginTop: '15px',
          }}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      {/* Volume Control and Icon */}
      <div
        style={{
          position: 'absolute',
          bottom: '200px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaVolumeUp style={{ fontSize: '24px', marginRight: '10px' }} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={changeVolume}
          style={{ width: '150px', height: '10px' }}
        />
      </div>

      <audio
        ref={audioRef}
        src={trackUrl}
        style={{ display: 'none' }}
        onTimeUpdate={updateProgress}
      />

      <style jsx global>{`
        html,
        body {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f2caed; /* Pink background */
        }
      `}</style>
    </div>
  );
}
