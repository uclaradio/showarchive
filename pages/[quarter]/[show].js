import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Papa from "papaparse";

export async function getServerSideProps(context) {
  const { quarter, show } = context.params;
  
  const response = await fetch("http://localhost:3000/shows.csv");
  const csv = await response.text();
  const parsed = Papa.parse(csv, { header: true }).data;

  const episodes = parsed
    .filter(row => row.quarter === quarter && row.Subject === show)
    .map(row => ({ week: row.week, audioLink: row["audio link"], photoLink: row["photo link"] }));

  return { props: { quarter, show, episodes } };
}

export default function ShowPage({ quarter, show, episodes }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Select an Episode for {show}</h1>
      {episodes.length > 0 ? (
        episodes.map((ep, index) => (
          <Link
            key={index}
            href={`/${quarter}/${encodeURIComponent(show)}/${ep.week}?audio=${encodeURIComponent(ep.audioLink)}&photo=${encodeURIComponent(ep.photoLink)}`}
          >
            <div className="p-3 mt-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300">
              Week {ep.week}
            </div>
          </Link>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
