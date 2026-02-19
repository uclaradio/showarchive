// pages/[show].js
// db storage path: archive/show-slug/date/date.mp3

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAudio } from "../context/AudioContext";
//Firebase
import { storage } from "../lib/firebaseClient";
import { db } from "../lib/firebaseAdmin";
import { ref as storageRefDb, getDownloadURL } from "firebase/storage";
//Components
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
//Styling
import styles from "../styles/show.module.css";

// Academic quarter from date: Sep–Dec Fall, Jan–Mar Winter, Apr–Jun Spring, Jul–Aug Summer
function getQuarterFromDate(episodeDate) {
  if (!episodeDate || typeof episodeDate !== "string") return "Other";
  const [y, m] = episodeDate.split("-").map(Number);
  if (!y || !m) return "Other";
  if (m >= 9 && m <= 12) return `Fall ${y}`;
  if (m >= 1 && m <= 3) return `Winter ${y}`;
  if (m >= 4 && m <= 6) return `Spring ${y}`;
  if (m >= 7 && m <= 8) return `Summer ${y}`;
  return "Other";
}

function groupEpisodesByQuarter(episodes) {
  const byQuarter = {};
  (episodes || []).forEach((ep) => {
    const q = getQuarterFromDate(ep.episodeDate || ep.date);
    if (!byQuarter[q]) byQuarter[q] = [];
    byQuarter[q].push(ep);
  });
  return Object.entries(byQuarter)
    .map(([quarter, eps]) => ({
      quarter,
      episodes: eps.sort((a, b) => (a.episodeDate || a.date || "").localeCompare(b.episodeDate || b.date || "")),
    }))
    .sort((a, b) => {
      const dateA = a.episodes[a.episodes.length - 1]?.episodeDate || a.episodes[a.episodes.length - 1]?.date || "";
      const dateB = b.episodes[b.episodes.length - 1]?.episodeDate || b.episodes[b.episodes.length - 1]?.date || "";
      return dateB.localeCompare(dateA);
    });
}

export async function getStaticPaths() {
  const collections = await db.listCollections();
  const paths = collections.map((col) => ({
    params: { show: col.id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { show } = params;
  const snap = await db.collection(show).get();
  const episode = snap.docs.map((doc) => {
    const ep_metadata = doc.data();
    delete ep_metadata.createdAt;
    return { id: doc.id, ...ep_metadata };
  });
  return { props: { episode, show }, revalidate: 60 };
}

export default function ShowPage({ episode, show }) {
  const [showImageUrl, setShowImageUrl] = useState(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState({});

  const { showTitle, djName } = useMemo(() => {
    const first = episode?.[0];
    if (!first) return { showTitle: show, djName: "" };
    const title = first.showTitle || (show && show.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())) || show;
    const full = first.showName || "";
    const dj = full.includes(",") ? full.replace(/^[^,]+,/, "").trim() : first.DJ1 || "";
    return { showTitle: title, djName: dj };
  }, [episode, show]);

  const episodesByQuarter = useMemo(() => groupEpisodesByQuarter(episode), [episode]);

  useEffect(() => {
    let cancelled = false;
    const ref = storageRefDb(storage, `public/${show}.png`);
    getDownloadURL(ref)
      .then((url) => { if (!cancelled) setShowImageUrl(url); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [show]);

  const handleEpisodeClick = async (ep) => {
    if (!ep.storagePath) {
      console.error("No storage path for episode:", ep.id);
      return;
    }
    setLoadingEpisodes((prev) => ({ ...prev, [ep.id]: true }));
    try {
      const audioRef = storageRefDb(storage, ep.storagePath);
      const audioUrl = await getDownloadURL(audioRef);
      const image = showImageUrl || "/radioblue.jpg";
      const showData = { name: showTitle, DJ1: djName, ...ep };
      openMiniPlayer(showData, null, image, audioUrl);
    } catch (error) {
      console.error("Error loading audio for", ep.id, error);
    } finally {
      setLoadingEpisodes((prev) => ({ ...prev, [ep.id]: false }));
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
      <header className={styles.topBar}>
        <Link href="/" className={styles.backButton}>
          <span className={styles.backArrow}>←</span>
          <span className={styles.backText}> back</span>
        </Link>
        <span className={styles.topBarTitle}>Show Archive</span>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.showHero}>
          <div className={styles.showImageWrap}>
            <img
              src={showImageUrl || "/radioblue.jpg"}
              alt=""
              className={styles.showImage}
              loading="lazy"
            />
          </div>
          <div className={styles.showHeader}>
            <h1 className={styles.showTitle}>{showTitle}</h1>
            {djName && <p className={styles.showDJ}>{djName}</p>}
          </div>
        </div>

        <div className={styles.episodesSection}>
          {episodesByQuarter.length > 0 ? (
            episodesByQuarter.map(({ quarter, episodes }) => (
              <div key={quarter} className={styles.quarterBlock}>
                <h2 className={styles.quarterTitle}>{quarter}</h2>
                <ul className={styles.episodesList}>
                  {episodes.map((ep, idx) => (
                    <li key={ep.id}>
                      <button
                        type="button"
                        className={styles.episodeItem}
                        onClick={() => handleEpisodeClick(ep)}
                        disabled={loadingEpisodes[ep.id]}
                      >
                        <span className={styles.episodeLabel}>Episode {idx + 1}</span>
                        <span className={styles.episodePlayButton}>
                          {loadingEpisodes[ep.id] ? (
                            <span className={styles.loadingSpinner} aria-hidden />
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className={styles.noEpisodes}>No episodes available</p>
          )}
        </div>
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