import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { query } = context;
  const { week, audio, photo } = query;

  return {
    props: { week, audio, photo }, // Pass as props
  };
}

export default function NowPlaying({ week, audio, photo }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Now Playing - Week {week}</h1>
      {photo && <img src={decodeURIComponent(photo)} alt="Show Cover" className="w-64 h-64 mt-4 rounded-lg" />}
      {audio ? (
        <audio controls className="mt-4 w-full">
          <source src={decodeURIComponent(audio)} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No audio available</p>
      )}
    </div>
  );
}
