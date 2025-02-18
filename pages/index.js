import { useEffect, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";

export default function Home() {
  const [quarters, setQuarters] = useState([]);

  useEffect(() => {
    fetch("/shows.csv")
      .then(response => response.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true }).data;
        const uniqueQuarters = [...new Set(parsed.map(row => row.quarter))];
        setQuarters(uniqueQuarters);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Select a Quarter</h1>
      {quarters.length > 0 ? (
        quarters.map(q => (
          <Link key={q} href={`/${q}`}>
            <div className="p-3 mt-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
              {q}
            </div>
          </Link>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
