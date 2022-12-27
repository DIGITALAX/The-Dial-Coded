import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { StatsTabProps } from "../types/account.types";
import Follows from "./Follows";

const StatsTab: FunctionComponent<StatsTabProps> = ({
  profile,
  userFollowing,
  userFollowers,
  getMoreFollowers,
  getMoreFollowing,
  followersLoading,
  followingLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-6">
      <div className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto place-self-start gap-4">
        <div className="relative w-full h-fit row-start-1 col-start-1 text-offBlack text-xl grid grid-flow-row auto-rows-auto justify-self-start self-center gap-2">
          <div className="relative w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-3">
            <div className="relative w-fit h-fit place-self-center font-digiR col-start-1">
              Total Followers:
            </div>
            <div className="relative w-fit h-fit place-self-center font-digiB col-start-2">
              {profile?.stats?.totalFollowers}
            </div>
          </div>
          {followersLoading ? (
            <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto self-start">
              <div className="relative w-fit h-fit place-self-center animate-spin">
                <AiOutlineLoading size={15} color="black" />
              </div>
            </div>
          ) : (
            <InfiniteScroll
              hasMore={true}
              dataLength={userFollowers?.length}
              next={getMoreFollowers}
              loader={""}
              height={"25rem"}
              className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto gap-3 pt-3 pr-3"
            >
              {userFollowers?.map((follow: any, index: number) => {
                return (
                  <Follows
                    key={index}
                    follow={follow?.wallet?.defaultProfile}
                  />
                );
              })}
            </InfiniteScroll>
          )}
        </div>
        <div className="relative w-full h-fit row-start-1 col-start-2 text-offBlack text-xl grid grid-flow-row auto-rows-auto justify-self-start self-center gap-2">
          <div className="relative w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-3">
            <div className="relative w-fit h-fit place-self-center font-digiR col-start-1">
              Total Following:
            </div>
            <div className="relative w-fit h-fit place-self-center font-digiB col-start-2">
              {profile?.stats?.totalFollowing}
            </div>
          </div>

          {followingLoading ? (
            <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto self-start">
              <div className="relative w-fit h-fit place-self-center animate-spin">
                <AiOutlineLoading size={15} color="black" />
              </div>
            </div>
          ) : (
            <InfiniteScroll
              hasMore={true}
              dataLength={userFollowing?.length}
              next={getMoreFollowing}
              loader={""}
              height={"25rem"}
              className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto pt-3 pr-3 gap-3"
            >
              {userFollowing?.map((follow: any, index: number) => {
                return <Follows key={index} follow={follow?.profile} />;
              })}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
