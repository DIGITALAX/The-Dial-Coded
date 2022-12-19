import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../../Common/Feed/FeedPublication";
import { PublicationsQueryRequest } from "../../../../Common/types/lens.types";
import { StatsTabProps } from "../types/account.types";

const StatsTab: FunctionComponent<StatsTabProps> = ({
  profile,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-6">
      <div className="relative w-fit h-fit row-start-1 grid grid-flow-row auto-rows-auto place-self-start gap-4">
        <div className="relative w-fit h-fit row-start-1 col-start-1 text-offBlack text-md grid grid-flow-row auto-rows-auto justify-self-start self-center gap-2">
          <div className="relative w-fit h-fit row-start-1 place-self-center font-digiR">
            Total Followers
          </div>
          <div className="relative w-fit h-fit row-start-1 place-self-center font-digiB">
            {profile?.stats?.totalFollowers}
          </div>
        </div>
        <div className="relative w-fit h-fit row-start-1 col-start-2 text-offBlack text-md grid grid-flow-row auto-rows-auto justify-self-start self-center gap-2">
          <div className="relative w-fit h-fit row-start-1 place-self-center font-digiR">
            Total Following
          </div>
          <div className="relative w-fit h-fit row-start-1 place-self-center font-digiB">
            {profile?.stats?.totalFollowing}
          </div>
        </div>
        <div className="relative w-fit h-fit row-start-2 text-offBlack text-md grid grid-flow-row auto-rows-auto justify-self-start self-center gap-2">
          <div className="relative w-fit h-fit row-start-1 place-self-center font-digiR">
            Total Following
          </div>
          <div className="relative w-fit h-fit row-start-1 place-self-center font-digiB">
            {profile?.stats?.totalFollowing}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
