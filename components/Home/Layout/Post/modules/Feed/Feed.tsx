import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { FeedProps } from "../../types/post.types";
import Hot from "./modules/Hot";
import Main from "./modules/Main";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { setMoreFeed } from "../../../../../../redux/reducers/moreFeedSlice";

const Feed: FunctionComponent<FeedProps> = ({
  topTrending,
  topMixtape,
  topTracks,
  publicationsFeed,
  fetchMorePublications,
  fetchReactions,
  getMoreFeedTimeline,
  getMoreUserSelectFeed,
  userSelectFeed,
  didMirror,
  getMoreMirrors
}): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.app.moreFeedReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto row-start-3 gap-3">
      <div className="relative row-start-1 w-full h-full grid grid-flow-col auto-cols-auto gap-6">
        <Main
          publicationsFeed={publicationsFeed}
          fetchMorePublications={fetchMorePublications}
          isOpen={isOpen}
          fetchReactions={fetchReactions}
          getMoreFeedTimeline={getMoreFeedTimeline}
          getMoreUserSelectFeed={getMoreUserSelectFeed}
          userSelectFeed={userSelectFeed}
          didMirror={didMirror}
          getMoreMirrors={getMoreMirrors}
        />
        <Hot
          topTrending={topTrending}
          topMixtape={topMixtape}
          topTracks={topTracks}
          isOpen={isOpen}
        />
      </div>
      <div
        className="relative row-start-2 p-4 w-full h-fit grid grid-flow-col auto-cols-auto bg-offBlue/60 hover:opacity-70 active:scale-95 cursor-pointer"
        onClick={() => {
          dispatch(setMoreFeed(!isOpen));
          if (lensProfile) {
            getMoreFeedTimeline();
          } else {
            fetchMorePublications();
          }
        }}
      >
        <div className="relative w-fit h-fit place-self-center col-start-1 ">
          {isOpen ? (
            <MdOutlineExpandLess color="white" size={30} />
          ) : (
            <MdOutlineExpandMore color="white" size={30} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
