import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const key = process.env.NEXT_PUBLIC_DRIVEAPI_KEY; //include .env.local with Google Drive API Key

export async function getServerSideProps(context) {
  const { query, params } = context;
  const { audio, photo } = query; 
  const { week, show, quarter } = params;

  return {
    props: { 
      week, 
      show, 
      quarter, 
      audio,
      photo}, 
  };
}


export default function NowPlaying({ week, audio, photo }) {
  console.log("NowPlaying component", audio, photo);

  const [audioUrl, setAudioUrl] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const extractID = (url) => {
    const match = url.match(/\/d\/([^/]+)|id=([^&]+)/);
    return match ? (match[1] || match[2]) : "undefined";
  };

  useEffect(() => {
    console.log("useEffect", audio, photo);

    if (audio) {
      console.log("AUDIO ID", extractID(audio));
      const fileId = extractID(audio);
      console.log(fileId);
      if (fileId) {
        setAudioUrl(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${key}`); //api + react player; not best practice for stream; prohibits many calls of this
        //setAudioUrl(`https://drive.google.com/uc?export=download&id=${fileId}`); //download + react player; file too large to scan for viruses -> doesn't run
        //setAudioUrl(`https://drive.google.com/file/d/${fileId}/preview`); //iframe embedded google drive file; not customizable 
      }
    }

    if (photo) {
      console.log("PHOTO ID", extractID(photo));
      const fileId = extractID(photo);
      if (fileId) {
        setPhotoUrl(`https://drive.google.com/thumbnail?id=${fileId}`);
      }
    } 
  }, [audio, photo]); 


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Now Playing - {week}</h1>

      {photoUrl && (
        <img src={photoUrl} alt="Show Cover" className="w-64 h-64 mt-4 rounded-lg" />
      )}

      {audioUrl ? ( <div className="mt-4">
          <ReactPlayer url={audioUrl} controls width="100%" height="50px" />
        </div>
      ) : (
        <p>No audio available</p>
      )}

    </div>
  );
}

/* (
        <div className="mt-4">
          <ReactPlayer url={audioUrl} controls width="100%" height="50px" />
        </div>
      ) 
    
        <iframe
          src={audioUrl}
          width="100%"
          height="80"
          allow="autoplay"
          className="mt-4"
        />
        
*/
//     {photo && <img src={decodeURIComponent(photo)} alt="Show Cover" className="w-64 h-64 mt-4 rounded-lg" />}


