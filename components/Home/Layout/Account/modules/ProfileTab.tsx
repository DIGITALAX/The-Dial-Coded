import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../../Common/Feed/FeedPublication";
import { PublicationsQueryRequest } from "../../../../Common/types/lens.types";
import { ProfileTabProps } from "../types/account.types";

const ProfileTab: FunctionComponent<ProfileTabProps> = ({
  getMoreUserProfileFeed,
  userFeed,
  dispatch,
  height,
  hasMirrored,
  hasCommented,
  hasReacted,
  reactionsFeed,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-full grid grid-flow-row auto-rows-auto ${
        height !== undefined && "gap-6"
      }`}
    >
      <div
        className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto gap-5"
        id="targetDiv"
      >
        <InfiniteScroll
          scrollableTarget={"targetDiv"}
          height={height}
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
                  type={"Post"}
                  hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                  hasCommented={hasCommented?.length > 0 && hasCommented[index]}
                  hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                  reactionsFeed={
                    reactionsFeed?.length > 0 && reactionsFeed[index]
                  }
                />
              );
            }
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProfileTab;
