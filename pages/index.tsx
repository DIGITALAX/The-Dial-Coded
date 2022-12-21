import type { NextPage } from "next";
import Head from "next/head";
import PublicationModal from "../components/Common/Modals/Publication/PublicationModal";
import LayoutSwitch from "../components/Home/LayoutSwitch/LayoutSwitch";
import Scan from "../components/Home/Scan/Scan";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import shuffle from "shuffle-array";
import SignInModal from "../components/Common/Modals/SignIn/SignInModal";
import GetProfileModal from "../components/Common/Modals/GetProfile/GetProfileModal";
import ImageViewerModal from "../components/Common/Modals/ImageViewer/ImageViewer";
import CollectNotificationModal from "../components/Common/Modals/CollectNotification/CollectNotificationModal";
import CollectsModal from "../components/Common/Modals/Reactions/CollectsModal";
import MirrorsModal from "../components/Common/Modals/Reactions/MirrorsModal";
import useReactions from "../components/Common/Feed/hooks/useReactions";
import CommentsModal from "../components/Common/Modals/Reactions/CommentsModal";
import HeartsModal from "../components/Common/Modals/Reactions/HeartsModal";
import useMain from "../components/Home/Layout/Post/modules/Feed/hooks/useMain";
import Transaction from "../components/Common/Modals/Transactions/Transactions";

const Home: NextPage = (): JSX.Element => {
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
