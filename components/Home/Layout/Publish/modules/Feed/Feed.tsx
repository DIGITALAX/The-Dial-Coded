import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { FeedProps } from "../../types/post.types";
import Hot from "./modules/Hot";
import Main from "./modules/Main";

const Feed: FunctionComponent<FeedProps> = ({
  hotFeed,
  hasHotReacted,
  hasHotCommented,
  hasHotMirrored,
  hotReactionsFeed,
  fetchMoreMixtapes,
  publicationsFeed,
  fetchMore,
  hasReacted,
  reactionsFeed,
  hasMirrored,
  hasCommented,
  noUserData,
  mixtapeMirror,
  handleHidePost,
  followerOnly,
  mixtapesLoading,
  publicationsLoading,
  firstMixLoad,
  firstPubLoad,
  hotFollowerOnly,
  noHotData,
}): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.app.moreFeedReducer.value
  );
  const viewerFeed = useSelector(
    (state: RootState) => state.app.userViewerReducer.value
  );
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto row-start-3 gap-3">
      <div className="relative row-start-1 w-full h-full grid md:grid-flow-col md:auto-cols-auto grid-flow-row auto-rows-auto gap-6">
        <Main
          publicationsFeed={publicationsFeed}
          isOpen={isOpen}
          fetchMore={fetchMore}
          viewerFeed={viewerFeed}
          hasReacted={hasReacted}
          reactionsFeed={reactionsFeed}
          hasMirrored={hasMirrored}
          hasCommented={hasCommented}
          noUserData={noUserData}
          mixtapeMirror={mixtapeMirror}
          handleHidePost={handleHidePost}
          followerOnly={followerOnly}
          publicationsLoading={publicationsLoading}
          firstPubLoad={firstPubLoad}
          mixtapeLength={hotFeed?.length}
          noHotData={noHotData}
        />
        <Hot
          isOpen={isOpen}
          hotFeed={hotFeed}
          hasHotReacted={hasHotReacted}
          hasHotCommented={hasHotCommented}
          hasHotMirrored={hasHotMirrored}
          hotReactionsFeed={hotReactionsFeed}
          fetchMoreMixtapes={fetchMoreMixtapes}
          dispatch={dispatch}
          handleHidePost={handleHidePost}
          mixtapesLoading={mixtapesLoading}
          firstMixLoad={firstMixLoad}
          hotFollowerOnly={hotFollowerOnly}
          noHotData={noHotData}
        />
      </div>
      {/* <div
        className="relative row-start-2 p-4 w-full h-fit grid grid-flow-col auto-cols-auto bg-offBlue/60 hover:opacity-70 active:scale-95 cursor-pointer"
        onClick={() => {
          dispatch(setMoreFeed(!isOpen));
          fetchMore();
        }}
      >
        <div className="relative w-fit h-fit place-self-center col-start-1 ">
          {isOpen ? (
            <MdOutlineExpandLess color="white" size={30} />
          ) : (
            <MdOutlineExpandMore color="white" size={30} />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Feed;
