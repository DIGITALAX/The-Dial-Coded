import { FunctionComponent } from "react";
import Feed from "./modules/Feed/Feed";
import Parameters from "./modules/Parameters/Parameters";
import PostBox from "./modules/PostBox/PostBox";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import usePost from "./hooks/usePost";
import useHot from "./modules/Feed/hooks/useHot";
import { Profile } from "../../../Common/types/lens.types";
import useMainFeed from "./modules/Feed/hooks/useMainFeed";
import handleHidePost from "../../../../lib/lens/helpers/handleHidePost";

const Post: FunctionComponent = (): JSX.Element => {
  const { openConnectModal } = useConnectModal();
  const lensProfile: Profile | undefined = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const noUserData = useSelector(
    (state: RootState) => state.app.noUserDataReducer.value
  );
  const noHotData = useSelector(
    (state: RootState) => state.app.noHotDataReducer.value
  );
  const { connected } = usePost();
  const {
    publicationsFeed,
    fetchMoreFeed,
    hasReacted,
    reactionsFeed,
    hasMirrored,
    hasCommented,
    mixtapeMirror,
    followerOnly,
    publicationsLoading,
    firstPubLoad,
    hasMore,
    reactionLoaded,
    onFeedScroll,
  } = useMainFeed();
  const {
    hotFeed,
    hasHotReacted,
    hasHotCommented,
    hasHotMirrored,
    hotReactionsFeed,
    fetchMoreMixtapes,
    mixtapesLoading,
    firstMixLoad,
    followerOnly: hotFollowerOnly,
    hasMoreHot,
    reactionLoaded: reactionLoadedHot,
  } = useHot();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-shame gap-10">
      <div className="relative w-full h-fit px-2">
        <div
          className="relative w-full h-fit p-3 sm:p-6 md:p-10 grid grid-flow-row auto-rows-auto gap-10"
          id="outside2"
        >
          <PostBox
            openConnectModal={openConnectModal}
            lensProfile={lensProfile}
            isConnected={connected}
          />
          <Parameters />
        </div>
      </div>
      <Feed
        hotFeed={hotFeed}
        hasHotReacted={hasHotReacted}
        hasHotCommented={hasHotCommented}
        hasHotMirrored={hasHotMirrored}
        hotReactionsFeed={hotReactionsFeed}
        fetchMoreMixtapes={fetchMoreMixtapes}
        publicationsFeed={publicationsFeed}
        fetchMore={fetchMoreFeed}
        hasReacted={hasReacted}
        reactionsFeed={reactionsFeed}
        hasMirrored={hasMirrored}
        hasCommented={hasCommented}
        noUserData={noUserData}
        noHotData={noHotData}
        mixtapeMirror={mixtapeMirror}
        handleHidePost={handleHidePost}
        followerOnly={followerOnly}
        mixtapesLoading={mixtapesLoading}
        publicationsLoading={publicationsLoading}
        firstMixLoad={firstMixLoad}
        firstPubLoad={firstPubLoad}
        hotFollowerOnly={hotFollowerOnly}
        hasMore={hasMore}
        hasMoreHot={hasMoreHot}
        reactionLoaded={reactionLoaded}
        reactionLoadedHot={reactionLoadedHot}
        onFeedScroll={onFeedScroll}
      />
    </div>
  );
};

export default Post;
