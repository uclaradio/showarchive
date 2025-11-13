// pages/[show].js
//CURRENT db: public/quarter/sotw#.png
//FUTURE db: public/show-name/show-name.png
            //public/show-name/date.mp3

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { dbAdmin } from "../lib/firebaseAdmin";
import { useAudio } from "../context/AudioContext";
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref as storageRefDb, // Renamed to avoid conflict with React's ref
  getDownloadURL,
} from "firebase/storage";
import firebaseConfig from "../lib/firebaseClient";
//Components
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
//Styling
import styles from "../styles/show.module.css";

const showToSlug = (show) => {
  if (!show) return '';
  return show
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') //no special characters
    .replace(/\s+/g, '-') // spaces -> hyphens
    .replace(/-+/g, '-') //multiple hyphens -> single
    .replace(/^-|-$/g, ''); //no leading/trailing hyphens
};

export async function getStaticPaths() {
  const collections = await dbAdmin.listCollections();
  /*
  const paths = collections.map((collection) => ({
    params: { show: collection.id },
  }));
  */
  const show_map = new Map();

  for (const collection of collections) {
    const quarter = collection.id;
    const snap = await collection.get();
    
    snap.docs.forEach((doc) => {
      const showData = doc.data();
      const slug = showToSlug(showData.name);
      
      if (!show_map.has(slug)) {
        show_map.set(slug, showData.name);
      }
    });
  }

  const paths = Array.from(show_map.keys()).map((slug) => ({
    params: { show: slug },
  }));

  return { paths, fallback: false }; //keep
}

export async function getStaticProps({ params }) {
  /*
   const { show } = params;
  const snap = await dbAdmin.collection(show).get();

  const episodes = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: { episodes, show },
    revalidate: 60,
  };
  */
  const { show } = params; //e.g., "the-bins"
  const collections = await dbAdmin.listCollections();

  /*for (const collection of collections) {
    const quarter = collection.id;
     snap.docs.forEach((doc) => { //check if doc.id (sotw#) belongs to show
    });
  } */
  
  return { //keep
    props: { show }, //episodes
    revalidate: 60,
  };
}

export default function ShowPage({  episodes, show  }) {
  const [imageUrls, setImageUrls] = useState({});
  //const [isMobile, setIsMobile] = useState(false);

  /*useEffect(() => {
      let isCancelled = false;
      if (!getApps().length) {
        initializeApp(firebaseConfig);
      }
      const storage = getStorage();

      const imgRef = storageRefDb(storage, `public/${quarter}/sotw1.png`); //CHANGE PATH WHEN STORAGE ORG UPDATES -> public/show-slug/show-slug.png
      getDownloadURL(imgRef)
        .then((url) => {
                if (!isCancelled) {
                  setImageUrls((prev) => ({ ...prev, [show.id]: url }));
                }
              });
      return () => {
        isCancelled = true;
      };
    }, [quarter, shows]);
  */
    const {
      currentShow,
      // currentQuarter, // This seems to be sourced from 'quarter' prop now
      imageUrl: audioContextImageUrl, // Renamed to avoid conflict
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

  return ( 
    <div className={styles.pageContainer}>
      <div className={styles.backButtonContainer}>
        <Link href="/" className={styles.backButton}>
          <span className={styles.backArrow}>←</span>
          <span className={styles.backText}> back</span>
        </Link>
    </div>

    <div className={styles.imageContainer}> 
        <img src={ "/radioblue.jpg"}
              alt={show.name}
              className={styles.showImage}
              loading="lazy"/>
    </div>

    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.showTitle}>
          {show}
        </h1>
        <div className={styles.headerDivider} />
      </div>
    </header>

    <ExpandedShowModal
      show={currentShow || {}}
      imageUrl={audioContextImageUrl}
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
    show={currentShow || {}}
    imageUrl={audioContextImageUrl}
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