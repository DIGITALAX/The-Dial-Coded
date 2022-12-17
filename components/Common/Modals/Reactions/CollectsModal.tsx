import Image from "next/legacy/image";
import Link from "next/link";
import React, { FunctionComponent, useEffect } from "react";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { RootState } from "../../../../redux/store";
import { CollectsModalProps } from "../../types/common.types";
import moment from "moment";

const CollectsModal: FunctionComponent<CollectsModalProps> = ({
  collectors,
  getMorePostCollects,
  usdValue,
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.postCollectValuesReducer
  );
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2">
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
            {collectors.length > 0 ? (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto">
                <InfiniteScroll
                  hasMore={true}
                  dataLength={collectors.length}
                  next={getMorePostCollects}
                  loader={""}
                  height={"10rem"}
                  className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto px-4"
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
                      <Link
                        href={`/profile/${
                          collector?.defaultProfile?.handle.split("lens")[0]
                        }`}
                        key={index}
                        className="relative w-full h-fit p-2 drop-shadow-lg grid grid-flow-col bg-gray-50 auto-cols-auto rounded-lg border border-gray-50"
                      >
                        <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-1 gap-6">
                          <div className="relative w-8 h-8 rounded-full bg-offBlue col-start-1">
                            <Image
                              src={profileImage}
                              objectFit="cover"
                              layout="fill"
                              alt="pfp"
                              className="relative w-fit h-fit rounded-full self-center"
                            />
                          </div>
                          <div
                            id="handle"
                            className="relative w-fit h-fit place-self-center col-start-2"
                          >
                            @{collector?.defaultProfile?.handle}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </InfiniteScroll>
                <div className="relative w-fit h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3 place-self-center">
                  <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                    Collect this post?
                  </div>
                  <div className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95">
                    <div className="relative w-fit h-fit col-start-1 place-self-center">
                      Collect
                    </div>
                  </div>
                </div>
              </div>
            ) : collectModuleValues?.type === "FreeCollectModule" ? (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3">
                <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                  This post hasn&apos;t been collected. Will you be first?
                </div>
                <div className="relative w-fit h-fit row-start-2 place-self-center grid grid-flow-col auto-cols-auto py-2 bg-gray-50 rounded-md px-2 drop-shadow-lg">
                  <div className="relative w-44 h-60 flex col-start-1 place-self-center p-2">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/QmcHYeemWE3z8qy7m42pJbasYzyvMRWNPRMfXvSNz6XKoK`}
                      layout="fill"
                      objectFit="cover"
                      className="relative w-fit h-fit flex"
                    />
                  </div>
                </div>
                <div className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95 row-start-3">
                  <div className="relative w-fit h-fit col-start-1 place-self-center">
                    Collect
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-6">
                <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                  This post hasn&apos;t been collected. Will you be first?
                </div>
                <div className="relative w-fit h-fit row-start-2 place-self-center grid grid-flow-col auto-cols-auto gap-2 py-2 bg-gray-50 rounded-md px-2 drop-shadow-lg">
                  <div className="relative w-fit h-fit col-start-1 place-self-center grid grid-flow-col auto-cols-auto row-start-1 row-span-2 pr-3">
                    <div className="relative w-44 h-60 flex col-start-1 place-self-center">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/QmcHYeemWE3z8qy7m42pJbasYzyvMRWNPRMfXvSNz6XKoK`}
                        layout="fill"
                        objectFit="cover"
                        className="relative w-fit h-fit flex"
                      />
                    </div>
                  </div>
                  <div className="relative w-fit h-fit col-start-2 row-start-1 grid grid-flow-row auto-rows-auto">
                    <div className="relative w-fit h-fit text-offBlack font-digiB text-4xl self-center justify-self-start row-start-1">
                      {collectModuleValues?.amount?.value}{" "}
                      {collectModuleValues?.amount?.asset?.symbol}
                    </div>
                    <div className="relative w-fit h-fit text-offBlack/70 font-dosis text-sm place-self-center row-start-2 pr-2">
                      ${String(usdValue).slice(0, 6)}
                    </div>
                  </div>
                  {(collectModuleValues?.limit ||
                    collectModuleValues?.endTime) && (
                    <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto place-self-center row-start-2 font-digiR text-base text-offBlack gap-3">
                      {collectModuleValues?.limit && (
                        <div className="relative w-fit h-fit col-start-1 place-self-center">
                          Limited Edition: {collectModuleValues?.limit}
                        </div>
                      )}
                      {collectModuleValues?.endTime &&
                        moment(collectModuleValues.endTime).isAfter() && (
                          <div
                            className={`relative w-fit h-fit ${
                              collectModuleValues?.limit
                                ? "col-start-2"
                                : "col-start-1"
                            } place-self-center grid grid-flow-row auto-rows-auto`}
                          >
                            <div className="relative w-fit h-fit row-start-1 place-self-center font-digiB">
                              TIME TO COLLECT:
                            </div>
                            <div className="relative w-fit h-fit row-start-2 place-self-center">
                              {moment(
                                `${collectModuleValues?.endTime}`
                              ).fromNow()}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
                {!collectModuleValues?.endTime ? (
                  <div className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95 row-start-3">
                    <div className="relative w-fit h-fit col-start-1 place-self-center">
                      Collect
                    </div>
                  </div>
                ) : moment(collectModuleValues.endTime).isAfter() ? (
                  <div className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95 row-start-3">
                    <div className="relative w-fit h-fit col-start-1 place-self-center">
                      Collect
                    </div>
                  </div>
                ) : (
                  <div className="relative w-fit px-1 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center row-start-3 opacity-70">
                    <div className="relative w-fit h-fit col-start-1 place-self-center">
                      Collect Period is Over
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectsModal;
