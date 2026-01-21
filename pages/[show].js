// pages/[show].js
// db storage path: archive/show-name-dj-name/date/date.mp3

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAudio } from "../context/AudioContext";
//Firebase
import {  storage } from "../lib/firebaseClient";
import {  db  } from "../lib/firebaseAdmin";
import { ref as storageRefDb, getDownloadURL } from "firebase/storage";
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
  const [loadingEpisodes, setLoadingEpisodes] = useState({});
  //const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    //for each: load img from episode.storagePath
  }, [show, episode])

  const handleEpisodeClick = async (ep) => {
    if (!ep.storagePath) {
      console.error('No storage path for episode:', ep.id);
      return;
    }

    setLoadingEpisodes(prev => ({ ...prev, [ep.id]: true }));

    try {
      const audioRef = storageRefDb(storage, ep.storagePath);
      const audioUrl = await getDownloadURL(audioRef);
      const image = imageUrls[ep.id] || "/radioblue.jpg";
      
      const showData = {
        name: ep.showName || show,
        DJ1: ep.DJ1 || '',
        ...ep
      };

      openMiniPlayer(showData, null, image, audioUrl);
    } catch (error) {
      console.error(`Error loading audio for ${ep.id}:`, error);
    } finally {
      setLoadingEpisodes(prev => ({ ...prev, [ep.id]: false }));
    }
  };

  const {
      currentShow,
      imageUrl: audioContextImageUrl,
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
      //openModal,
      openMiniPlayer,
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
              alt={show}
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

    {/*episodes*/}
    <div className={styles.episodesContainer}>
      <h2 className={styles.sectionTitle}>Episodes</h2>
      {episode && episode.length > 0 ? (
        <div className={styles.episodesList}>
          {episode.map((ep) => (
            <button
              key={ep.id}
              className={styles.episodeItem}
              onClick={() => handleEpisodeClick(ep)}
              disabled={loadingEpisodes[ep.id]}
            >
              <div className={styles.episodeContent}>
                <div className={styles.episodeInfo}>
                  <h3 className={styles.episodeTitle}>
                    {ep.showName || ep.id}
                  </h3>
                  {ep.DJ1 && (
                    <p className={styles.episodeDJ}>{ep.DJ1}</p>
                  )}
                  {ep.date && (
                    <p className={styles.episodeDate}>{ep.date}</p>
                  )}
                </div>
                <div className={styles.episodePlayButton}>
                  {loadingEpisodes[ep.id] ? (
                    <div className={styles.loadingSpinner}></div>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 5L19 12L7 19V5Z" fill="currentColor" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className={styles.noEpisodes}>No episodes available</p>
      )}
    </div>

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