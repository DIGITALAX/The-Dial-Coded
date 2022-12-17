import moment from "moment";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import { AiFillEye } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { setCommentShow } from "../../../../redux/reducers/commentShowSlice";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { RootState } from "../../../../redux/store";
import Reactions from "../../Feed/Reactions/Reactions";
import { CommentsModalProps } from "../../types/common.types";
import { MediaSet } from "../../types/lens.types";

const CommentsModal: FunctionComponent<CommentsModalProps> = ({
  commentors,
  getMorePostComments,
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const router = useRouter();
  const viewerOpen = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const pubId = useSelector((state: RootState) => state.app.commentShowReducer.value)
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[70vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2">
        <div className="relative bg-white w-full h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center grid grid-flow-row auto-rows-auto gap-10 pb-8">
            <div
              className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer"
              onClick={() =>
                dispatch(
                  setCommentShow({
                    actionOpen: false,
                    actionType: "comment",
                    actionValue: pubId,
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            {commentors.length > 0 ? (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto">
                <InfiniteScroll
                  hasMore={true}
                  dataLength={commentors.length}
                  next={getMorePostComments}
                  loader={""}
                  height={"25rem"}
                  className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto px-4 gap-3"
                >
                  {commentors?.map((commentor: any, index: number) => {
                    let profileImage: string;
                    if (!(commentor?.profile?.picture as any)?.original) {
                      profileImage = "";
                    } else if ((commentor?.profile?.picture as any)?.original) {
                      if (
                        (
                          commentor?.profile?.picture as any
                        )?.original?.url.includes("http")
                      ) {
                        profileImage = (commentor?.profile?.picture as any)
                          ?.original.url;
                      } else {
                        const cut = (
                          commentor?.profile?.picture as any
                        )?.original.url?.split("/");
                        profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
                      }
                    } else {
                      profileImage = (commentor?.profile?.picture as any)?.uri;
                    }
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-fit rounded-md grid grid-flow-row auto-rows-auto p-6 bg-gradient-to-r from-offBlack via-gray-600 to-black gap-6 border-2 border-black z-0`}
                      >
                        <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto">
                          <div
                            className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer hover:opacity-70 active:scale-95"
                            onClick={() =>
                              router.push(
                                `/profile/${
                                  (commentor?.profile?.handle).split(".lens")[0]
                                }`
                              )
                            }
                          >
                            <div className="relative w-full h-full col-start-1 self-center justify-self-start grid grid-flow-col auto-cols-auto">
                              <div
                                className={`relative rounded-full flex bg-white w-fit h-fit place-self-center col-start-1 ${
                                  profileImage !== ""
                                    ? "w-fit h-fit"
                                    : "w-6 h-6"
                                }`}
                              >
                                {profileImage !== "" && (
                                  <Image
                                    src={profileImage}
                                    width={25}
                                    height={25}
                                    alt="pfp"
                                    className="relative w-fit h-fit rounded-full self-center"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="relative w-fit h-fit col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
                              <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-base self-center">
                                {commentor?.profile?.name}
                              </div>
                              <div
                                id="username"
                                className={`relative w-fit h-fit ${
                                  commentor.profile?.name
                                    ? "row-start02"
                                    : "row-start-1"
                                } font-dosis text-base self-center`}
                              >
                                @{commentor?.profile?.handle}
                              </div>
                            </div>
                          </div>
                          <div className="relative w-fit h-fit text-white font-dosis justify-self-end self-center">
                            {moment(`${commentor?.createdAt}`).fromNow()}
                          </div>
                        </div>
                        <div className="relative w-full h-fit row-start-2 text-left font-dosis grid grid-flow-row auto-rows-auto gap-6 pl-6">
                          <div className="relative w-full h-fit row-start-1 text-white text-md self-center justify-self-start">
                            {commentor?.metadata?.description}
                          </div>
                          <div className="relative w-full h-fit row-start-2 text-offBlue text-base self-center justify-self-start">
                            {commentor?.metadata?.tags}
                          </div>
                        </div>
                        <div className="relative row-start-3 w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 pl-6 z-10">
                          {commentor?.metadata?.media?.map(
                            (image: MediaSet, index: number) => {
                              let formattedImageURL: string;
                              if (image.original.url.includes("ipfs://")) {
                                formattedImageURL = `${INFURA_GATEWAY}/ipfs/${
                                  image.original.url.split("://")[1]
                                }`;
                              } else {
                                formattedImageURL = image.original.url;
                              }
                              return (
                                <div
                                  key={index}
                                  className={`relative w-60 h-60 border-2 border-black rounded-lg bg-black grid grid-flow-col auto-cols-auto col-start-${
                                    index + 1
                                  } cursor-pointer hover:opacity-70 active:scale-95`}
                                  onClick={() =>
                                    dispatch(
                                      setImageViewer({
                                        actionOpen: true,
                                        actionImage: formattedImageURL,
                                      })
                                    )
                                  }
                                >
                                  <div className="relative w-full h-full col-start-1 flex">
                                    <Image
                                      src={formattedImageURL}
                                      layout="fill"
                                      objectFit="cover"
                                      objectPosition={"center"}
                                      className="rounded-md"
                                    />
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                        <div className="relative w-full h-fit row-start-4 grid grid-flow-col auto-cols-auto pl-6">
                          <Reactions
                            textColor={"white"}
                            commentColor={"#FBEED1"}
                            mirrorColor={"#FEEA66"}
                            collectColor={"#81A8F8"}
                            heartColor={"red"}
                            mirrorAmount={
                              commentor?.stats?.totalAmountOfMirrors
                            }
                            collectAmount={
                              commentor?.stats?.totalAmountOfCollects
                            }
                            commentAmount={
                              commentor?.stats?.totalAmountOfComments
                            }
                            mirrorExpand={setReactionState}
                            collectExpand={setReactionState}
                            commentExpand={setCommentShow}
                            dispatch={dispatch}
                            mirrorValue={commentor?.id}
                            collectValue={commentor?.id}
                            commentValue={commentor?.id}
                            canCollect={
                              commentor.collectModule.__typename !==
                              "RevertCollectModuleSettings"
                                ? true
                                : false
                            }
                          />
                          <div
                            className="relative w-fit h-fit col-start-2 justify-self-end self-center text-white grid grid-flow-col auto-cols-auto font-digiR gap-1 cursor-pointer hover:opacity-70 active:scale-95"
                            onClick={() => {
                              viewerOpen
                                ? {}
                                : router.push(`/post/${commentor?.id}`);
                            }}
                          >
                            <div className="relative w-fit h-fit col-start-1 text-sm">
                              View Comment
                            </div>
                            <div className="relative w-fit h-fit col-start-2">
                              <AiFillEye color="white" size={20} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </InfiniteScroll>
                <div className="relative w-fit h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3 place-self-center">
                  <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                    Have something to say?
                  </div>
                  <div className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95">
                    <div className="relative w-fit h-fit col-start-1 place-self-center">
                      Comment
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3">
                <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                  No comments yet. Have something to say?
                </div>
                <div className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95">
                  <div className="relative w-fit h-fit col-start-1 place-self-center">
                    Comment
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
