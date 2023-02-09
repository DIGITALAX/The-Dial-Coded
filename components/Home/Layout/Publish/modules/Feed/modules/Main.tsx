import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import { useDispatch } from "react-redux";
import FeedPublication from "../../../../../../Common/Feed/modules/FeedPublication";
import { PublicationSearchResult } from "../../../../../../Common/types/lens.types";
import InfiniteScroll from "react-infinite-scroll-component";
import PostFeedLoading from "../../../../../../Common/Loaders/PostFeedLoading";
import FetchMoreLoading from "../../../../../../Common/Loaders/FetchMoreLoading";

const Main: FunctionComponent<MainProps> = ({
  publicationsFeed,
  fetchMore,
  isOpen,
  hasMirrored,
  hasReacted,
  reactionsFeed,
  hasCommented,
  noUserData,
  mixtapeMirror,
  handleHidePost,
  followerOnly,
  publicationsLoading,
  firstPubLoad,
  mixtapeLength,
  noHotData,
  hasMore
}): JSX.Element => {
  const dispatch = useDispatch();
  if (publicationsLoading && firstPubLoad) {
    return <PostFeedLoading />;
  }
  return (
    <div
      className="relative w-full md:w-[50vw] h-full row-start-2 md:row-start-1 col-start-1 grid grid-flow-row auto-rows-auto gap-5"
      id="targetDiv"
    >
      {!noUserData ? (
        <InfiniteScroll
          scrollableTarget={"targetDiv"}
          height={
            (publicationsFeed?.length && noHotData) > 20 ||
            (!noHotData && publicationsFeed?.length + mixtapeLength) > 20
              ? "242.95rem"
              : undefined
          }
          loader={<FetchMoreLoading />}
          hasMore={hasMore}
          next={fetchMore}
          dataLength={publicationsFeed?.length}
          className={`relative row-start-1 w-full h-full overflow-y-scroll grid grid-flow-row auto-rows-auto gap-3`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
        >
          {publicationsFeed?.map(
            (publication: PublicationSearchResult, index: number) => {
              return (
                <FeedPublication
                  dispatch={dispatch}
                  publication={publication}
                  key={index}
                  type={publication.__typename}
                  hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                  hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                  reactionsFeed={
                    reactionsFeed?.length > 0 && reactionsFeed[index]
                  }
                  hasCommented={hasCommented?.length > 0 && hasCommented[index]}
                  mixtapeMirror={
                    mixtapeMirror?.length > 0 && mixtapeMirror[index]
                  }
                  followerOnly={followerOnly?.length > 0 && followerOnly[index]}
                  handleHidePost={handleHidePost}
                />
              );
            }
          )}
        </InfiniteScroll>
      ) : (
        <div className="relative w-fit h-fit self-start justify-self-center row-start-1 pt-5 font-dosis text-offBlack text-base">
          Nothing to see here yet...
        </div>
      )}
    </div>
  );
};

export default Main;
