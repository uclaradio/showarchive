import { useEffect, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";
import "tailwindcss/tailwind.css";

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
    <div className="relative vw-[100%] h-[1635px] bg-gradient-to-br from-[#0d0e23] via-[#1e1e1e] to-[#0d0e23] text-white mx-auto">
      <img className="w-full" src="/landingPageBackground.png" alt="Background" />
      {/* Header */}
      <div className="absolute top-[111px] left-[700px] inline-flex items-center justify-center gap-2.5 p-2.5">
        <h1 className="text-[#e94393] font-bold text-[60px] leading-none whitespace-nowrap">
          Select Your Quarter
        </h1>
      </div>

    <div className="absolute top-[313px] left-[150px] flex flex-col gap-[84px] w-[342px]">
      {quarters.length > 0 ? (
        quarters.map(q => (
          <Link key={q} href={`/${q}`}>
              <div className="text-white font-semibold text-[40px] tracking-[0.5px] hover:text-[#e94393] cursor-pointer transition-colors">
              {q}
            </div>
          </Link>
        ))
      ) : (
        <p>Loading...</p>
      )}
      </div>
    </div>
  );
}