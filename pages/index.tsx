import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import LayoutSwitch from "../components/Home/LayoutSwitch/LayoutSwitch";
import Scan from "../components/Home/Scan/Scan";
import { setLayout } from "../redux/reducers/layoutSlice";

export interface HomeProps {
  newLink: string;
}

const Home: NextPage<HomeProps> = ({ newLink }): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (router?.asPath?.includes("#")) {
      dispatch(setLayout(router.asPath.split("/#")[1]));
    }
  }, [router?.asPath]);
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
        <meta property="og:type" content="website" />
      </Head>
      <Scan newLink={newLink} />
      <LayoutSwitch />
    </div>
  );
};

export default Home;
