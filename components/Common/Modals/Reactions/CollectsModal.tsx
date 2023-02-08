import Image from "next/legacy/image";
import React, { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { RootState } from "../../../../redux/store";
import { CollectsModalProps } from "../../types/common.types";
import moment from "moment";
import CollectInfo from "../../Feed/Reactions/CollectInfo";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/router";

const CollectsModal: FunctionComponent<CollectsModalProps> = ({
  collectors,
  getMorePostCollects,
  approveCurrency,
  handleCollect,
  collectInfoLoading,
  postCollectInfoLoading,
  collectLoading,
  approvalLoading,
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.postCollectValuesReducer
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensProfile: string = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  return (
    <div className="inset-0 justify-center fixed z-40 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2">
        <div className="relative bg-white w-full h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center grid grid-flow-row auto-rows-auto gap-10 pb-8">
            <div
              className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer"
              onClick={() =>
                dispatch(
                  setReactionState({
                    actionOpen: false,
                    actionType: "collect",
                    actionValue: pubId,
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            {!postCollectInfoLoading && collectors.length > 0 && (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto">
                <InfiniteScroll
                  hasMore={true}
                  dataLength={collectors.length}
                  next={getMorePostCollects}
                  loader={<FetchMoreLoading />}
                  height={"10rem"}
                  className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto px-4 gap-2"
                >
                  {collectors?.map((collector: any, index: number) => {
                    let profileImage: string;
                    if (
                      !(collector?.defaultProfile?.picture as any)?.original
                    ) {
                      profileImage = "";
                    } else if (
                      (collector?.defaultProfile?.picture as any)?.original
                    ) {
                      if (
                        (
                          collector?.defaultProfile?.picture as any
                        )?.original?.url.includes("http")
                      ) {
                        profileImage = (
                          collector?.defaultProfile?.picture as any
                        )?.original.url;
                      } else {
                        const cut = (
                          collector?.defaultProfile?.picture as any
                        ).original.url.split("/");
                        profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
                      }
                    } else {
                      profileImage = (collector?.defaultProfile?.picture as any)
                        ?.uri;
                    }
                    return (
                      <div
                        onClick={() =>
                          router.push(
                            `/profile/${
                              collector?.defaultProfile?.handle.split("lens")[0]
                            }`
                          )
                        }
                        key={index}
                        className="relative w-full h-fit p-2 drop-shadow-lg grid grid-flow-col bg-gray-50 auto-cols-auto rounded-lg border border-gray-50"
                      >
                        <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-1 gap-6">
                          <div
                            className="relative w-8 h-8 rounded-full bg-offBlue col-start-1"
                            id="crt"
                          >
                            {profileImage && (
                              <Image
                                src={profileImage}
                                objectFit="cover"
                                layout="fill"
                                alt="pfp"
                                className="relative w-fit h-fit rounded-full self-center"
                                draggable={false}
                              />
                            )}
                          </div>
                          <div
                            id="handle"
                            className="relative w-fit h-fit place-self-center col-start-2"
                          >
                            @{collector?.defaultProfile?.handle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            )}
            <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-3">
              {!collectInfoLoading ? (
                collectModuleValues?.canCollect ? (
                  <CollectInfo
                    showText={false}
                    buttonText={"Collected"}
                    type={collectModuleValues?.type}
                    canClick={false}
                    collectLoading={collectLoading}
                  />
                ) : (
                  <CollectInfo
                    approvalLoading={approvalLoading}
                    showText={collectors.length > 0 ? false : true}
                    buttonText={
                      collectModuleValues?.type === "FreeCollectModule"
                        ? "Collect"
                        : (collectModuleValues?.endTime &&
                            !moment(collectModuleValues?.endTime).isAfter()) ||
                          collectModuleValues?.totalCollects ===
                            Number(collectModuleValues?.limit)
                        ? "Collect Period Over"
                        : collectModuleValues?.isApproved &&
                          !collectModuleValues?.canCollect
                        ? "Collect"
                        : "Approve"
                    }
                    type={collectModuleValues?.type as string}
                    symbol={collectModuleValues?.amount?.asset?.symbol}
                    value={collectModuleValues?.amount?.value}
                    usd={collectModuleValues?.usd}
                    limit={collectModuleValues?.limit}
                    time={collectModuleValues?.endTime}
                    totalCollected={collectModuleValues?.totalCollects}
                    canClick={
                      (isConnected &&
                        lensProfile &&
                        collectModuleValues?.endTime &&
                        !moment(collectModuleValues?.endTime).isAfter()) ||
                      (isConnected &&
                        lensProfile &&
                        Number(collectModuleValues?.limit) > 0 &&
                        Number(collectModuleValues?.totalCollects) ===
                          Number(collectModuleValues?.limit))
                        ? false
                        : true
                    }
                    isApproved={collectModuleValues?.isApproved}
                    approveCurrency={approveCurrency}
                    handleCollect={handleCollect}
                    collectLoading={collectLoading}
                  />
                )
              ) : (
                <div className="relative  w-[40vw] md:w-full h-60 grid grid-flow-col auto-cols-auto">
                  <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                    <AiOutlineLoading color="black" size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectsModal;
