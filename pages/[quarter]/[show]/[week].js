import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export async function getServerSideProps(context) {
  const { query } = context;
  const { week, audio, photo } = query;

  return {
    props: { week, audio, photo }, // Pass as props
  };
}

export default function NowPlaying({ week, audio, photo }) {
  const extractID = (url) => {
    const match = url.match(/\/d\/([^/]+)|id=([^&]+)/);
    return match ? (match[1] || match[2]) : "No match found";
  };
  console.log("Extracted photo ID", extractID(photo));
  console.log("Extracted audio ID", extractID(audio));
  const googlePlayerURL = `https://drive.google.com/file/d/${extractID(audio)}/preview`;

  //We are going to need to use Google Drive API [+ react-player] because the audio files are too large & must be scanned for viruses
  //The API would allow us to stream the audio files
  //Right now we are just using the google player, which is not customizable for the UI we want to achieve
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current && audio) {
      const audioUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(extractID(audio))}`;
      console.log("Downloadable link:", audioUrl);

      audioRef.current.src = audioUrl;
      audioRef.current.load(); // Forces React to reload the audio
    }
  }, [audio]);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Now Playing - Week {week}</h1>
      {photo && <img src={`https://drive.google.com/thumbnail?id=${extractID(photo)}`} alt="Show Cover" className="w-64 h-64 mt-4 rounded-lg" />}
      {audio && <iframe src={googlePlayerURL} width="640" height="480" allow="autoplay"></iframe>    }
      {audio ? (
        
        <audio ref={audioRef} controls className="mt-4 w-full">
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No audio available</p>
      )}
    </div>
  );
}
