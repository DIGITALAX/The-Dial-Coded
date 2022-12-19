import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../../Common/Feed/FeedPublication";
import { PublicationsQueryRequest } from "../../../../Common/types/lens.types";
import { ProfileTabProps } from "../types/account.types";

const ProfileTab: FunctionComponent<ProfileTabProps> = ({
  profile,
  getMoreUserProfileFeed,
  userFeed,
  dispatch,
  fetchReactions,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-6">   
      <div
        className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto gap-5"
        id="targetDiv"
      >
        <InfiniteScroll
          scrollableTarget={"targetDiv"}
          height={"44rem"}
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
                  type={"post"}
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
