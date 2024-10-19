
// import Head from 'next/head';
// import Link from 'next/link';
// import styles from '../styles/Home.module.css';

// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>UCLA Radio Show Archive</title>
//         <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           <a href="https://uclaradio.com/">UCLA RADIO</a> Show Archive
//         </h1>
//         <p className={styles.description}>Your favorite shows, on demand.</p>

//         <div className={styles.archiveContainer}>
//           <div className={styles.quarter}>
//             <h2>Spring '23</h2>
//             <ul>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 1' } }}>
//                   Week 1
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 2' } }}>
//                   Week 2
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 3' } }}>
//                   Week 3
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 4' } }}>
//                   Week 4
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 5' } }}>
//                   Week 5
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 6' } }}>
//                   Week 6
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 7' } }}>
//                   Week 7
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 8' } }}>
//                   Week 8
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 9' } }}>
//                   Week 9
//                 </Link>
//               </li>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 10' } }}>
//                   Week 10
//                 </Link>
//               </li>
//             </ul>
//             <p><a href="#">Show of the Quarter</a></p>
//           </div>

//           <div className={styles.quarter}>
//             <h2>Fall '23</h2>
//             <ul>
//               <li>
//                 <Link href={{ pathname: '/nowplaying', query: { show: 'Week 1' } }}>
//                   Week 1
//                 </Link>
//               </li>
//               {/* Add other weeks similarly */}
//             </ul>
//             <p><a href="#">Show of the Quarter</a></p>
//           </div>

//           {/* Repeat for Winter '24 and Spring '24 as necessary */}
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a href="https://uclaradio.com/" target="_blank" rel="noopener noreferrer">
//           UCLA Radio
//         </a>
//       </footer>

//       <style jsx>{`
//         .main {
//           padding: 2rem 0;
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//         }

//         .archiveContainer {
//           display: flex;
//           justify-content: space-around;
//           width: 100%;
//           max-width: 1200px;
//           margin-top: 2rem;
//         }

//         .quarter {
//           background-color: #ffccf2;
//           border-radius: 20px;
//           padding: 20px;
//           width: 200px;
//           text-align: center;
//         }

//         .quarter h2 {
//           margin-bottom: 1rem;
//         }

//         .quarter ul {
//           list-style: none;
//           padding: 0;
//         }

//         .quarter li {
//           margin: 0.5rem 0;
//         }

//         a {
//           color: black;
//           text-decoration: none;
//           font-weight: bold;
//         }

//         a:hover {
//           text-decoration: underline;
//         }

//         footer {
//           padding: 1rem;
//           text-align: center;
//           border-top: 1px solid #eaeaea;
//         }
//       `}</style>

//       <style jsx global>{`
//         html, body {
//           font-family: 'Space Grotesk', sans-serif;
//           margin: 0;
//           padding: 0;
//         }

//         * {
//           box-sizing: border-box;
//         }
//       `}</style>
//     </div>
//   );
// }


import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';  // Import Image component
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>UCLA Radio Show Archive</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Logo in the top-left corner as a Home button */}
      <header style={{ position: 'absolute', top: '-25px', left: '15px' }}>
        <Link href="/">
          <Image src="/logo.png" alt="UCLA Radio Logo" width={300} height={150} style={{ cursor: 'pointer' }} />
        </Link>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://uclaradio.com/">UCLA RADIO</a> Show Archive
        </h1>
        <p className={styles.description}>Your favorite shows, on demand.</p>

        <div className={styles.archiveContainer}>
          <div className={styles.quarter}>
            <h2>Spring '24</h2>
            <ul>
              <li>
                <Link href={{ pathname: '/nowplaying', query: { show: 'Week 1' } }}>
                  Week 1
                </Link>
              </li>
              <li>
                <Link href={{ pathname: '/nowplaying', query: { show: 'Week 2' } }}>
                  Week 2
                </Link>
              </li>
              <li>
                <Link href={{ pathname: '/nowplaying', query: { show: 'Week 3' } }}>
                  Week 3
                </Link>
              </li>
              {/* Add more weeks here */}
            </ul>
            <p><a href="#">Show of the Quarter</a></p>
          </div>

          {/* Repeat for other seasons */}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://uclaradio.com/" target="_blank" rel="noopener noreferrer">
          UCLA Radio
        </a>
      </footer>

      <style jsx>{`
        .main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #F2CAED; /* Pink background */
        }

        .archiveContainer {
          display: flex;
          justify-content: space-around;
          width: 100%;
          max-width: 1200px;
          margin-top: 2rem;
        }

        .quarter {
          background-color: #ffccf2;
          border-radius: 20px;
          padding: 20px;
          width: 200px;
          text-align: center;
        }

        .quarter h2 {
          margin-bottom: 1rem;
        }

        .quarter ul {
          list-style: none;
          padding: 0;
        }

        .quarter li {
          margin: 0.5rem 0;
        }

        a {
          color: black;
          text-decoration: none;
          font-weight: bold;
        }

        a:hover {
          text-decoration: underline;
        }

        footer {
          padding: 1rem;
          text-align: center;
          border-top: 1px solid #eaeaea;
        }
      `}</style>

      <style jsx global>{`
        html, body {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #F2CAED; /* Pink background */
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
