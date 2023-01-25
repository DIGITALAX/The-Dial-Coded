import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { setFollowModal } from "../../../../redux/reducers/followModalSlice";
import Follows from "../../../Home/Layout/Account/modules/Follows";
import { FollowModalProps } from "../../types/common.types";

const FollowsModal: FunctionComponent<FollowModalProps> = ({
  dispatch,
  followersLoading,
  followingLoading,
  getMoreFollowers,
  getMoreFollowing,
  userFollowing,
  userFollowers,
  type,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className={`relative h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2 ${
          (type === "followers" ? userFollowers : userFollowing)?.length > 0
            ? "w-full md:w-[40vw]"
            : "w-[40vw]"
        }`}
      >
        <div className="relative bg-white w-full h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center grid grid-flow-row auto-rows-auto gap-10 pb-8">
            <div
              className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer"
              onClick={() =>
                dispatch(
                  setFollowModal({
                    actionOpen: false,
                    actionType: type,
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            {!followersLoading && !followingLoading ? (
              (type === "followers" ? userFollowers : userFollowing)?.length >
                0 && (
                <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto">
                  <InfiniteScroll
                    hasMore={true}
                    dataLength={
                      type === "followers"
                        ? userFollowers?.length
                        : userFollowing?.length
                    }
                    next={
                      type === "followers" ? getMoreFollowers : getMoreFollowing
                    }
                    loader={""}
                    height={"10rem"}
                    className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto px-4 gap-2"
                  >
                    {(type === "followers" ? userFollowers : userFollowing).map(
                      (follow: any, index: number) => {
                        return (
                          <Follows
                            key={index}
                            follow={
                              type === "followers"
                                ? follow?.wallet?.defaultProfile
                                : follow?.profile
                            }
                          />
                        );
                      }
                    )}
                  </InfiniteScroll>
                </div>
              )
            ) : (
              <div className="relative w-full h-60 grid grid-flow-col auto-cols-auto">
                <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                  <AiOutlineLoading color="black" size={20} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowsModal;
