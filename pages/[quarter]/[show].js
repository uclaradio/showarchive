// pages/[quarter]/[show].js
import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import firebaseConfig from "../../lib/firebaseClient";      // your client‐SDK config
import { dbAdmin }        from "../../lib/firebaseAdmin";   // your admin‐SDK
import GradientBackground from "../../components/GradientBackground";

export async function getStaticPaths() {
  // 1) list all quarters
  const quarters = await dbAdmin.listCollections().then(cols => cols.map(c => c.id));

  // 2) for each quarter, list all show doc IDs
  const paths = [];
  for (const q of quarters) {
    const docs = await dbAdmin.collection(q).listDocuments();
    docs.forEach(docRef => {
      paths.push({ params: { quarter: q, show: docRef.id } });
    });
  }

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { quarter, show } = params;
  const docSnap            = await dbAdmin.collection(quarter).doc(show).get();

  if (!docSnap.exists) {
    return { notFound: true };
  }

  return {
    props: {
      quarter,
      showId:   show,
      showData: docSnap.data(),  // e.g. { name: "DFG Live!", DJ1: "Days for Girls", … }
    },
    revalidate: 60,
  };
}

export default function ShowPage({ quarter, showId, showData }) {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    // init Firebase client if not already
    if (!getApps().length) initializeApp(firebaseConfig);

    const storage = getStorage();
    const mp3Ref  = ref(storage, `public/${quarter}/${showId}.mp3`);

    getDownloadURL(mp3Ref)
      .then(url => setAudioUrl(url))
      .catch((err) => {
        console.error("Could not load audio URL:", err);
      });
  }, [quarter, showId]);

  return (
    <GradientBackground>
      <div className="p-8">
        <h1 className="text-5xl font-bold text-pink-400 mb-4">
          {showData.name}
        </h1>
        {/* any other metadata: DJ1, category, etc… */}
        <p className="mb-6 text-white">
          Hosted by <strong>{showData.DJ1}</strong>
        </p>

        {audioUrl ? (
          <audio controls src={audioUrl} className="w-full outline-none" />
        ) : (
          <p className="text-gray-400">Loading audio…</p>
        )}
      </div>
    </GradientBackground>
  );
}