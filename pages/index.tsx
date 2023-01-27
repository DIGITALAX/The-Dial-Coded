import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutSwitch from "../components/Home/LayoutSwitch/LayoutSwitch";
import Scan from "../components/Home/Scan/Scan";
import checkDispatcher from "../lib/lens/helpers/checkDispatcher";
import { setLayout } from "../redux/reducers/layoutSlice";
import { RootState } from "../redux/store";

export interface HomeProps {
  newLink: string;
}

const Home: NextPage<HomeProps> = ({ newLink }): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  useEffect(() => {
    if (router?.asPath?.includes("#")) {
      dispatch(setLayout(router.asPath.split("/#")[1]));
    } else {
      router?.push("/#Post").catch((e) => {
        if (!e.cancelled) {
          throw e;
        }
      });
    }
  }, [router?.asPath]);

  useEffect(() => {
    checkDispatcher(dispatch, profile?.id, profile?.dispatcher?.canUseRelay);
  }, [profile?.id, profile?.dispatcher?.canUseRelay]);
  return (
    <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
      <Head>
        <title>The Dial</title>
        <meta
          name="description"
          content="An ever evolving canvas you can use with friends."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="The Dial" />
        <meta property="og:image" content="https://thedial.xyz/card.png/" />
        <meta name="og:title" content="The Dial" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://thedial.xyz/card.png/" />
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
      </Head>
      <Scan newLink={newLink} />
      <LayoutSwitch />
    </div>
  );
};

export default Home;
