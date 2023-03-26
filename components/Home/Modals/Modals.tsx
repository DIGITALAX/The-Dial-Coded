import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useCollected from "../../Common/Feed/hooks/useCollected";
import useHearted from "../../Common/Feed/hooks/useHearted";
import useMirrored from "../../Common/Feed/hooks/useMirrored";
import CollectNotificationModal from "../../Common/Modals/CollectNotification/CollectNotificationModal";
import GetProfileModal from "../../Common/Modals/GetProfile/GetProfileModal";
import ImageViewerModal from "../../Common/Modals/ImageViewer/ImageViewer";
import PublicationModal from "../../Common/Modals/Publications/PublicationModal";
import CollectsModal from "../../Common/Modals/Reactions/CollectsModal";
import CommentsModal from "../../Common/Modals/Publications/CommentsModal";
import HeartsModal from "../../Common/Modals/Reactions/HeartsModal";
import MirrorsModal from "../../Common/Modals/Reactions/MirrorsModal";
import SignInModal from "../../Common/Modals/SignIn/SignInModal";
import General from "../../Common/Modals/General/General";
import useMainFeed from "../Layout/Publish/modules/Feed/hooks/useMainFeed";
import FollowsModal from "../../Common/Modals/Follows/FollowsModal";
import useProfilePage from "../Profile/hooks/useProfilePage";
import IndexingModal from "../../Common/Modals/Indexing/IndexingModal";
import handleHidePost from "../../../lib/lens/helpers/handleHidePost";
import FollowTypeModal from "../../Common/Modals/FollowType/FollowTypeModal";
import FulfillmentCanvas from "../../Common/Modals/FulfillmentCanvas/FulfillmentCanvas";
import useFulfillmentCanvas from "../../Common/Modals/FulfillmentCanvas/hooks/useFulfillmentCanvas";

const Modals = () => {
  const dispatch = useDispatch();
  const makePublication = useSelector(
    (state: RootState) => state.app.publicationReducer.open
  );
  const collectNotificationModal = useSelector(
    (state: RootState) => state.app.collectNotificationReducer.open
  );
  const getProfileModal = useSelector(
    (state: RootState) => state.app.getProfileModalReducer.value
  );
  const follow = useSelector(
    (state: RootState) => state.app.followModalReducer
  );
  const imageViewerModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const commentShow = useSelector(
    (state: RootState) => state.app.commentShowReducer
  );
  const text = useSelector(
    (state: RootState) => state.app.insufficientFundsReducer.value
  );
  const reactionModal = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const signInModal = useSelector(
    (state: RootState) => state.app.signInReducer.value
  );
  const indexingModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const followTypes = useSelector(
    (state: RootState) => state.app.followTypeValuesReducer
  );
  const fulfillmentModal = useSelector(
    (state: RootState) => state.app.fulfillmentReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const image = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const {
    mirrorInfoLoading,
    mirrorLoading,
    mirrorPost,
    getMorePostMirrors,
    mirrorers,
  } = useMirrored();

  const {
    reactionPost,
    reactionLoading,
    getMorePostReactions,
    reactionInfoLoading,
    reacters,
  } = useHearted();

  const {
    collectLoading,
    collectInfoLoading,
    postCollectInfoLoading,
    getMorePostCollects,
    approvalLoading,
    collectPost,
    approveCurrency,
    collectors,
  } = useCollected();

  const {
    commentInfoLoading,
    commentors,
    getMorePostComments,
    hasCommented,
    hasMirrored,
    hasReacted,
    reactionsFeed,
    reactionLoaded,
  } = useMainFeed();

  const {
    getMoreFollowers,
    getMoreFollowing,
    userFollowers,
    userFollowing,
    followingLoading,
    followersLoading,
    followTypedData,
    followInfoLoading,
    approvalLoading: followApprovalLoading,
    approveCurrency: followApproveCurrency,
    followLoading,
  } = useProfilePage();

  const {
    notes,
    setNotes,
    amount,
    setAmount,
    sizes,
    setSizes,
    baseColor,
    setBaseColor,
    payment,
    setPayment,
  } = useFulfillmentCanvas();

  return (
    <>
      {makePublication && <PublicationModal />}
      {signInModal && <SignInModal />}
      {getProfileModal && <GetProfileModal />}
      {imageViewerModal && <ImageViewerModal />}
      {fulfillmentModal.open && (
        <FulfillmentCanvas
          lensProfile={lensProfile}
          fulfillmentModal={fulfillmentModal}
          postImage={image![0].cid}
          notes={notes}
          setNotes={setNotes}
          amount={amount}
          setAmount={setAmount}
          sizes={sizes}
          setSizes={setSizes}
          baseColor={baseColor}
          setBaseColor={setBaseColor}
          payment={payment}
          setPayment={setPayment}
        />
      )}
      {collectNotificationModal && <CollectNotificationModal />}
      {reactionModal.open && reactionModal.type === "collect" && (
        <CollectsModal
          collectors={collectors}
          getMorePostCollects={getMorePostCollects}
          approveCurrency={approveCurrency}
          handleCollect={collectPost}
          collectInfoLoading={collectInfoLoading}
          postCollectInfoLoading={postCollectInfoLoading}
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
          mirrorInfoLoading={mirrorInfoLoading}
        />
      )}
      {reactionModal.open && reactionModal.type === "heart" && (
        <HeartsModal
          reacters={reacters}
          getMorePostReactions={getMorePostReactions}
          reactionPost={reactionPost}
          reactionLoading={reactionLoading}
          reactionInfoLoading={reactionInfoLoading}
        />
      )}
      {commentShow.open && (
        <CommentsModal
          commentors={commentors}
          commentInfoLoading={commentInfoLoading}
          getMorePostComments={getMorePostComments}
          hasMirrored={hasMirrored}
          hasReacted={hasReacted}
          hasCommented={hasCommented}
          reactionsFeed={reactionsFeed}
          handleHidePost={handleHidePost}
          isMixtape={commentShow.mixtape as boolean}
          reactionLoaded={reactionLoaded}
        />
      )}
      {follow?.open && (
        <FollowsModal
          dispatch={dispatch}
          followersLoading={followersLoading}
          followingLoading={followingLoading}
          getMoreFollowers={getMoreFollowers}
          getMoreFollowing={getMoreFollowing}
          userFollowing={userFollowing}
          userFollowers={userFollowers}
          type={follow?.type}
        />
      )}
      {followTypes.modal && (
        <FollowTypeModal
          followInfoLoading={followInfoLoading}
          followTypedData={followTypedData}
          approvalLoading={followApprovalLoading}
          approveCurrency={followApproveCurrency}
          followLoading={followLoading}
        />
      )}
      {indexingModal?.value && (
        <IndexingModal message={indexingModal?.message} />
      )}
      {text !== "" && text !== undefined && <General inputText={text} />}
    </>
  );
};

export default Modals;
