// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { dbAdmin } from "../lib/firebaseAdmin";
// import styles from "../styles/QuarterPage.module.css";
// import GradientBackground from "../components/GradientBackground";

// // Firebase client SDK imports
// import { initializeApp, getApps } from "firebase/app";
// import {
//   getStorage,
//   ref as storageRef,
//   getDownloadURL,
// } from "firebase/storage";
// import firebaseConfig from "../lib/firebaseClient";

// export async function getStaticPaths() {
//   const collections = await dbAdmin.listCollections();
//   const paths = collections.map((col) => ({
//     params: { quarter: col.id },
//   }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }) {
//   const { quarter } = params;
//   const snap = await dbAdmin.collection(quarter).get();

//   const shows = snap.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   return {
//     props: { shows, quarter },
//     revalidate: 60,
//   };
// }

// export default function QuarterPage({ shows, quarter }) {
//   // State to hold the resolved image URLs
//   const [imageUrls, setImageUrls] = useState({});
//   const carouselRefs = useRef({});
  
//   // On mount, init Firebase and fetch all image URLs
//   useEffect(() => {
//     if (!getApps().length) initializeApp(firebaseConfig);
//     const storage = getStorage();

//     shows.forEach((show) => {
//       const imgRef = storageRef(storage, `/public/${quarter}/${show.id}.png`);
//       getDownloadURL(imgRef)
//         .then((url) => {
//           setImageUrls((prev) => ({ ...prev, [show.id]: url }));
//         })
//         .catch(() => {
//           // no-op on missing file; we'll fall back below
//         });
//     });
//   }, [quarter, shows]);

//   // Helper to scroll the carousels
//   const scrollBy = (cat, amt) =>
//     carouselRefs.current[cat]?.scrollBy({ left: amt, behavior: "smooth" });

//   // Group shows by category
//   const groupedShows = shows.reduce((acc, show) => {
//     const cat = show.category?.trim() || "Shows of the Week";
//     ;(acc[cat] = acc[cat] || []).push(show);
//     return acc;
//   }, {});

//   // Format header title
//   const getSeasonTitle = (q) => {
//     const [season, year] = q.split(" ");
//     return `${
//       // capitalize the first char of "everything but the last two"
//       season.charAt(0).toUpperCase() +
//       season.slice(1, -2)
//     } ${
//       // the final two characters
//       season.slice(-2)
//     }`;
//   };

//   return (
    
//       <div className={styles.pageContainer}>
//         <header className={styles.header}>
//           <h1 className={styles.headerTitle}>{getSeasonTitle(quarter)}</h1>
//         </header>

//         <div className={styles.contentContainer}>
//           {Object.entries(groupedShows).map(([category, shows]) => (
//             <div key={category} className={styles.categorySection}>
//               <h2 className={styles.categoryHeading}>{category}</h2>
//               <div className={styles.carouselWrapper}>
//                 <button 
//                   className={styles.navButton}
//                   onClick={() => scrollBy(category, -300)}
//                   aria-label="Scroll left"
//                 >
//                   ←
//                 </button>
//                 <div
//                   className={styles.carousel}
//                   ref={(el) => (carouselRefs.current[category] = el)}
//                 >
//                   {shows.map((show) => (
//                     <Link
//                       key={show.id}
//                       href={`/${quarter}/${show.id}`}
//                       className={styles.card}
//                     >
//                       <div className={styles.imageContainer}>
//                         <img
//                           src={imageUrls[show.id] || "/radioblue.jpg"}
//                           alt={show.name}
//                           className={styles.image}
//                           loading="lazy"
//                         />
//                       </div>
//                       <div className={styles.showName}>{show.name}</div>
//                     </Link>
//                   ))}
//                 </div>
//                 <button 
//                   className={styles.navButton}
//                   onClick={() => scrollBy(category, 300)}
//                   aria-label="Scroll right"
//                 >
//                   →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
    
//   );
// }

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
    const cat = show.category?.trim() || "Shows of the Week";
    ;(acc[cat] = acc[cat] || []).push(show);
    return acc;
  }, {});

  // Format header title
  const getSeasonTitle = (q) => {
    const [season, year] = q.split(" ");
    return `${
      // capitalize the first char of "everything but the last two"
      season.charAt(0).toUpperCase() +
      season.slice(1, -2)
    } ${
      // the final two characters
      season.slice(-2)
    }`;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.backButtonContainer}>
        <Link href="/" className={styles.backButton}>
          <span className={styles.backArrow}>←</span>
          <span>Back</span>
        </Link>
      </div>
      
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>{getSeasonTitle(quarter)}</h1>
          <div className={styles.headerDivider}></div>
        </div>
      </header>

      <div className={styles.contentContainer}>
        {Object.entries(groupedShows).map(([category, shows]) => (
          <div key={category} className={styles.categorySection}>
            <h2 className={styles.categoryHeading}>{category}</h2>
            <div className={styles.carouselWrapper}>
              <button 
                className={styles.navButton}
                onClick={() => scrollBy(category, -600)}
                aria-label="Scroll left"
              >
                <span className={styles.arrowIcon}>←</span>
              </button>
              <div
                className={styles.carousel}
                ref={(el) => (carouselRefs.current[category] = el)}
              >
                {shows.map((show) => (
                  <Link
                    key={show.id}
                    href={`/${quarter}/${show.id}`}
                    className={styles.card}
                  >
                    <div className={styles.imageContainer}>
                      <img
                        src={imageUrls[show.id] || "/radioblue.jpg"}
                        alt={show.name}
                        className={styles.image}
                        loading="lazy"
                      />
                      <div className={styles.imageOverlay}></div>
                    </div>
                    <div className={styles.showName}>{show.name}</div>
                  </Link>
                ))}
              </div>
              <button 
                className={styles.navButton}
                onClick={() => scrollBy(category, 600)}
                aria-label="Scroll right"
              >
                <span className={styles.arrowIcon}>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {Object.keys(groupedShows).length === 0 && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingPulse}></div>
          <p className={styles.loadingText}>Loading shows...</p>
        </div>
      )}
    </div>
  );
}