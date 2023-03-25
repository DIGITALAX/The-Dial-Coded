import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Layout/Header";
import { store } from "./../redux/store";
import { Provider } from "react-redux";
import Footer from "../components/Layout/Footer";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Modals from "../components/Home/Modals/Modals";
import { useEffect, useState } from "react";
import shuffle from "shuffle-array";
import { useRouter } from "next/router";
import RouterChange from "../components/Common/RouterChange/RouterChange";
import Head from "next/head";

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "The Dial",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  const streamLinks: string[] = [
    "https://www.youtube.com/embed/__PtdR1xZYY?controls=0?rel=0&autoplay=1&mute=1",
    "https://www.youtube.com/embed/CqpU5vCQxGM?controls=0?rel=0&autoplay=1&mute=1",
  ];
  const [newLink, setNewLink] = useState<string>(
    "https://www.youtube.com/embed/__PtdR1xZYY?controls=0?rel=0&autoplay=1&mute=1"
  );

  useEffect(() => {
    const shuffledLinks: number[] = shuffle([0, 1]);
    setNewLink(streamLinks[shuffledLinks[0]]);
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setRouterChangeLoading(true);
    };

    const handleStop = () => {
      setRouterChangeLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (routerChangeLoading) {
    return <RouterChange />;
  }

  return (
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <div className="min-h-fit h-auto min-w-screen w-screen relative selection:bg-offBlue selection:text-midWhite">
            <Head>
              <title>The Dial</title>
              <meta
                name="description"
                content="An ever evolving canvas you can use with friends."
              />
              <link rel="icon" href="/favicon.ico" />
              <meta property="og:site_name" content="The Dial" />
              <meta
                property="og:image"
                content="https://thedial.xyz/card.png/"
              />
              <meta name="og:title" content="The Dial" />
              <meta property="og:type" content="website" />
              <meta
                name="twitter:image"
                content="https://thedial.xyz/card.png/"
              />
              <meta name="twitter:url" content="https://thedial.xyz/" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta property="og:type" content="website" />
              <meta name="twitter:site" content="@digitalax" />
              <meta name="twitter:creator" content="@digitalax" />
              <link
                rel="preload"
                href="/fonts/DosisRegular.ttf"
                as="font"
                crossOrigin=""
                type="font/ttf"
              />
              <link
                rel="preload"
                href="/fonts/DS-DIGI.ttf"
                as="font"
                crossOrigin=""
                type="font/ttf"
              />
              <link
                rel="preload"
                href="/fonts/DS-DIGIT.ttf"
                as="font"
                crossOrigin=""
                type="font/ttf"
              />
              <link
                rel="preload"
                href="/fonts/DS-DIGII.ttf"
                as="font"
                crossOrigin=""
                type="font/ttf"
              />
              <link
                rel="preload"
                href="/fonts/DS-DIGIB.ttf"
                as="font"
                crossOrigin=""
                type="font/ttf"
              />
              <link
                rel="preload"
                href="/fonts/DonJoseBigote.ttf"
                as="font"
                crossOrigin=""
                type="font/ttf"
              />
              <link
                rel="preload"
                href="/fonts/Satoshi-Medium.otf"
                as="font"
                crossOrigin=""
                type="font/otf"
              />
              <link
                rel="preload"
                href="/fonts/multiple.otf"
                as="font"
                crossOrigin=""
                type="font/otf"
              />
              <link
                rel="preload"
                href="/fonts/EarlsRevenge.ttf"
                as="font"
                crossOrigin=""
                type="font/ttf"
              />
            </Head>
            <Header />
            <Component {...pageProps} newLink={newLink} />
            <Modals />
            <Footer />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}

export default MyApp;
