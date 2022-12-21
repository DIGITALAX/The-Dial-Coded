import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useReactions from "../../Common/Feed/hooks/useReactions";
import CollectNotificationModal from "../../Common/Modals/CollectNotification/CollectNotificationModal";
import GetProfileModal from "../../Common/Modals/GetProfile/GetProfileModal";
import ImageViewerModal from "../../Common/Modals/ImageViewer/ImageViewer";
import PublicationModal from "../../Common/Modals/Publication/PublicationModal";
import CollectsModal from "../../Common/Modals/Reactions/CollectsModal";
import CommentsModal from "../../Common/Modals/Reactions/CommentsModal";
import HeartsModal from "../../Common/Modals/Reactions/HeartsModal";
import MirrorsModal from "../../Common/Modals/Reactions/MirrorsModal";
import SignInModal from "../../Common/Modals/SignIn/SignInModal";
import Transaction from "../../Common/Modals/Transactions/Transactions";
import useMain from "../Layout/Post/modules/Feed/hooks/useMain";

const Modals = () => {
  const makePublication = useSelector(
    (state: RootState) => state.app.publicationReducer.value
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
  const reactionModal = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const signInModal = useSelector(
    (state: RootState) => state.app.signInReducer.value
  );
  const {
    collectors,
    mirrorers,
    commentors,
    getMorePostMirrors,
    getMorePostComments,
    getMorePostCollects,
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
    mirrorPost,
  } = useReactions();
  const { collectInfoLoading, didMirror, getMoreMirrors } = useMain();
  return (
    <>
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
  );
};

export default Modals;
