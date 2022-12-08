import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Layout/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-fit h-auto min-w-screen w-screen relative selection:bg-offBlue selection:text-midWhite">
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
