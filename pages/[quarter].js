// pages/[quarter].js
import { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Keep for back button, but cards are now divs
import { dbAdmin } from "../lib/firebaseAdmin";
import styles from "../styles/QuarterPage.module.css";
import GradientBackground from "../components/GradientBackground"; // Kept, though newer version uses pageContainer
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
import { useAudio } from "../context/AudioContext";

// Firebase client SDK imports (static, as in the older version)
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref as storageRefDb, // Renamed to avoid conflict with React's ref
  getDownloadURL,
} from "firebase/storage";
import firebaseConfig from "../lib/firebaseClient";

export async function getStaticPaths() {
  const collections = await dbAdmin.listCollections();
  const paths = collections.map((col) => ({
    params: { quarter: col.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { quarter } = params;
  const snap = await dbAdmin.collection(quarter).get();

  const shows = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    props: { shows, quarter },
    revalidate: 60,
  };
}

export default function QuarterPage({ shows, quarter }) {
  const [imageUrls, setImageUrls] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const carouselRefs = useRef({});

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

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // On mount, init Firebase and fetch all image URLs
  useEffect(() => {
    let isCancelled = false;
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    const storage = getStorage(); // Get storage instance

    shows.forEach((show) => {
      const imgRef = storageRefDb(storage, `public/${quarter}/${show.id}.png`);
      getDownloadURL(imgRef)
        .then((url) => {
          if (!isCancelled) {
            setImageUrls((prev) => ({ ...prev, [show.id]: url }));
          }
        })
        .catch(() => {
          // no-op on missing file; we'll fall back below
        });
    });
    return () => {
      isCancelled = true;
    };
  }, [quarter, shows]);

  // Helper to scroll the carousels - adjusted for mobile
  const scrollBy = (cat, amt) => {
    const node = carouselRefs.current[cat];
    if (!node) return;
    const scrollAmount = isMobile ? amt * 0.7 : amt;
    node.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Group shows by category
  const groupedShows = shows.reduce((acc, show) => {
    const cat = show.category?.trim() || "Shows of the Week";
    (acc[cat] = acc[cat] || []).push(show);
    return acc;
  }, {});

  // Format header title (using the improved version)
// Format header title to "Season YY" (e.g., "Fall 24" from "fall24")
  const getSeasonTitle = (q) => {
    if (!q || typeof q !== 'string' || q.length < 3) {
      // Return the input as is if it's not a string or too short,
      // or a default like "Quarter" or "Loading..." if q is undefined/null.
      return q || "Quarter";
    }

    const seasonNamePart = q.slice(0, -2); // Extracts "fall" from "fall24"
    const yearPart = q.slice(-2);       // Extracts "24" from "fall24"

    // Ensure the year part is numeric, otherwise, the format might be unexpected.
    if (!seasonNamePart || !/^\d{2}$/.test(yearPart)) {
      return q; // Return original if not in the "nameYY" format
    }

    const capitalizedSeason =
      seasonNamePart.charAt(0).toUpperCase() +
      seasonNamePart.slice(1).toLowerCase(); // Capitalizes "Fall" from "fall"

    return `${capitalizedSeason} ${yearPart}`; // Returns "Fall 24"
  };


  // Handle clicking on a show card
  const handleShowClick = async (e, show) => {
    e.preventDefault(); // Prevent default if it was an anchor, good practice for divs acting as buttons
    const image = imageUrls[show.id] || "/radioblue.jpg";

    try {
      // Firebase app should already be initialized by the useEffect hook
      // Ensure storage is available
      const storage = getStorage(); // Get storage instance directly

      const audioFileRef = storageRefDb(storage, `public/${quarter}/${show.id}.mp3`);
      const fetchedAudioUrl = await getDownloadURL(audioFileRef);
      openModal(show, quarter, image, fetchedAudioUrl);
    } catch (error) {
      console.log(`No audio found for ${show.id} or error fetching:`, error);
      openModal(show, quarter, image, null); // Open modal even if audio is not found
    }
  };

  // Touch handling for mobile swipe gestures
  const touchStartRef = useRef(null); // Renamed to avoid conflict if any
  const touchEndRef = useRef(null);   // Renamed to avoid conflict if any

  const onTouchStart = (e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = (category) => {
    if (
      touchStartRef.current == null ||
      touchEndRef.current == null
    )
      return;
    const distance =
      touchStartRef.current - touchEndRef.current;
    // Adjust scroll distance for touch to feel more natural, if needed
    if (distance > 50) scrollBy(category, isMobile ? 250 : 300); // Example: slightly less for mobile touch
    if (distance < -50) scrollBy(category, isMobile ? -250 : -300);

    // Reset refs
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  // If using GradientBackground, it should wrap the entire content or pageContainer
  // The new version uses styles.pageContainer, so we'll adopt that.
  // GradientBackground might need to be applied to styles.pageContainer or be a direct child.
  // For now, I'll assume styles.pageContainer handles its own background or GradientBackground wraps it.

  return (
    
      <div className={styles.pageContainer}>
        <div className={styles.backButtonContainer}>
          <Link href="/" className={styles.backButton}>
            <span className={styles.backArrow}>←</span>
            <span className={styles.backText}>Back</span>
          </Link>
        </div>

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.headerTitle}>
              {getSeasonTitle(quarter)}
            </h1>
            <div className={styles.headerDivider} />
          </div>
        </header>

        <div className={styles.contentContainer}>
          {Object.entries(groupedShows).map(([category, categoryShows]) => ( // Renamed 'shows' to 'categoryShows' to avoid conflict
            <div key={category} className={styles.categorySection}>
              <h2 className={styles.categoryHeading}>{category}</h2>
              <div className={styles.carouselWrapper}>
                {!isMobile && (
                  <button
                    className={styles.navButton}
                    onClick={() => scrollBy(category, -600)} // Value from new version
                    aria-label="Scroll left"
                  >
                    <span className={styles.arrowIcon}>←</span>
                  </button>
                )}
                <div
                  className={styles.carousel}
                  ref={(el) => (carouselRefs.current[category] = el)}
                  onTouchStart={isMobile ? onTouchStart : undefined}
                  onTouchMove={isMobile ? onTouchMove : undefined}
                  onTouchEnd={isMobile ? () => onTouchEnd(category) : undefined}
                >
                  {categoryShows.map((show) => (
                    <div // Changed from Link to div for onClick interaction
                      key={show.id}
                      className={styles.card}
                      onClick={(e) => handleShowClick(e, show)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleShowClick(e, show);
                        }
                      }}
                    >
                      <div className={styles.imageContainer}> {/* From new version */}
                        <img
                          src={imageUrls[show.id] || "/radioblue.jpg"}
                          alt={show.name}
                          className={styles.image}
                          loading="lazy" // From new version
                        />
                        <div className={styles.imageOverlay} /> {/* From new version */}
                      </div>
                      <div className={styles.showName}>{show.name}</div>
                    </div>
                  ))}
                </div>
                {!isMobile && (
                  <button
                    className={styles.navButton}
                    onClick={() => scrollBy(category, 600)} // Value from new version
                    aria-label="Scroll right"
                  >
                    <span className={styles.arrowIcon}>→</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(groupedShows).length === 0 && !shows.length && ( // Check shows.length as well for initial load before grouping
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulse} />
            <p className={styles.loadingText}>Loading shows...</p>
          </div>
        )}

        <ExpandedShowModal
          show={currentShow || {}} // Ensure currentShow is not null
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
          show={currentShow}
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