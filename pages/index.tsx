import type { NextPage } from "next";
import Head from "next/head";
import LayoutSwitch from "../components/Home/LayoutSwitch/LayoutSwitch";
import Scan from "../components/Home/Scan/Scan";

export interface HomeProps {
  newLink: string;
}

const Home: NextPage<HomeProps> = ({ newLink }): JSX.Element => {
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
