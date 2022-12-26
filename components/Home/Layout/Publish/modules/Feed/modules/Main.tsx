import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import { useDispatch, useSelector } from "react-redux";
import FeedPublication from "../../../../../../Common/Feed/FeedPublication";
import { PublicationsQueryRequest } from "../../../../../../Common/types/lens.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { RootState } from "../../../../../../../redux/store";

const Main: FunctionComponent<MainProps> = ({
  publicationsFeed,
  fetchMore,
  isOpen,
  hasMirrored,
  hasReacted,
  reactionsFeed,
  hasCommented,
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div
      className="relative w-[50vw] h-full col-start-1 grid grid-flow-row auto-rows-auto gap-5"
      id="targetDiv"
    >
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
          (publication: PublicationsQueryRequest, index: number) => {
            return (
              <FeedPublication
                dispatch={dispatch}
                publication={publication}
                key={index}
                type={"Post"}
                hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                reactionsFeed={reactionsFeed?.length > 0 && reactionsFeed[index]}
                hasCommented={hasCommented?.length > 0 && hasCommented[index]}
              />
            );
          }
        )}
      </InfiniteScroll>
    </div>
  );
};

export default Main;
