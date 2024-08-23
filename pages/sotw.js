// import Head from 'next/head';
// import styles from '../styles/Home.module.css';
// import Image from 'next/image'

// export default function SOTWpage() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>SOTW page</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main>
//         <h1 className={styles.title}>
//           <a href="https://uclaradio.com/">COMEDY HOUR</a> Show Archive
//         </h1>

//         <p className={styles.description}>
//           Your favorite shows on demand.
//         </p>

//         <div className={styles.grid}>
//           <a href="https://drive.google.com/file/d/1cHFCsxltfzGw8g6YHcz_6nrUCxqXFQRb/view?usp=sharing" className={styles.card}>
//             <h3>funny stuff &rarr;</h3>
//             <p>Play</p>
//           </a>


          
//         </div>
//       </main>

//       <footer>
//         <a
//           href="https://uclaradio.com/"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img src="/radioblack.png" alt="Vercel" className={styles.logo} />
//         </a>
//       </footer>

//       <style jsx>{`
//         main {
//           padding: 5rem 0;
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//         }
//         footer {
//           width: 100%;
//           height: 100px;
//           border-top: .5px solid #eaeaea;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }
//         footer img {
//           margin-left: .5rem;
//         }
//         footer a {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           text-decoration: none;
//           color: inherit;
//         }
//         code {
//           background: #fafafa;
//           border-radius: 5px;
//           padding: 0.75rem;
//           font-size: 1.1rem;
//           font-family:
//             Menlo,
//             Monaco,
//             Lucida Console,
//             Liberation Mono,
//             DejaVu Sans Mono,
//             Bitstream Vera Sans Mono,
//             Courier New,
//             monospace;
//         }
//       `}</style>

//       <style jsx global>{`
//         html,
//         body {
//           padding: 0;
//           margin: 0;
//           font-family:
//             -apple-system,
//             BlinkMacSystemFont,
//             Segoe UI,
//             Roboto,
//             Oxygen,
//             Ubuntu,
//             Cantarell,
//             Fira Sans,
//             Droid Sans,
//             Helvetica Neue,
//             sans-serif;
//         }
//         * {
//           box-sizing: border-box;
//         }
//       `}</style>
//     </div>
//   );
// }


import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

export default function SOTWpage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SOTW page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          <a href="https://uclaradio.com/">COMEDY HOUR</a> Show Archive
        </h1>

        <p className={styles.description}>
          Your favorite shows on demand.
        </p>

        <div className={styles.grid}>
          <a href="https://drive.google.com/file/d/1cHFCsxltfzGw8g6YHcz_6nrUCxqXFQRb/view?usp=sharing" className={styles.card}>
            <h3>funny stuff &rarr;</h3>
            <p>Play</p>
          </a>
        </div>
      </main>

      <footer>
        <a
          href="https://uclaradio.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/radioblack.png" alt="Vercel" className={styles.logo} width={72} height={16} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 0.5px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}