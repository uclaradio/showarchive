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
        const parsed = Papa.parse(csv, { header: true }).data;
        const filteredShows = parsed
          .filter(row => row.quarter === quarter)
          .map(row => row.Subject);
        
        setShows([...new Set(filteredShows)]); // Unique show names
      });
  }, [quarter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Select a Show in {quarter}</h1>
      {shows.length > 0 ? (
        shows.map(show => (
          <Link key={show} href={`/${quarter}/${encodeURIComponent(show)}`}>
            <div className="p-3 mt-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
              {show}
            </div>
          </Link>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
