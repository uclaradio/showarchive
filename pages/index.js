// import Head from 'next/head';
// import Link from 'next/link';
// import Image from 'next/image';
// import styles from '../styles/Home.module.css';
// import { AiOutlineHome } from 'react-icons/ai';


// export default function Home() {
//   const quarters = [
//     {
//       name: "Winter '24",
//       folder: 'winter24',
//     },
//     {
//       name: "Spring '24",
//       folder: 'spring24',
//     },
//     {
//       name: "Fall '24",
//       folder: 'fall24',
//     },
//   ];

//   // Generate an array for Week 1 to Week 10
//   const weeks = Array.from({ length: 10 }, (_, idx) => `Week ${idx + 1}`);

//   return (
//     <div style={homeStyles.container}>
//       <Head>
//         <title>UCLA Radio Show Archive</title>
//         <link
//           rel="stylesheet"
//           href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
//         />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       {/* Logo in the top-left corner as a Home button */}
//       {/* <header style={homeStyles.header}>
//         <Link href="/">
//           <Image
//             src="/radioblack.png"
//             alt="UCLA Radio Logo"
//             width={150}
//             height={75}
//             style={{ cursor: 'pointer' }}
//           />
//         </Link>
//       </header> */}

//       {/* Home Button with Home Icon */}
//       <header style={homeStyles.header}>
//         <Link href="/">
//           <AiOutlineHome style={{ fontSize: '2rem', color: 'white', cursor: 'pointer' }} />
//         </Link>
//       </header>

//       <main style={homeStyles.main}>
//         <h1 style={homeStyles.title}>
//           UCLA RADIO Show Archive
//         </h1>
//         <p style={homeStyles.description}>Your favorite shows, on demand.</p>

//         <div style={homeStyles.quartersGrid}>
//           {quarters.map((quarter, index) => (
//             <div key={index} style={homeStyles.quarterCard}>
//               <h2 style={homeStyles.quarterHeader}>{quarter.name}</h2>
//               <ul style={homeStyles.weekList}>
//                 {weeks.map((week, idx) => (
//                   <li key={idx} style={homeStyles.weekItem}>
//                     <Link
//                       href={{
//                         pathname: '/nowplaying',
//                         query: { quarter: quarter.folder, show: week },
//                       }}
//                       style={homeStyles.weekLink}
//                     >
//                       {week}
//                     </Link>
//                   </li>
//                 ))}
//                 <li style={homeStyles.weekItem}>
//                   <Link
//                     href={{
//                       pathname: '/nowplaying',
//                       query: { quarter: quarter.folder, show: 'Show of the Quarter' },
//                     }}
//                     style={homeStyles.weekLink}
//                   >
//                     Show of the Quarter
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           ))}
//         </div>
//       </main>

//       <footer style={homeStyles.footer}>
//         <a href="https://uclaradio.com/" target="_blank" rel="noopener noreferrer" style={homeStyles.footerLink}>
//           UCLA Radio
//         </a>
//       </footer>

//       <style jsx global>{`
//         html,
//         body {
//           font-family: 'Space Grotesk', sans-serif;
//           margin: 0;
//           padding: 0;
//           background-color: #121212; /* Dark mode background */
//           color: #ffffff;
//         }
//       `}</style>
//     </div>
//   );
// }

// const homeStyles = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#121212', // Dark mode background
//     color: '#FFFFFF',
//     padding: '20px',
//   },
//   header: {
//     position: 'absolute',
//     top: '20px',
//     left: '20px',
//   },
//   main: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: '2.5rem',
//     color: '#F2CAED', // Pink accent color
//     marginBottom: '10px',
//   },
//   description: {
//     fontSize: '1.2rem',
//     color: '#BBBBBB',
//     marginBottom: '20px',
//   },
//   quartersGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//     gap: '20px',
//     width: '100%',
//     maxWidth: '1200px',
//     marginTop: '2rem',
//   },
//   quarterCard: {
//     backgroundColor: '#1A1A1A', // Slightly lighter for contrast
//     color: '#FFFFFF',
//     borderRadius: '15px',
//     padding: '20px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//     textAlign: 'center',
//   },
//   quarterHeader: {
//     marginBottom: '1rem',
//     color: '#F2CAED', // Pink accent for headers
//   },
//   weekList: {
//     listStyle: 'none',
//     padding: 0,
//     margin: 0,
//   },
//   weekItem: {
//     margin: '0.5rem 0',
//   },
//   weekLink: {
//     color: '#F2CAED', // Pink accent for links
//     textDecoration: 'none',
//     fontWeight: 'bold',
//   },
//   footer: {
//     padding: '1rem',
//     textAlign: 'center',
//     borderTop: '1px solid #333333',
//     width: '100%',
//     backgroundColor: '#121212',
//   },
//   footerLink: {
//     color: '#F2CAED', // Pink accent for footer link
//     textDecoration: 'none',
//     fontWeight: 'bold',
//   },
// };

// index.js

import Head from 'next/head';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Home() {
  const quarters = [
    {
      name: "Winter '24",
      folder: 'winter24',
    },
    {
      name: "Spring '24",
      folder: 'spring24',
    },
    {
      name: "Fall '24",
      folder: 'fall24',
    },
  ];

  // Generate an array for Week 1 to Week 10
  const weeks = Array.from({ length: 10 }, (_, idx) => `Week ${idx + 1}`);

  return (
    <div style={homeStyles.container}>
      <Head>
        <title>UCLA Radio Show Archive</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Home Button */}
      <header style={homeStyles.header}>
        <Link href="/">
          <AiOutlineHome style={{ fontSize: '2rem', color: 'white', cursor: 'pointer' }} />
        </Link>
      </header>

      {/* Translucent Background Rectangle */}
      <div style={homeStyles.backgroundRectangle}></div>

      {/* Hero Section */}
      <div style={homeStyles.heroSection}>
  <h1 style={homeStyles.title}>UCLA RADIO Show Archive</h1>
  <p style={homeStyles.description}>Your favorite shows, on demand.</p>
</div>

      {/* Main Content */}
      <main style={homeStyles.main}>
        <div style={homeStyles.quartersGrid}>
          {quarters.map((quarter, index) => (
            <div
            key={index}
            style={homeStyles.quarterCard}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, homeStyles.quarterCardHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', backgroundColor: '#263851' })}
          >
              <h2 style={homeStyles.quarterHeader}>{quarter.name}</h2>
              <ul style={homeStyles.weekList}>
                {weeks.map((week, idx) => (
                  <li key={idx} style={homeStyles.weekItem}>
                    <Link
                      href={{
                        pathname: '/nowplaying',
                        query: { quarter: quarter.folder, show: week },
                      }}
                      style={homeStyles.weekLink}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, homeStyles.weekLinkHover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, homeStyles.weekLink)}
                    >
                      {week}
                    </Link>
                  </li>
                ))}
                <li style={homeStyles.weekItem}>
                  <Link
                    href={{
                      pathname: '/nowplaying',
                      query: { quarter: quarter.folder, show: 'Show of the Quarter' },
                    }}
                    style={homeStyles.weekLink}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, homeStyles.weekLinkHover)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, homeStyles.weekLink)}
                  >
                    Show of the Quarter
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={homeStyles.footer}>
        <div style={homeStyles.socialMedia}>
          <a
            href="https://twitter.com/uclaradio"
            target="_blank"
            rel="noopener noreferrer"
            style={homeStyles.socialIcon}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, homeStyles.socialIconHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, homeStyles.socialIcon)}
          >
            <FaTwitter />
          </a>
          <a
            href="https://facebook.com/uclaradio"
            target="_blank"
            rel="noopener noreferrer"
            style={homeStyles.socialIcon}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, homeStyles.socialIconHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, homeStyles.socialIcon)}
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com/uclaradio"
            target="_blank"
            rel="noopener noreferrer"
            style={homeStyles.socialIcon}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, homeStyles.socialIconHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, homeStyles.socialIcon)}
          >
            <FaInstagram />
          </a>
        </div>
        <a
          href="https://uclaradio.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={homeStyles.footerLink}
        >
          UCLA Radio
        </a>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        html,
        body {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #121212;
          color: white;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}

const homeStyles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#121212', // Dark mode background
    color: '#FFFFFF',
    padding: '20px',
    overflow: 'hidden', // Ensure the rectangle doesn't cause scrollbars
  },
  header: {
    position: 'fixed', // Use 'fixed' to keep the header in place
    top: '20px',
    left: '20px',
    zIndex: 2,
  },
  backgroundRectangle: {
    position: 'absolute',
    top: '5%',
    bottom: '20%',
    left: '20%',
    width: '60%',
    height: '80%',
    backgroundColor: 'rgba(38, 56, 81, 0.3)', // Dark blue with transparency
    borderRadius: '20px',
    zIndex: 0,
  },
  heroSection: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '80px 20px', // Reduced padding to bring the title closer to the top
    marginTop: '-3rem', // Pull the title higher into the rectangle
  },
  title: {
    fontSize: '3rem',
    color: '#F2CAED', // Pink accent color
    marginBottom: '10px',
  },
  description: {
    fontSize: '1.5rem',
    color: '#FFFFFF',
    marginBottom: '30px',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 20px',
    marginBottom: '200px', // Add space to prevent overlap with the footer
  },
  quartersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px',
    maxHeight: '60vh', // Limit the grid height
    marginTop: '-3rem', // Reduce the gap from hero section
    zIndex: 1,
  },
  quarterCard: {
    backgroundColor: '#263851', // Dark blue shade
    color: '#FFFFFF',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s, background-color 0.3s',
    cursor: 'pointer',
  },
  quarterCardHover: {
    transform: 'translateY(-10px)',
    backgroundColor: '#1E2D42', // Slightly darker on hover
  },
  quarterHeader: {
    marginBottom: '1.5rem',
    color: '#F2CAED', // Pink accent for headers
    fontSize: '2rem',
  },
  weekList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  weekItem: {
    margin: '0.8rem 0',
  },
  weekLink: {
    color: '#F2CAED', // Pink accent for links
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    transition: 'color 0.3s',
  },
  weekLinkHover: {
    color: '#FFFFFF',
  },
  footer: {
    padding: '1rem',
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#263851', // Dark blue background
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footerLink: {
    color: '#F2CAED', // Pink accent for footer link
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  socialMedia: {
    marginBottom: '10px',
  },
  socialIcon: {
    color: '#F2CAED',
    margin: '0 10px',
    fontSize: '1.5rem',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  socialIconHover: {
    color: '#FFFFFF',
  },
};

// const homeStyles = {
//   container: {
//     position: 'relative',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#121212',
//     color: '#FFFFFF',
//     padding: '2%',
//     overflow: 'hidden',
//   },
//   header: {
//     position: 'fixed',
//     top: '2%',
//     left: '2%',
//     zIndex: 2,
//   },
//   backgroundRectangle: {
//     position: 'absolute',
//     top: '8%',
//     left: '10%',
//     width: '80%',
//     height: '75%',
//     backgroundColor: 'rgba(38, 56, 81, 0.3)',
//     borderRadius: '2%',
//     zIndex: 0,
//   },
//   heroSection: {
//     position: 'relative',
//     zIndex: 1,
//     textAlign: 'center',
//     padding: '5% 2%',
//     marginTop: '5%',
//   },
//   title: {
//     fontSize: '2.8vw', // Scales based on viewport width
//     color: '#F2CAED',
//     marginBottom: '1%',
//   },
//   description: {
//     fontSize: '1.5vw', // Scales based on viewport width
//     color: '#FFFFFF',
//     marginBottom: '2%',
//   },
//   main: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     textAlign: 'center',
//     padding: '0 5%',
//     marginBottom: '8%',
//   },
//   quartersGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(18%, 1fr))', // Scales the columns
//     gap: '2%',
//     width: '100%',
//     marginTop: '3%',
//     zIndex: 1,
//   },
//   quarterCard: {
//     backgroundColor: '#263851',
//     color: '#FFFFFF',
//     borderRadius: '1rem',
//     padding: '5%',
//     textAlign: 'center',
//     transition: 'transform 0.3s, background-color 0.3s',
//     cursor: 'pointer',
//   },
//   quarterCardHover: {
//     transform: 'translateY(-2%)',
//     backgroundColor: '#1E2D42',
//   },
//   quarterHeader: {
//     marginBottom: '1rem',
//     color: '#F2CAED',
//     fontSize: '1.8vw', // Scales with viewport width
//   },
//   weekList: {
//     listStyle: 'none',
//     padding: 0,
//     margin: 0,
//   },
//   weekItem: {
//     margin: '0.5rem 0',
//   },
//   weekLink: {
//     color: '#F2CAED',
//     textDecoration: 'none',
//     fontWeight: 'bold',
//     fontSize: '1.2vw', // Scales with viewport width
//     transition: 'color 0.3s',
//   },
//   weekLinkHover: {
//     color: '#FFFFFF',
//   },
//   footer: {
//     padding: '1%',
//     textAlign: 'center',
//     width: '100%',
//     backgroundColor: '#263851',
//     color: '#FFFFFF',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//   },
//   footerLink: {
//     color: '#F2CAED',
//     textDecoration: 'none',
//     fontWeight: 'bold',
//   },
//   socialMedia: {
//     marginBottom: '1%',
//   },
//   socialIcon: {
//     color: '#F2CAED',
//     margin: '0 1%',
//     fontSize: '1.5vw',
//     textDecoration: 'none',
//     transition: 'color 0.3s',
//   },
//   socialIconHover: {
//     color: '#FFFFFF',
//   },
// };
