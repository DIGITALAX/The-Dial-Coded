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
  const { connected } = usePost();
  const {
    publicationsFeed,
    fetchMoreFeed,
    hasReacted,
    reactionsFeed,
    hasMirrored,
    hasCommented,
    mixtapeMirror,
    followerOnly
  } = useMainFeed();
  const {
    hotFeed,
    hasHotReacted,
    hasHotCommented,
    hasHotMirrored,
    hotReactionsFeed,
    fetchMoreMixtapes,
  } = useHot();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white p-3 sm:p-6 md:p-10 gap-10">
      <PostBox
        openConnectModal={openConnectModal}
        lensProfile={lensProfile}
        isConnected={connected}
      />
      <Parameters/>
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
        mixtapeMirror={mixtapeMirror}
        handleHidePost={handleHidePost}
        followerOnly={followerOnly}
      />
    </div>
  );
};

export default Post;
