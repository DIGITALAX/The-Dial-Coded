import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../../Common/Feed/modules/FeedPublication";
import PostFeedLoading from "../../../../Common/Loaders/PostFeedLoading";
import { PublicationSearchResult } from "../../../../Common/types/lens.types";
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
  profileDataLoading,
  mixtapeMirror,
  handleHidePost,
  followerOnly,
  publicationsLoading,
}): JSX.Element => {
  if (publicationsLoading) {
    return <PostFeedLoading />;
  }

  return (
    <div
      className={`relative w-full h-fit grid grid-flow-row auto-rows-auto ${
        height !== undefined && "gap-6"
      }`}
    >
      {!profileDataLoading ? (
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
              (publication: PublicationSearchResult, index: number) => {
                return (
                  <FeedPublication
                    dispatch={dispatch}
                    publication={publication}
                    key={index}
                    type={publication.__typename}
                    hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                    hasCommented={
                      hasCommented?.length > 0 && hasCommented[index]
                    }
                    hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                    reactionsFeed={
                      reactionsFeed?.length > 0 && reactionsFeed[index]
                    }
                    mixtapeMirror={
                      mixtapeMirror?.length > 0 && mixtapeMirror[index]
                    }
                    handleHidePost={handleHidePost}
                    followerOnly={
                      followerOnly?.length > 0 && followerOnly[index]
                    }
                  />
                );
              }
            )}
          </InfiniteScroll>
        </div>
      ) : (
        <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto self-start justify-self-center">
          <div className="relative w-fit h-fit place-self-center row-start-1 animate-spin">
            <AiOutlineLoading size={25} color="black" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
