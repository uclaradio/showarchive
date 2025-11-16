// pages/index.js
// LANDING PAGE
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAudio } from "../context/AudioContext";
//Components
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
//Styling
import styles from "../styles/home.module.css";
//Firebase 
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref as storageRefDb,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../lib/firebaseAdmin";
import firebaseConfig from "../lib/firebaseClient";

export async function getStaticProps() { 
  const collections = await db.listCollections();
    const shows = collections.map((col) => col.id);
  
    return {
      props: { shows }, //right now: "episodes", "fall24", "winter25", in future = show-name
      revalidate: 60,
    };
}

export default function Home({ shows }) {
  const [imageUrls, setImageUrls] = useState({});
  const storage = getStorage();

  console.log("Component received shows:", shows?.length || 0);
  if (shows && shows.length > 0) {
    console.log("Sample show in component:", shows[0]);
  }

  // Audio context for player state
  const {
    currentShow,
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
    openModal,
    closePlayer,
    minimizeToPlayer,
    expandToModal,
  } = useAudio();

  useEffect(() => {
    let isCancelled = false;
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    // TODO: Add image fetching logic here
    shows.forEach((show) => {
      const imgRef = storageRefDb(storage, `public/${show.quarter}/${show.id}.png`);
      getDownloadURL(imgRef).then((url) => {
        if (!isCancelled) {
           setImageUrls((prev) => ({ ...prev, [show.id]: url }));
        }
      })
      .catch(() => {});
    });

    return () => {
      isCancelled = true;
    };
  }, [shows]);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <div className={styles.logoContainer}>
          <Image
            src="/radiopink.png"
            alt="UCLA Radio Logo"
            width={200}
            height={160}
            className={styles.logoImage}
          />
        </div>
        <h1 className={styles.mainTitle}>Show Archive</h1>
        <p className={styles.subtitle}>Missed a show? Find it here! <span className={styles.arrow}>↓</span></p>
      </div>

      <div className={styles.showsContainer}>
        {shows && shows.length > 0 ? (
          (() => {
            //Routing: pages/[show].js
            return shows.map((show) => (
              <Link 
                key={show} 
                href={`/${show}`} //slug? depends on collection naming conventions
                className={styles.showLink}
              >
                <div className={styles.showCard}
                  key={show.id}>
                  <div className={styles.imageContainer}>
                    <img
                      src={imageUrls[show.id] || '/radioblue.jpg'}
                      alt={show.name}
                      className={styles.image}
                      loading="lazy"
                    />
                    <div className={styles.imageOverlay} />
                  </div>
                  <div className={styles.showName}>{show.name}</div>
                </div>
              </Link>
            ));
          })()
        ) : (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulse}></div>
            <p className={styles.loadingText}>Loading shows...</p>
          </div>
        )}
      </div>

      <ExpandedShowModal
        show={currentShow || {}}
        imageUrl={imageUrl}
        audioUrl={audioUrl}
        isOpen={isModalOpen}
        onClose={closePlayer}
        onMinimize={minimizeToPlayer}
        audioRef={audioRef}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlayPause}
        onSeek={handleSeek}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <MiniPlayer
        show={currentShow}
        imageUrl={imageUrl}
        audioUrl={audioUrl}
        isVisible={isMiniPlayerVisible}
        audioRef={audioRef}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlayPause}
        onSeek={handleSeek}
        onExpand={expandToModal}
        onClose={closePlayer}
      />
    </div>
  );
}