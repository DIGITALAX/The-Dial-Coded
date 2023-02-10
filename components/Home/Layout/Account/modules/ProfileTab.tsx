import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../../Common/Feed/modules/FeedPublication";
import FetchMoreLoading from "../../../../Common/Loaders/FetchMoreLoading";
import ProfileFeedLoading from "../../../../Common/Loaders/ProfileFeedLoading";
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
  firstPostLoad,
  mixtapeLength,
  hasMore,
}): JSX.Element => {
  if (publicationsLoading && firstPostLoad) {
    return <ProfileFeedLoading />;
  }
  return (
    <div
      className={`relative w-full h-full grid grid-flow-row auto-rows-auto`}
    >
      {!profileDataLoading ? (
        <div
          className="relative w-full h-full row-start-1 grid grid-flow-row auto-rows-auto gap-5"
          id="targetProfile"
        >
          <InfiniteScroll
            scrollableTarget={"targetProfile"}
            height={height}
            loader={<FetchMoreLoading />}
            hasMore={hasMore}
            next={getMoreUserProfileFeed}
            dataLength={userFeed?.length}
            className={`relative row-start-1 w-full h-full`}
            style={{ color: "#131313", fontFamily: "Digi Reg" }}
          >
            <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3 overflow-y-scroll">
              {userFeed?.map(
                (publication: PublicationSearchResult, index: number) => {
                  return (
                    <FeedPublication
                      dispatch={dispatch}
                      publication={publication}
                      key={index}
                      type={publication.__typename}
                      hasMirrored={
                        hasMirrored?.length > 0 && hasMirrored[index]
                      }
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
            </div>
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
