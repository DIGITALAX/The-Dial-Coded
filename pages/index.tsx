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

const Home: NextPage = (): JSX.Element => {
  const makePublication = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  const signInModal = useSelector(
    (state: RootState) => state.app.signInReducer.value
  );
  const collectNotificationModal = useSelector(
    (state: RootState) => state.app.collectNotificationReducer.open
  );
  const getProfileModal = useSelector(
    (state: RootState) => state.app.getProfileModalReducer.value
  );
  const imageViewerModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const commentShow = useSelector(
    (state: RootState) => state.app.commentShowReducer
  );
  const {
    collectors,
    mirrorers,
    commentors,
    getMorePostMirrors,
    getMorePostComments,
    getMorePostCollects,
    mirrorPost,
    reacters,
    getMorePostReactions,
    reactionPost,
    reactionLoading,
    mirrorLoading,
    mirrorComplete,
    approveCurrency,
    collectPost,
    commentPost,
    commentLoading
  } = useReactions();
  const streamLinks: string[] = [
    "https://www.youtube.com/embed/2Sa8o39R0jY?controls=0?rel=0&autoplay=1&mute=1",
    "https://www.youtube.com/embed/qaoyC8D5Kt0?controls=0?rel=0&autoplay=1&mute=1",
  ];
  const [newLink, setNewLink] = useState<string>(
    "https://www.youtube.com/embed/2Sa8o39R0jY?controls=0?rel=0&autoplay=1&mute=1"
  );
  const reactionModal = useSelector(
    (state: RootState) => state.app.reactionStateReducer
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
      {makePublication && <PublicationModal />}
      {signInModal && <SignInModal />}
      {getProfileModal && <GetProfileModal />}
      {imageViewerModal && <ImageViewerModal />}
      {collectNotificationModal && <CollectNotificationModal />}
      {reactionModal.open && reactionModal.type === "collect" && (
        <CollectsModal
          collectors={collectors}
          getMorePostCollects={getMorePostCollects}
          handleApprove={approveCurrency}
          handleCollect={collectPost}
        />
      )}
      {reactionModal.open && reactionModal.type === "mirror" && (
        <MirrorsModal
          mirrorers={mirrorers}
          getMorePostMirrors={getMorePostMirrors}
          mirrorPost={mirrorPost}
          mirrorLoading={mirrorLoading}
          mirrorComplete={mirrorComplete}
        />
      )}
      {reactionModal.open && reactionModal.type === "heart" && (
        <HeartsModal
          reacters={reacters}
          getMorePostReactions={getMorePostReactions}
          reactionPost={reactionPost}
          reactionLoading={reactionLoading}
        />
      )}
      {commentShow.open && (
        <CommentsModal
          commentPost={commentPost}
          commentors={commentors}
          getMorePostComments={getMorePostComments}
          commentLoading={commentLoading}
        />
      )}
    </div>
  );
};

export default Home;
