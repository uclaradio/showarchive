// // pages/index.js
// import Link from "next/link";
// import Image from "next/image";
// import { dbAdmin } from "../lib/firebaseAdmin";
// import "tailwindcss/tailwind.css";
// import GradientBackground from "../components/GradientBackground";

// export async function getStaticProps() {
//   const collections = await dbAdmin.listCollections();
//   const quarters = collections.map((col) => col.id);

//   return {
//     props: { quarters },
//     revalidate: 60,
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
// import Link from "next/link";
// import Image from "next/image";
// import { dbAdmin } from "../lib/firebaseAdmin";
// import "tailwindcss/tailwind.css";
// import GradientBackground from "../components/GradientBackground";

// export async function getStaticProps() {
//   const collections = await dbAdmin.listCollections();
//   const quarters = collections.map((col) => col.id);

//   return {
//     props: { quarters },
//     revalidate: 60,
//   };
// }

// export default function Home({ quarters }) {
//   return (
//     <GradientBackground>
//       <div className="relative flex flex-col items-center pt-32 px-4">
//         {/* Figma-style header */}
//         <div className="flex items-center space-x-4">
//           <Image
//             src="/radiopink.png"
//             alt="UCLA Radio Logo"
//             width={195}
//             height={159}
//           />
//           <h1 className="text-8xl font-bold text-[#e94393]">
//             Show Archive
//           </h1>
//         </div>

//         {/* ↓ tighter spacing here ↓ */}
//         <p className="-mt-15 text-white text-2xl leading-tight">
//           Missed a show? Find it here!{" "}
//           <span className="text-[#e94393] inline-block transform translate-y-[-1px]">
//             ↓
//           </span>
//         </p>

//         {/* ↓ quarters all on one line ↓ */}
//         <div className="mt-8 flex space-x-12">
//           {quarters.length > 0 ? (
//             quarters.map((q) => (
//               <Link legacyBehavior key={q} href={`/${q}`}>
//                 <a className="text-white font-semibold text-4xl tracking-wider hover:text-[#e94393] transition-colors">
//                   {q}
//                 </a>
//               </Link>
//             ))
//           ) : (
//             <p className="text-white">Loading...</p>
//           )}
//         </div>
//       </div>
//   );
// }


// pages/index.js
import Link from "next/link";
import Image from "next/image";
import { dbAdmin } from "../lib/firebaseAdmin";
import GradientBackground from "../components/GradientBackground";
import styles from "../styles/Home.module.css";

export async function getStaticProps() {
  const collections = await dbAdmin.listCollections();
  const quarters = collections.map((col) => col.id);

  return {
    props: { quarters },
    revalidate: 60,
  };
}

// Format quarter title similar to how it's done in [quarter].js
const formatQuarterTitle = (quarter) => {
  const [season, year] = quarter.split(" ");
  return `${
    // capitalize the first char of "everything but the last two"
    season.charAt(0).toUpperCase() +
    season.slice(1, -2)
  } ${
    // the final two characters
    season.slice(-2)
  }`;
};

export default function Home({ quarters }) {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <div className={styles.logoContainer}>
          <Image
            src="/radiopink.png"
            alt="UCLA Radio Logo"
            width={200}
            height={160}
            className={styles.logoImage}
          />
        </div>
        
        <h1 className={styles.mainTitle}>Show Archive</h1>
        
        <p className={styles.subtitle}>
          Missed a show? Find it here! <span className={styles.arrow}>↓</span>
        </p>
      </div>

      <div className={styles.quartersContainer}>
        {quarters.length > 0 ? (
          quarters.map((quarter) => (
            <Link 
              key={quarter} 
              href={`/${quarter}`}
              className={styles.quarterLink}
            >
              <div className={styles.quarterCard}>
                <span>{formatQuarterTitle(quarter)}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulse}></div>
            <p className={styles.loadingText}>Loading quarters...</p>
          </div>
        )}
      </div>
    </div>
  );
}