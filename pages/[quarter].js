// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import Papa from "papaparse";
// import styles from "../styles/QuarterPage.module.css";

// export default function QuarterPage() {
//   const [groupedShows, setGroupedShows] = useState({});
//   const carouselRefs = useRef({}); // Refs stored by category
//   const router = useRouter();
//   const { quarter } = router.query;

//   useEffect(() => {
//     if (!quarter) return;

//     fetch("/shows.csv")
//       .then((response) => response.text())
//       .then((csv) => {
//         const parsed = Papa.parse(csv, {
//           header: true,
//           skipEmptyLines: true,
//         }).data;

//         const filteredShows = parsed.filter(
//           (row) => row.quarter.trim().toLowerCase() === quarter.trim().toLowerCase()
//         );

//         const categoryMap = {};
//         filteredShows.forEach((row) => {
//           const category = row.category?.trim() || "Uncategorized";
//           const showName = row.showName?.trim();
//           if (!categoryMap[category]) categoryMap[category] = {};

//           categoryMap[category][showName] = {
//             showName,
//             image: row.coverFileLink || row.image || "",
//           };
//         });

//         const grouped = {};
//         for (const category in categoryMap) {
//           grouped[category] = Object.values(categoryMap[category]);
//         }

//         setGroupedShows(grouped);
//       })
//       .catch((error) => console.error("Error fetching CSV:", error));
//   }, [quarter]);

//   const getSeasonTitle = (q) => {
//     const [season, year] = q.split(" ");
//     return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year} Shows`;
//   };

//   const scrollLeft = (category) => {
//     if (carouselRefs.current[category]) {
//       carouselRefs.current[category].scrollBy({ left: -300, behavior: "smooth" });
//     }
//   };

//   const scrollRight = (category) => {
//     if (carouselRefs.current[category]) {
//       carouselRefs.current[category].scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <header className={styles.header}>
//         <h1 className={styles.headerTitle}>
//           {quarter ? getSeasonTitle(quarter) : "Loading..."}
//         </h1>
//       </header>

//       {Object.entries(groupedShows).map(([category, shows]) => (
//         <div key={category} className={styles.categorySection}>
//           <h2 className={styles.categoryHeading}>{category}</h2>
//           <div className={styles.carouselWrapper}>
//             <button className={styles.arrow} onClick={() => scrollLeft(category)}>
//               ←
//             </button>
//             <div
//               className={styles.carousel}
//               ref={(el) => (carouselRefs.current[category] = el)}
//             >
//               {shows.map((show) => (
//                 <Link
//                   key={show.showName}
//                   href={`/${quarter}/${encodeURIComponent(show.showName)}`}
//                   className={styles.card}
//                 >
//                   <div className={styles.card}>
//                     {show.image ? (
//                       <img
//                         src={show.image}
//                         alt={show.showName}
//                         className={styles.image}
//                       />
//                     ) : (
//                       <div className={styles.placeholder}>No Image</div>
//                     )}
//                     <div className={styles.showName}>{show.showName}</div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//             <button className={styles.arrow} onClick={() => scrollRight(category)}>
//               →
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// pages/[quarter].js
import Link from "next/link";
import { dbAdmin } from "../lib/firebaseAdmin";
import styles      from "../styles/QuarterPage.module.css";

export async function getStaticPaths() {
  const collections = await dbAdmin.listCollections();
  const paths       = collections.map((col) => ({
    params: { quarter: col.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { quarter } = params;
  const snap        = await dbAdmin.collection(quarter).get();

  // flatten into an array of show-objects
  const shows = snap.docs.map((doc) => ({
    id:   doc.id,
    ...doc.data(),
  }));

  return {
    props: { shows, quarter },
    revalidate: 60,
  };
}

export default function QuarterPage({ shows, quarter }) {
  // Group by category (just like you did before)
  const groupedShows = shows.reduce((acc, show) => {
    const category = show.category?.trim() || "Uncategorized";
    acc[category] = acc[category] || [];
    acc[category].push(show);
    return acc;
  }, {});

  const getSeasonTitle = (q) => {
    const [season, year] = q.split(" ");
    return `${season.charAt(0).toUpperCase()}${season.slice(1)} ${year} Shows`;
  };

  const carouselRefs = {};
  const scrollBy     = (cat, amt) =>
    carouselRefs[cat]?.scrollBy({ left: amt, behavior: "smooth" });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          {getSeasonTitle(quarter)}
        </h1>
      </header>

      {Object.entries(groupedShows).map(([category, shows]) => (
        <div key={category} className={styles.categorySection}>
          <h2 className={styles.categoryHeading}>{category}</h2>
          <div className={styles.carouselWrapper}>
            <button onClick={() => scrollBy(category, -300)}>←</button>
            <div
              className={styles.carousel}
              ref={(el) => (carouselRefs[category] = el)}
            >
              {shows.map((show) => (
                <Link
                  key={show.id}
                  // href={`/${quarter}/${encodeURIComponent(show.name)}`}
                  href={`/${quarter}/${show.id}`}
                  className={styles.card}
                >
                  {show.image ? (
                    <img
                      src={show.image}
                      alt={show.name}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.placeholder}>No Image</div>
                  )}
                  <div className={styles.showName}>{show.name}</div>
                </Link>
              ))}
            </div>
            <button onClick={() => scrollBy(category, +300)}>→</button>
          </div>
        </div>
      ))}
    </div>
  );
}