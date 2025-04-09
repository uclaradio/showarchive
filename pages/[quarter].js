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
//         const parsed = Papa.parse(csv, { header: true }).data;


//         const showMap = {};
//         parsed.forEach(row => {
//           if (row.quarter !== quarter) return;
  
//           showMap[row.showName] = {
//             showName: row.showName,
//             djs: [row.dj1, row.dj2, row.dj3].filter(Boolean),
//             description: row.description    
//           };
//         });


//         // const filteredShows = parsed
//         //   .filter(row => row.quarter === quarter)
//         //   .map(row => ({
//         //     showName: row.showName,
//         //     djs: [row.dj1, row.dj2, row.dj3].filter(Boolean), // Filter out empty values
//         //   }));

        
//         // setShows([...new Set(filteredShows)]); // Unique show names

//         setShows(showMap);
//       });
//   }, [quarter]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Select a Show in {quarter}</h1>
//       {shows.length > 0 ? (
//         shows.map(show => (
//           <Link key={show} href={`/${quarter}/${encodeURIComponent(show)}`}>
//             <div className="p-3 mt-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
//               {show}
//             </div>
//           </Link>
//         ))
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Papa from "papaparse";

export default function QuarterPage() {
  const [shows, setShows] = useState([]);
  const router = useRouter();
  const { quarter } = router.query;

  useEffect(() => {
    if (!quarter) return;

    fetch("/shows.csv")
      .then(response => response.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;

        const showMap = {};
        parsed.forEach(row => {
          if (row.quarter.trim() !== quarter.trim()) return;  // Fix quarter comparison

          showMap[row.showName] = {
            showName: row.showName,
            djs: [row.DJ1, row.DJ2, row.DJ3].filter(dj => dj && dj.trim()), // Ensure no empty values
            description: row.description || "No description available",
          };
        });

        setShows(Object.values(showMap)); // Convert object to array
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [quarter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Select a Show in {quarter}</h1>
      {shows.length > 0 ? (
        shows.map(show => (
<<<<<<< Updated upstream
          <Link 
            key={show} 
            href={`/${quarter}/${encodeURIComponent(show)}`}
            target="_blank"
          >
=======
          <Link key={show.showName} href={`/${quarter}/${encodeURIComponent(show.showName)}`}>
>>>>>>> Stashed changes
            <div className="p-3 mt-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
              <p className="font-bold">{show.showName}</p>
              {/* {show.djs.length > 0 && <p className="text-sm text-gray-600">DJs: {show.djs.join(", ")}</p>}
              <p className="text-sm text-gray-500">{show.description}</p> */}
            </div>
          </Link>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
