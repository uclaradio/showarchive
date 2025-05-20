// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Papa from "papaparse";
// import "tailwindcss/tailwind.css";

// export default function Home() {
//   const [quarters, setQuarters] = useState([]);

//   useEffect(() => {
//     fetch("/shows.csv")
//       .then(response => response.text())
//       .then(csv => {
//         const parsed = Papa.parse(csv, { header: true }).data;
//         const uniqueQuarters = [...new Set(parsed.map(row => row.quarter))];
//         setQuarters(uniqueQuarters);
//       });
//   }, []);

//   return (
//     <div className="relative vw-[100%] h-[1635px] bg-gradient-to-br from-[#0d0e23] via-[#1e1e1e] to-[#0d0e23] text-white mx-auto">
//       <img className="w-full" src="/landingPageBackground.png" alt="Background" />
//       {/* Header */}
//       <div className="absolute top-[111px] left-[32%] inline-flex items-center justify-center gap-2.5 p-2.5">
//         <h1 className="text-[#e94393] font-bold text-[60px] leading-none whitespace-nowrap">
//           Select Your Quarter
//         </h1>
//       </div>

//     <div className="absolute top-[313px] left-[150px] flex flex-col gap-[84px] w-[342px]">
//       {quarters.length > 0 ? (
//         quarters.map(q => (
//           <Link key={q} href={`/${q}`}>
//               <div className="text-white font-semibold text-[40px] tracking-[0.5px] hover:text-[#e94393] cursor-pointer transition-colors">
//               {q}
//             </div>
//           </Link>
//         ))
//       ) : (
//         <p>Loading...</p>
//       )}
//       </div>
//     </div>
//   );
// }

// // pages/index.js
// import Link from "next/link";
// import { dbAdmin } from "../lib/firebaseAdmin";

// export async function getStaticProps() {
//   // listCollections() is only available on the Admin SDK
//   const collections = await dbAdmin.listCollections();
//   const quarters    = collections.map((col) => col.id);

//   return {
//     props: { quarters },
//     revalidate: 60, // optional: re-run every minute
//   };
// }

// export default function Home({ quarters }) {
//   return (
//     <div className="...">
//       {/* your existing header & background */}
//       <div className="absolute top-[313px] left-[150px] ...">
//         {quarters.map((q) => (
//           <Link key={q} href={`/${q}`}>
//             <div className="text-white ... hover:text-[#e94393]">
//               {q}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// pages/index.js
import Link from "next/link";
import { dbAdmin } from "../lib/firebaseAdmin";
import "tailwindcss/tailwind.css";
import GradientBackground from "../components/GradientBackground";

export async function getStaticProps() {
  // listCollections() is only available on the Admin SDK
  const collections = await dbAdmin.listCollections();
  const quarters    = collections.map((col) => col.id);

  return {
    props: { quarters },
    revalidate: 60, // optional: re-run every minute
  };
}

export default function Home({ quarters }) {
  return (
   <GradientBackground>
      {/* <img
        className="w-full"
        src="/landingPageBackground.png"
        alt="Background"
      /> */}

      {/* Header */}
      <div className="absolute top-[111px] left-[32%] inline-flex items-center justify-center gap-2.5 p-2.5">
        <h1 className="text-[#e94393] font-bold text-[60px] leading-none whitespace-nowrap">
          Select Your Quarter
        </h1>
      </div>

      {/* Quarter list */}
      <div className="absolute top-[313px] left-[150px] flex flex-col gap-[84px] w-[342px]">
        {quarters.length > 0 ? (
          quarters.map((q) => (
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
    </GradientBackground>
  );
}