// import '../styles/global.css';


// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

// export default MyApp; 



//pages/_app.js
import "../styles/global.css";
import GradientBackground from "../components/GradientBackground";

function MyApp({ Component, pageProps }) {
  return (
    <GradientBackground>
      <Component {...pageProps} />
    </GradientBackground>
  );
}

export default MyApp;

