// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import Papa from "papaparse";

// export default function ShowPage() {
//   const [showData, setShowData] = useState(null);
//   const router = useRouter();
//   const { quarter, show } = router.query;

//   useEffect(() => {
//     if (!quarter || !show) return;

//     fetch("/shows.csv")
//       .then(response => response.text())
//       .then(csv => {
//         const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;

//         // Find the specific show by name and quarter
//         const matchedShow = parsed.find(
//           row => row.quarter.trim() === quarter.trim() && row.showName.trim() === decodeURIComponent(show).trim()
//         );

//         if (matchedShow) {
//           setShowData({
//             showName: matchedShow.showName,
//             djs: [matchedShow.DJ1, matchedShow.DJ2, matchedShow.DJ3].filter(dj => dj && dj.trim()), // Filter empty DJ fields
//             description: matchedShow.description || "No description available",
//           });
//         }
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, [quarter, show]);

//   return (
//     <div className="p-6">
//       <Link href={`/${quarter}`}>
//         <div className="text-blue-500 hover:underline cursor-pointer mb-4">← Back to {quarter}</div>
//       </Link>

//       {showData ? (
//         <div>
//           <h1 className="text-3xl font-bold">{showData.showName}</h1>
//           {showData.djs.length > 0 && (
//             <p className="text-lg text-gray-700 mt-2">
//               <strong>DJs:</strong> {showData.djs.join(", ")}
//             </p>
//           )}
//           <p className="mt-4 text-gray-600">{showData.description}</p>
//         </div>
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

export default function ShowPage() {
  const [showData, setShowData] = useState(null);
  const router = useRouter();
  const { quarter, show } = router.query;

  useEffect(() => {
    if (!quarter || !show) return;

    fetch("/shows.csv")
      .then(response => response.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;

        // Find all episodes for this show
        const episodes = parsed
          .filter(row => row.quarter.trim() === quarter.trim() && row.showName.trim() === decodeURIComponent(show).trim())
          .map(row => ({
            week: row.week.trim(),
            audioFileLink: row.audioFileLink || null,
            coverFileLink: row.coverFileLink || null,
          }));

        // Group episodes by week
        const groupedEpisodes = {};
        episodes.forEach(episode => {
          if (!groupedEpisodes[episode.week]) {
            groupedEpisodes[episode.week] = [];
          }
          groupedEpisodes[episode.week].push(episode);
        });

        setShowData({
          showName: decodeURIComponent(show),
          episodes: groupedEpisodes,
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [quarter, show]);

  return (
    <div className="p-6">
      <Link href={`/${quarter}`}>
        <div className="text-blue-500 hover:underline cursor-pointer mb-4">← Back to {quarter}</div>
      </Link>

      {showData ? (
        <div>
          <h1 className="text-3xl font-bold">{showData.showName}</h1>

          <h2 className="text-2xl mt-4 font-semibold">Episodes:</h2>
          {Object.entries(showData.episodes).map(([week, episodes]) => (
            <div key={week} className="mt-4 p-3 bg-gray-200 rounded">
              <h3 className="text-xl font-semibold">Week {week}</h3>
              {episodes.map((ep, index) => (
                <div key={index} className="mt-2">
                  {ep.coverFileLink && (
                    <img src={ep.coverFileLink} alt="Cover Image" className="w-32 h-32 rounded-md" />
                  )}
                  {ep.audioFileLink ? (
                    <p>
                      🎵 <a href={ep.audioFileLink} className="text-blue-500 underline">Listen to Episode</a>
                    </p>
                  ) : (
                    <p className="text-gray-500">No audio available</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
