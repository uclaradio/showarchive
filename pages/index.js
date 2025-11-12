// pages/index.js
//LANDING PAGE

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { dbAdmin } from "../lib/firebaseAdmin";
import { useAudio } from "../context/AudioContext";
//Components
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
//Styling
import GradientBackgroundLanding from "../components/GradientBackgroundLanding";
import styles from "../styles/Home.module.css";

//Firebase client SDK imports
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref as storageRefDb,
  getDownloadURL,
} from "firebase/storage";
import firebaseConfig from "../lib/firebaseClient";

export async function getStaticProps() { 
  try {
    console.log("getStaticProps: Starting database fetch...");
    const collections = await dbAdmin.listCollections();
    console.log("Collections found:", collections.map((col) => col.id));
    console.log("Number of collections:", collections.length);
    
    if (collections.length === 0) {
      console.warn("No collections found!");
      return {
        props: { shows: [] },
        revalidate: 60,
      };
    }
    
    const all_shows = []; 
    for (const collection of collections) { //ADJUST WHEN FIREBASE REORG FROM QUARTERS -> SHOWS
      const quarter = collection.id; // e.g. "fall24"
      console.log(`Processing quarter: ${quarter}`);
      
      try {
        const snap = await collection.get();
        console.log(`Found ${snap.docs.length} shows in ${quarter}`);

        snap.docs.forEach((doc) => {
          const showData = doc.data();
          all_shows.push({
            id: doc.id,
            quarter: quarter, //quarter = metadata
            ...showData,
          });
        });
      } catch (error) {
        console.error(`Error fetching from ${quarter}:`, error);
      }
    }

    console.log(`Total shows fetched: ${all_shows.length}`);
    if (all_shows.length > 0) {
      console.log("sample show struct:", {
        id: all_shows[0].id,
        quarter: all_shows[0].quarter,
        hasName: !!all_shows[0].name,
        hasShowName: !!all_shows[0].showName,
        keys: Object.keys(all_shows[0]),
      });
    } else {
      console.warn("WARNING: No shows found in any collection!");
    }

    return {
      props: { shows: all_shows },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      props: { shows: [] },
      revalidate: 60,
    };
  }
}

//url-friendly slug
const showNameToSlug = (showName) => {
  if (!showName) return '';
  return showName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export default function Home({ shows }) {
  console.log("Component received shows:", shows?.length || 0);
  if (shows && shows.length > 0) {
    console.log("Sample show in component:", shows[0]);
  }

  const [imageUrls, setImageUrls] = useState({});

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
    const storage = getStorage(); // Get storage instance

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
        
        <p className={styles.subtitle}>
          Missed a show? Find it here! <span className={styles.arrow}>↓</span>
        </p>
      </div>

      <div className={styles.quartersContainer}>
        {shows && shows.length > 0 ? (
          (() => {
            const showMap = new Map();
            shows.forEach((show) => {
              const showName = show.showName || show.name || show.id;
              if (!showMap.has(showName)) {
                showMap.set(showName, {
                  name: showName,
                  id: show.id,
                  quarter: show.quarter,
                  slug: showNameToSlug(showName),
                });
              }
            });
            const uniqueShows = Array.from(showMap.values());
            
            console.log("Unique shows found:", uniqueShows.length);
            console.log("Unique shows:", uniqueShows);
            //routing to show pages (pages/[show].js)
            return uniqueShows.map((show) => (
              <Link 
                key={show.slug} 
                href={`/${show.slug}`}
                className={styles.quarterLink}
              >
                <div className={styles.quarterCard}
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