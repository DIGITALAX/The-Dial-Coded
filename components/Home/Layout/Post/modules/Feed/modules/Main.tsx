import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import { useDispatch, useSelector } from "react-redux";
import FeedPublication from "../../../../../../Common/Feed/FeedPublication";
import {
  Post,
  PublicationsQueryRequest,
} from "../../../../../../Common/types/lens.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { RootState } from "../../../../../../../redux/store";

const Main: FunctionComponent<MainProps> = ({
  publicationsFeed,
  fetchMorePublications,
  isOpen,
  fetchReactions,
  getMoreFeedTimeline,
  getMoreUserSelectFeed,
  userSelectFeed,
  didMirror,
  getMoreMirrors
}): JSX.Element => {
  const dispatch = useDispatch();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const viewerFeed = useSelector(
    (state: RootState) => state.app.userViewerReducer.value
  );
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
        next={
          !lensProfile
            ? fetchMorePublications
            : viewerFeed !== "Select User"
            ? getMoreUserSelectFeed
            : getMoreFeedTimeline
        }
        dataLength={
          viewerFeed !== "Select User"
            ? userSelectFeed?.length
            : publicationsFeed?.length
        }
        className={`relative row-start-1 w-full h-full overflow-y-scroll grid grid-flow-row auto-rows-auto gap-3`}
        style={{ color: "#131313", fontFamily: "Digi Reg" }}
      >
        {(viewerFeed !== "Select User"
          ? userSelectFeed
          : publicationsFeed
        )?.map((publication: PublicationsQueryRequest, index: number) => {
          return (
            <FeedPublication
              dispatch={dispatch}
              publication={publication}
              key={index}
              fetchReactions={fetchReactions}
              type={"post"}
              didMirror={didMirror}
              getMoreMirrors={getMoreMirrors}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Main;
