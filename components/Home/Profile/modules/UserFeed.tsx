import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../Common/Feed/FeedPublication";
import { PublicationsQueryRequest } from "../../../Common/types/lens.types";

const UserFeed: FunctionComponent = ({
  dispatch,
  getMoreUserProfileFeed,
  userFeed,
  fetchReactions,
  didMirror,
  getMoreMirrors,
}): JSX.Element => {
  return (
    <div className="col-start-2 relative w-full h-full grid grid-flow-row auto-rows-auto gap-6">
      <div
        className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto gap-5"
        id="targetDiv"
      >
        <InfiniteScroll
          scrollableTarget={"targetDiv"}
          height={undefined}
          loader={""}
          hasMore={true}
          next={getMoreUserProfileFeed}
          dataLength={userFeed?.length}
          className={`relative row-start-1 w-full h-full overflow-y-scroll grid grid-flow-row auto-rows-auto gap-3`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
        >
          {userFeed?.map(
            (publication: PublicationsQueryRequest, index: number) => {
              return (
                <FeedPublication
                  dispatch={dispatch}
                  publication={publication}
                  key={index}
                  fetchReactions={fetchReactions}
                  type={"Post"}
                  didMirror={didMirror}
                  getMoreMirrors={getMoreMirrors}
                />
              );
            }
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default UserFeed;
