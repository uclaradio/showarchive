// // pages/[quarter].js
// import Link from "next/link";
// import { dbAdmin } from "../lib/firebaseAdmin";
// import styles      from "../styles/QuarterPage.module.css";
// import GradientBackground from "../components/GradientBackground";
// import { useState, useEffect } from "react";
// import { initializeApp, getApps } from "firebase/app";
// import firebaseConfig from "../lib/firebaseClient";      // your client‐SDK config
// import { getStorage, ref, getDownloadURL } from "firebase/storage";

// export async function getStaticPaths() {
//   const collections = await dbAdmin.listCollections();
//   const paths       = collections.map((col) => ({
//     params: { quarter: col.id },
//   }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   const { quarter } = params;
//   const snap        = await dbAdmin.collection(quarter).get();

//   // flatten into an array of show-objects
//   const shows = snap.docs.map((doc) => ({
//     id:   doc.id,
//     ...doc.data(),
//   }));

//   return {
//     props: { shows, quarter },
//     revalidate: 60,
//   };
// }

// export default function QuarterPage({ shows, quarter }) {
//   const groupedShows = shows.reduce((acc, show) => {
//     const category = show.category?.trim() || "Uncategorized";
//     acc[category] = acc[category] || [];
//     acc[category].push(show);
//     return acc;
//   }, {});

//   const getSeasonTitle = (q) => {
//     const [season, year] = q.split(" ");
//     return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year} Shows`;
//   };

//   const carouselRefs = {};
//   const scrollBy     = (cat, amt) =>
//     carouselRefs[cat]?.scrollBy({ left: amt, behavior: "smooth" });

//   return (
//     <GradientBackground>
//       <header className={styles.header}>
//         <h1 className={styles.headerTitle}>
//           {getSeasonTitle(quarter)}
//         </h1>
//       </header>

//       {Object.entries(groupedShows).map(([category, shows]) => (
//         <div key={category} className={styles.categorySection}>
//           <h2 className={styles.categoryHeading}>{category}</h2>
//           <div className={styles.carouselWrapper}>
//             <button onClick={() => scrollBy(category, -300)}>←</button>
//             <div
//               className={styles.carousel}
//               ref={(el) => (carouselRefs[category] = el)}
//             >
//               {shows.map((show) => (
//                 <Link
//                   key={show.id}
//                   // href={`/${quarter}/${encodeURIComponent(show.name)}`}
//                   href={`/${quarter}/${show.id}`}
//                   className={styles.card}
//                 >
//             <img
//               src={ref(storage, `public/${quarter}/${show.id}.png`)}
//               alt={show.name}
//               className={styles.image}
//               onError={(e) => {
//                 // if the PNG doesn’t exist, fall back to your old default
//                 e.currentTarget.onerror = null
//                 e.currentTarget.src = "/radioblue.jpg"
//               }}
//             />
//                   <div className={styles.showName}>{show.name}</div>
//                 </Link>
//               ))}
//             </div>
//             <button onClick={() => scrollBy(category, +300)}>→</button>
//           </div>
//         </div>
//       ))}
//     </GradientBackground>
//   );
// }

// pages/[quarter].js
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { dbAdmin } from "../lib/firebaseAdmin";
import styles from "../styles/QuarterPage.module.css";
import GradientBackground from "../components/GradientBackground";

// Firebase client SDK imports
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
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
  // State to hold the resolved image URLs
  const [imageUrls, setImageUrls] = useState({});
  const carouselRefs = useRef({});

  // On mount, init Firebase and fetch all image URLs
  useEffect(() => {
    if (!getApps().length) initializeApp(firebaseConfig);
    const storage = getStorage();

    shows.forEach((show) => {
      const imgRef = storageRef(storage, `/public/${quarter}/${show.id}.png`);
      getDownloadURL(imgRef)
        .then((url) => {
          setImageUrls((prev) => ({ ...prev, [show.id]: url }));
        })
        .catch(() => {
          // no-op on missing file; we'll fall back below
        });
    });
  }, [quarter, shows]);

  // Helper to scroll the carousels
  const scrollBy = (cat, amt) =>
    carouselRefs.current[cat]?.scrollBy({ left: amt, behavior: "smooth" });

  // Group shows by category
  const groupedShows = shows.reduce((acc, show) => {
    const cat = show.category?.trim() || "Uncategorized";
    ;(acc[cat] = acc[cat] || []).push(show);
    return acc;
  }, {});

  // Format header title
  const getSeasonTitle = (q) => {
    const [season, year] = q.split(" ");
    return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year} Shows`;
  };

  return (
    <GradientBackground>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>{getSeasonTitle(quarter)}</h1>
      </header>

      {Object.entries(groupedShows).map(([category, shows]) => (
        <div key={category} className={styles.categorySection}>
          <h2 className={styles.categoryHeading}>{category}</h2>
          <div className={styles.carouselWrapper}>
            <button onClick={() => scrollBy(category, -300)}>←</button>
            <div
              className={styles.carousel}
              ref={(el) =>
                (carouselRefs.current[category] = el)
              }
            >
              {shows.map((show) => (
                <Link
                  key={show.id}
                  href={`/${quarter}/${show.id}`}
                  className={styles.card}
                >
                  <img
                    src={imageUrls[show.id] || "/radioblue.jpg"}
                    alt={show.name}
                    className={styles.image}
                  />
                  <div className={styles.showName}>{show.name}</div>
                </Link>
              ))}
            </div>
            <button onClick={() => scrollBy(category, +300)}>→</button>
          </div>
        </div>
      ))}
    </GradientBackground>
  );
}