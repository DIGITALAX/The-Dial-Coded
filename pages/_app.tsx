import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Layout/Header";
import { store } from "./../redux/store";
import { Provider } from "react-redux";
import PublicationModal from "../components/Common/Modals/Publication/PublicationModal";
import Badges from "../components/Home/Badges/Badges";
import Footer from "../components/Layout/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="min-h-fit h-auto min-w-screen w-screen relative selection:bg-offBlue selection:text-midWhite">
        <Header />
        <Component {...pageProps} />
        <Badges />
        <Footer />
      </div>
    </Provider>
  );
}

export default MyApp;
