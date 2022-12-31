import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import { useDispatch } from "react-redux";
import FeedPublication from "../../../../../../Common/Feed/modules/FeedPublication";
import { PublicationSearchResult } from "../../../../../../Common/types/lens.types";
import InfiniteScroll from "react-infinite-scroll-component";

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
  handleHidePost
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div
      className="relative w-[50vw] h-full col-start-1 grid grid-flow-row auto-rows-auto gap-5"
      id="targetDiv"
    >
      {!noUserData ? (
        <InfiniteScroll
          scrollableTarget={"targetDiv"}
          height={isOpen ? undefined : "100rem"}
          loader={""}
          hasMore={true}
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
                  type={"Post"}
                  hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                  hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                  reactionsFeed={
                    reactionsFeed?.length > 0 && reactionsFeed[index]
                  }
                  hasCommented={hasCommented?.length > 0 && hasCommented[index]}
                  mixtapeMirror={
                    mixtapeMirror?.length > 0 && mixtapeMirror[index]
                  }
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
