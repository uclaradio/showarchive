// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import Papa from "papaparse";

// export default function QuarterPage() {
//   const [shows, setShows] = useState([]);
//   const router = useRouter();
//   const { quarter } = router.query;

//   useEffect(() => {
//     if (!quarter) return;

//     fetch("/shows.csv")
//       .then(response => response.text())
//       .then(csv => {
//         const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;

//         const showMap = {};
//         parsed.forEach(row => {
//           if (row.quarter.trim() !== quarter.trim()) return;  // Fix quarter comparison

//           showMap[row.showName] = {
//             showName: row.showName,
//             djs: [row.DJ1, row.DJ2, row.DJ3].filter(dj => dj && dj.trim()), // Ensure no empty values
//             description: row.description || "No description available",
//           };
//         });

//         setShows(Object.values(showMap)); // Convert object to array
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, [quarter]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Select a Show in {quarter}</h1>
//       {shows.length > 0 ? (
//         shows.map(show => (
//           <Link key={show.showName} href={`/${quarter}/${encodeURIComponent(show.showName)}`}>
//             <div className="p-3 mt-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
//               <p className="font-bold">{show.showName}</p>
//               {/* {show.djs.length > 0 && <p className="text-sm text-gray-600">DJs: {show.djs.join(", ")}</p>}
//               <p className="text-sm text-gray-500">{show.description}</p> */}
//             </div>
//           </Link>
//         ))
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Papa from "papaparse";
import styles from "../styles/QuarterPage.module.css";

export default function QuarterPage() {
  const [groupedShows, setGroupedShows] = useState({});
  const carouselRefs = useRef({}); // Refs stored by category
  const router = useRouter();
  const { quarter } = router.query;

  useEffect(() => {
    if (!quarter) return;

    fetch("/shows.csv")
      .then((response) => response.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
        }).data;

        const filteredShows = parsed.filter(
          (row) => row.quarter.trim().toLowerCase() === quarter.trim().toLowerCase()
        );

        const categoryMap = {};
        filteredShows.forEach((row) => {
          const category = row.category?.trim() || "Uncategorized";
          const showName = row.showName?.trim();
          if (!categoryMap[category]) categoryMap[category] = {};

          categoryMap[category][showName] = {
            showName,
            image: row.coverFileLink || row.image || "",
          };
        });

        const grouped = {};
        for (const category in categoryMap) {
          grouped[category] = Object.values(categoryMap[category]);
        }

        setGroupedShows(grouped);
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, [quarter]);

  const getSeasonTitle = (q) => {
    const [season, year] = q.split(" ");
    return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year} Shows`;
  };

  const scrollLeft = (category) => {
    if (carouselRefs.current[category]) {
      carouselRefs.current[category].scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (category) => {
    if (carouselRefs.current[category]) {
      carouselRefs.current[category].scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          {quarter ? getSeasonTitle(quarter) : "Loading..."}
        </h1>
      </header>

      {Object.entries(groupedShows).map(([category, shows]) => (
        <div key={category} className={styles.categorySection}>
          <h2 className={styles.categoryHeading}>{category}</h2>
          <div className={styles.carouselWrapper}>
            <button className={styles.arrow} onClick={() => scrollLeft(category)}>
              ←
            </button>
            <div
              className={styles.carousel}
              ref={(el) => (carouselRefs.current[category] = el)}
            >
              {shows.map((show) => (
                <Link
                  key={show.showName}
                  href={`/${quarter}/${encodeURIComponent(show.showName)}`}
                  className={styles.card}
                >
                  <div className={styles.card}>
                    {show.image ? (
                      <img
                        src={show.image}
                        alt={show.showName}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.placeholder}>No Image</div>
                    )}
                    <div className={styles.showName}>{show.showName}</div>
                  </div>
                </Link>
              ))}
            </div>
            <button className={styles.arrow} onClick={() => scrollRight(category)}>
              →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
