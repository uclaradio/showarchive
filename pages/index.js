// pages/index.js
// LANDING PAGE — Netflix-style: featured hero + show grid
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAudio } from "../context/AudioContext";
//Components
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
//Styling
import styles from "../styles/Home.module.css";
//Firebase
import { storage } from "../lib/firebaseClient";
import { ref as storageRefDb, getDownloadURL } from "firebase/storage";
import { db } from "../lib/firebaseAdmin";

// Pick a stable "random" show index for the current day (same all day, new tomorrow)
function getFeaturedShowIndex(shows, seedDateString) {
  if (!shows?.length) return 0;
  let hash = 0;
  for (let i = 0; i < seedDateString.length; i++) {
    hash = (hash << 5) - hash + seedDateString.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % shows.length;
}

export async function getStaticProps() {
  const collections = await db.listCollections();
  const shows = await Promise.all(
    collections.map(async (col) => {
      const slug = col.id;
      const snap = await db.collection(slug).limit(1).get();
      const firstDoc = snap.docs[0];
      const showTitle = firstDoc?.data()?.showTitle ?? null;
      // Fallback: format slug as title (e.g. "ballin-with-bruins" -> "Ballin With Bruins")
      const name =
        showTitle ||
        slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
      return { id: slug, name };
    })
  );
  return {
    props: { shows },
    revalidate: 60,
  };
}

export default function Home({ shows }) {
  const [imageUrls, setImageUrls] = useState({});
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredShow = useMemo(() => {
    if (!shows?.length) return null;
    const i = featuredIndex >= shows.length ? 0 : featuredIndex;
    return shows[i];
  }, [shows, featuredIndex]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setFeaturedIndex(getFeaturedShowIndex(shows || [], today));
  }, [shows]);

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
    if (!shows?.length) return;

    shows.forEach((show) => {
      const imgRef = storageRefDb(storage, `public/${show.id}.png`);
      getDownloadURL(imgRef)
        .then((url) => {
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
      <header className={styles.topBar}>
        <Link href="/" className={styles.topBarLogo}>
          <Image
            src="/radiopink.png"
            alt="UCLA Radio"
            width={120}
            height={96}
            className={styles.logoImage}
          />
        </Link>
        <h1 className={styles.topBarTitle}>Show Archive</h1>
      </header>

      {featuredShow && (
        <Link href={`/${featuredShow.id}`} className={styles.featuredBanner}>
          <div className={styles.featuredImageWrap}>
            <img
              src={imageUrls[featuredShow.id] || "/radioblue.jpg"}
              alt=""
              className={styles.featuredImage}
            />
          </div>
          <div className={styles.featuredContent}>
            <p className={styles.featuredLabel}>Today&apos;s pick</p>
            <h2 className={styles.featuredTitle}>{featuredShow.name}</h2>
            <span className={styles.featuredCta}>Browse episodes</span>
          </div>
        </Link>
      )}

      <section className={styles.moreSection}>
        <h2 className={styles.sectionHeading}>All shows</h2>
        <div className={styles.showsContainer}>
          {shows && shows.length > 0 ? (
            shows.map((show) => (
              <Link
                key={show.id}
                href={`/${show.id}`}
                className={styles.showLink}
              >
                <div className={styles.showCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={imageUrls[show.id] || "/radioblue.jpg"}
                      alt={show.name}
                      className={styles.image}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.showName}>{show.name}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingPulse}></div>
              <p className={styles.loadingText}>Loading shows...</p>
            </div>
          )}
        </div>
      </section>

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