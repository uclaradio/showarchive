// pages/[show].js

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { dbAdmin } from "../lib/firebaseAdmin";
import { useAudio } from "../context/AudioContext";

//Components
import MiniPlayer from "../components/MiniPlayer";
import ExpandedShowModal from "../components/ExpandedShowModal";

//Add Firebase Client sdk?

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

export async function getStaticPaths() {
  const collections = await dbAdmin.listCollections();
  const show_map = new Map();

  for (const collection of collections) {
    const quarter = collection.id;
    const snap = await collection.get();
    
    snap.docs.forEach((doc) => {
      const showData = doc.data();
      const showName = showData.showName || showData.name || doc.id;
      const slug = showNameToSlug(showName);
      
      if (!show_map.has(slug)) {
        show_map.set(slug, showName);
      }
    });
  }

  //gen path
  const paths = Array.from(show_map.keys()).map((slug) => ({
    params: { show: slug },
  }));

  console.log(`Generated ${paths.length} show paths`);
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { show: showSlug } = params; // showSlug is the URL parameter (e.g., "the-bins")
  
  const collections = await dbAdmin.listCollections();
  const episodes = []; // All episodes for this show across all quarters

  // Search all quarters for episodes matching this show
  for (const collection of collections) {
    const quarter = collection.id;
    const snap = await collection.get();
    
    snap.docs.forEach((doc) => {
      const showData = doc.data();
      const showName = showData.showName || showData.name || doc.id;
      const episodeSlug = showNameToSlug(showName);
      
      // If this episode's slug matches the requested show slug
      if (episodeSlug === showSlug) {
        episodes.push({
          id: doc.id,
          quarter: quarter, // Store quarter as metadata
          ...showData,
        });
      }
    });
  }

  const showName = episodes.length > 0 
    ? (episodes[0].showName || episodes[0].name || 'Show')
    : 'Show';

  console.log(`Found ${episodes.length} episodes for show: ${showName} (slug: ${showSlug})`);

  return {
    props: { 
      episodes,
      showName,
      showSlug,
    },
    revalidate: 60,
  };
}

export default function ShowPage({  shows, quarter  }) {
    //const [imageUrls, setImageUrls] = useState({});
    //const [isMobile, setIsMobile] = useState(false);

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
        <div>
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