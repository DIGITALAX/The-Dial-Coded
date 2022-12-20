import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MainPost from "../../components/Home/Post/modules/MainPost";
import useMain from "../../components/Home/Layout/Post/modules/Feed/hooks/useMain";
import usePostPage from "../../components/Home/Post/hooks/usePostPage";
import Transaction from "../../components/Common/Modals/Transactions/Transactions";
import CommentsModal from "../../components/Common/Modals/Reactions/CommentsModal";
import HeartsModal from "../../components/Common/Modals/Reactions/HeartsModal";
import MirrorsModal from "../../components/Common/Modals/Reactions/MirrorsModal";
import CollectsModal from "../../components/Common/Modals/Reactions/CollectsModal";
import CollectNotificationModal from "../../components/Common/Modals/CollectNotification/CollectNotificationModal";
import ImageViewerModal from "../../components/Common/Modals/ImageViewer/ImageViewer";
import GetProfileModal from "../../components/Common/Modals/GetProfile/GetProfileModal";
import SignInModal from "../../components/Common/Modals/SignIn/SignInModal";
import PublicationModal from "../../components/Common/Modals/Publication/PublicationModal";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import useReactions from "../../components/Common/Feed/hooks/useReactions";

const Post: NextPage = (): JSX.Element => {
  const {
    query: { id },
  } = useRouter();
  const { getPublicationData, publicationDataLoading, publicationData } =
    usePostPage();
  const makePublication = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  const reactionModal = useSelector(
    (state: RootState) => state.app.reactionStateReducer
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
  const failed = useSelector(
    (state: RootState) => state.app.insufficientFundsReducer.value
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
    commentLoading,
    collectLoading,
    approvalLoading,
  } = useReactions();
  const { collectInfoLoading, didMirror, getMoreMirrors, fetchReactions } =
    useMain();
  console.log(mirrorPost);

  useEffect(() => {
    if (id) {
      getPublicationData(id as string);
    }
  }, [id]);

  return (
    <div className="relative h-fit w-full grid grid-flow-col auto-col-auto overflow-hidden">
      {(publicationDataLoading || publicationDataLoading === undefined) &&
      !publicationData ? (
        <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto top-60 md:top-44 rounded-t-md bg-white/90 opacity-100"></div>
      ) : (
        <>
          <MainPost
            publicationData={publicationData}
            didMirror={didMirror}
            fetchReactions={fetchReactions}
            getMoreMirrors={getMoreMirrors}
          />
          {makePublication && <PublicationModal />}
          {signInModal && <SignInModal />}
          {getProfileModal && <GetProfileModal />}
          {imageViewerModal && <ImageViewerModal />}
          {collectNotificationModal && <CollectNotificationModal />}
          {reactionModal.open && reactionModal.type === "collect" && (
            <CollectsModal
              collectors={collectors}
              getMorePostCollects={getMorePostCollects}
              approveCurrency={approveCurrency}
              handleCollect={collectPost}
              collectInfoLoading={collectInfoLoading}
              collectLoading={collectLoading}
              approvalLoading={approvalLoading}
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
              didMirror={didMirror}
              getMoreMirrors={getMoreMirrors}
            />
          )}
          {failed !== "" && failed !== undefined && (
            <Transaction
              inputText={
                failed === "insufficient"
                  ? "Insufficient Funds."
                  : "Transaction Failed. Please try again."
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default Post;
