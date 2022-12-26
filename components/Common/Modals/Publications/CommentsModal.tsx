import React, { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { setCommentShow } from "../../../../redux/reducers/commentShowSlice";
import { RootState } from "../../../../redux/store";
import { CommentsModalProps } from "../../types/common.types";
import FeedPublication from "../../Feed/FeedPublication";
import { useRouter } from "next/router";
import { AiOutlineLoading } from "react-icons/ai";

const CommentsModal: FunctionComponent<CommentsModalProps> = ({
  commentors,
  getMorePostComments,
  commentInfoLoading,
  hasMirrored,
  hasReacted,
  hasCommented,
  reactionsFeed
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const pubId = useSelector((state: RootState) => state.app.commentShowReducer);
  const router = useRouter();
  return (
    <div
      className={`inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto`}
    >
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
                    actionValue: pubId.value,
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            {!commentInfoLoading ? (
              <>
                {commentors.length > 0 && (
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
                        return (
                          <FeedPublication
                            dispatch={dispatch}
                            publication={commentor}
                            key={index}
                            type={"comment"}
                            hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
                            hasReacted={hasReacted?.length > 0 && hasReacted[index]}
                            hasCommented={hasCommented?.length > 0 && hasCommented[index]}
                            reactionsFeed={reactionsFeed?.length > 0 && reactionsFeed[index]}
                          />
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                )}
                <div
                  className={`relative w-full h-fit ${
                    commentors?.length > 0 ? "row-start-3" : "row-start-2"
                  } grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3`}
                >
                  <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                    {commentors?.length > 0
                      ? " Have something to say?"
                      : " No comments yet. Have something to say?"}
                  </div>
                  <div
                    className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95"
                    onClick={() => {
                      router.push(`/post/${pubId?.value}`);
                      dispatch(
                        setCommentShow({
                          actionOpen: false,
                          actionType: "comment",
                          actionValue: pubId?.value,
                        })
                      );
                    }}
                  >
                    <div className="relative w-fit h-fit col-start-1 place-self-center">
                      Comment
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative w-full h-60 grid grid-flow-col auto-cols-auto ">
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

export default CommentsModal;
