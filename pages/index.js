import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image'
import Link from 'next/link';


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Rounded rectangle with zero radius (specified as a number)
ctx.strokeStyle = "red";
ctx.beginPath();
ctx.roundRect(10, 20, 150, 100, 0);
ctx.stroke();

// Rounded rectangle with 40px radius (single element list)
ctx.strokeStyle = "blue";
ctx.beginPath();
ctx.roundRect(10, 20, 150, 100, [40]);
ctx.stroke();

// Rounded rectangle with 2 different radii
ctx.strokeStyle = "orange";
ctx.beginPath();
ctx.roundRect(10, 150, 150, 100, [10, 40]);
ctx.stroke();

// Rounded rectangle with four different radii
ctx.strokeStyle = "green";
ctx.beginPath();
ctx.roundRect(400, 20, 200, 100, [0, 30, 50, 60]);
ctx.stroke();

// Same rectangle drawn backwards
ctx.strokeStyle = "magenta";
ctx.beginPath();
ctx.roundRect(400, 150, -200, 100, [0, 30, 50, 60]);
ctx.stroke();



export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <canvas id="canvas" width="700" height="300"></canvas>

        <h1 className={styles.title}>
          <a href="https://uclaradio.com/">UCLA RADIO</a> Show Archive
        </h1>

        <p className={styles.description}>
          Your favorite shows on demand.
        </p>

        <div className={styles.grid}>
          <a href="/sotw" className={styles.card}> 
            <h3>Show of the Week &rarr;</h3>


            <Image
              src="/feyd.jpg"
              width={100}
              height={100}
              alt="show poster"
            />


          </a>
    
          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Show of the Quarter &rarr;</h3>
            <p>Tea Time ;)</p>


            <Image
              src="/flower.jpg"
              width={100}
              height={300}
              alt="show poster"
            />
          </a>


          
        </div>
      </main>

      <footer>
        <a
          href="https://uclaradio.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/radioblack.png" alt="Vercel" className={styles.logo} />
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
          border-top: .5px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: .5rem;
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
