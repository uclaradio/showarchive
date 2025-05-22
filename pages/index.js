// pages/index.js
import Link from "next/link";
import Image from "next/image";
import { dbAdmin } from "../lib/firebaseAdmin";
import GradientBackgroundLanding from "../components/GradientBackgroundLanding";
import styles from "../styles/Home.module.css";
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";
import { useAudio } from "../context/AudioContext";

export async function getStaticProps() {
  const collections = await dbAdmin.listCollections();
  const quarters = collections.map((col) => col.id);

  return {
    props: { quarters },
    revalidate: 60,
  };
}

// Format quarter title similar to how it's done in [quarter].js
const formatQuarterTitle = (quarter) => {
  const [season, year] = quarter.split(" ");
  return `${
    // capitalize the first char of "everything but the last two"
    season.charAt(0).toUpperCase() +
    season.slice(1, -2)
  } ${
    // the final two characters
    season.slice(-2)
  }`;
};

export default function Home({ quarters }) {
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
        {quarters.length > 0 ? (
          quarters.map((quarter) => (
            <Link 
              key={quarter} 
              href={`/${quarter}`}
              className={styles.quarterLink}
            >
              <div className={styles.quarterCard}>
                <span>{formatQuarterTitle(quarter)}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulse}></div>
            <p className={styles.loadingText}>Loading quarters...</p>
          </div>
        )}
      </div>

      {/* Expanded Show Modal */}
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
      
      {/* Mini Player - Now included on the index page */}
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