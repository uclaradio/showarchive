// pages/[show].js
// db storage path: archive/show-name-dj-name/date/date.mp3

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAudio } from "../context/AudioContext";
//Firebase
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref as storageRefDb, // Renamed to avoid conflict with React's ref
  getDownloadURL,
} from "firebase/storage";
import firebaseConfig from "../lib/firebaseClient";
import { db } from "../lib/firebaseAdmin";
//Components
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
//Styling
import styles from "../styles/show.module.css";

export async function getStaticPaths() {
  const collections = await db.listCollections();
  const paths = collections.map((col) => ({
    params: { show: col.id },
  }));
  return { 
    paths, 
    fallback: false 
  };
}

export async function getStaticProps({ params }) {
  const { show } = params;
  const snap = await db.collection(show).get();
  const episode = snap.docs.map((doc) => {
    const ep_metadata = doc.data();
    delete ep_metadata.createdAt; //UTC cannot be serialized as JSON
    return {
      id: doc.id, //ex: show-name-dj-name_ep-date
      ...ep_metadata, //"showName" = show name + DJ name; storagePath
    };
    });
  
  return {
    props: { episode, show },
    revalidate: 60
  }
}

export default function ShowPage({  episode, show  }) {
  const [imageUrls, setImageUrls] = useState({});
  //const [isMobile, setIsMobile] = useState(false);
  
  

  const {
      currentShow,
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