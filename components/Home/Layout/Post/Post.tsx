import { FunctionComponent } from "react";
import Feed from "./modules/Feed/Feed";
import Parameters from "./modules/Parameters/Parameters";
import PostBox from "./modules/PostBox";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import usePost from "./hooks/usePost";
import useMain from "./modules/Feed/hooks/useMain";
import useHot from "./modules/Feed/hooks/useHot";
import { Profile } from "../../../Common/types/lens.types";

const Post: FunctionComponent = (): JSX.Element => {
  const { openConnectModal } = useConnectModal();
  const lensProfile: Profile | undefined = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const { connected } = usePost();
  const {
    setFeedType,
    setSortCriteria,
    fetchMorePublications,
    publicationsFeed,
  } = useMain();
  const { topTrending, topMixtape, topTracks } = useHot();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white p-10 gap-10">
      <PostBox
        openConnectModal={openConnectModal}
        lensProfile={lensProfile}
        isConnected={connected}
      />
      <Parameters
        setFeedType={setFeedType}
        setSortCriteria={setSortCriteria}
      />
      <Feed
        topTrending={topTrending}
        topMixtape={topMixtape}
        topTracks={topTracks}
        publicationsFeed={publicationsFeed}
        fetchMorePublications={fetchMorePublications}
      />
    </div>
  );
};

export default Post;
