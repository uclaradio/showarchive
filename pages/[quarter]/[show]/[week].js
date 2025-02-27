import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const API_KEY = "KEY"; // Replace with your actual API key

export async function getServerSideProps(context) {
  const { query } = context;
  const { week, audio, photo } = query;

  return {
    props: { week, audio, photo }, // Pass as props
  };
}

export default function NowPlaying({ week, audio, photo }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const extractID = (url) => {
    const match = url.match(/\/d\/([^/]+)|id=([^&]+)/);
    return match ? (match[1] || match[2]) : "No match found";
  };

  console.log("Extracted photo ID", extractID(photo));
  console.log("Extracted audio ID", extractID(audio));

  useEffect(() => {
    if (audio) {
      const fileId = extractID(audio);
      if (fileId) {
        setAudioUrl(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`);
      }
    }

    if (photo) {
      const fileId = extractID(photo);
      if (fileId) {
        setPhotoUrl(`https://drive.google.com/thumbnail?id=${fileId}`);
      }
    }
  }, [audio, photo]);

  const googlePlayerURL = `https://drive.google.com/file/d/${extractID(audio)}/preview`;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Now Playing - Week {week}</h1>

      {photoUrl && (
        <img src={photoUrl} alt="Show Cover" className="w-64 h-64 mt-4 rounded-lg" />
      )}

      {audioUrl ? (
        <div className="mt-4">
          <ReactPlayer url={audioUrl} controls width="100%" height="50px" />
        </div>
      ) : (
        <p>No audio available</p>
      )}
    </div>
  );
}
