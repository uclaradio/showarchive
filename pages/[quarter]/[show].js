// "use client";

// import Image from 'next/image';
// import React from 'react';
// import GradientBackground from '../../components/GradientBackground';

// const UCLAListenPage = () => {
//   return (
//     <GradientBackground>
//       <div className="flex flex-col lg:flex-row items-start gap-12">
//         <div className="flex-shrink-0">
//           <Image
//             src="/ucla-radio-flyer.png"
//             alt="UCLA Radio Flyer"
//             width={300}
//             height={300}
//             className="border-2 border-white rounded-md"
//           />
//         </div>
//         <div className="flex-1">
//           <h1 className="text-5xl font-bold mb-4 text-pink-400">UCLA Radio Listens to Your Music!</h1>
//           <h2 className="text-2xl font-medium mb-4">Music Department</h2>
//           <div className="flex gap-3 mb-4">
//             <span className="bg-[#2f2a44] px-4 py-1 rounded-full text-sm font-medium">music</span>
//             <span className="bg-[#2f2a44] px-4 py-1 rounded-full text-sm font-medium">chatting</span>
//             <span className="bg-[#2f2a44] px-4 py-1 rounded-full text-sm font-medium">culture</span>
//           </div>
//           <p className="text-md leading-relaxed">
//             The UCLA Radio Music Department reviews and listens to real song submissions live on-air! Come listen for
//             some fresh new tunes picked out by yours truly! Send your music to{' '}
//             <a href="mailto:radio.music@media.ucla.edu" className="text-blue-300 underline">
//               radio.music@media.ucla.edu
//             </a>{' '}for consideration.<br />
//             Hosted on Tuesday from 7 to 8 PM.
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-16 text-left text-xl font-medium">
//         {Array.from({ length: 10 }, (_, i) => (
//           <div key={i} className="hover:text-white text-gray-300">
//             Week {i + 1}
//           </div>
//         ))}
//       </div>
//     </GradientBackground>
//   );
// };

// export default UCLAListenPage;

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