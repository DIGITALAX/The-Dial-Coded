import { FunctionComponent, useEffect, useState } from "react";
import {
  BsSuitHeartFill,
  BsSuitHeart,
  BsCollection,
  BsFillCollectionFill,
} from "react-icons/bs";
import { FaRegCommentDots, FaCommentDots } from "react-icons/fa";
import {
  AiOutlineLoading,
  AiOutlineMinusCircle,
  AiOutlineRetweet,
} from "react-icons/ai";
import { ReactionProps } from "../../types/common.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useRouter } from "next/router";

const Reactions: FunctionComponent<ReactionProps> = ({
  textColor,
  commentColor,
  mirrorColor,
  heartColor,
  collectColor,
  mirrorAmount,
  collectAmount,
  heartAmount,
  commentAmount,
  mirrorExpand,
  heartExpand,
  collectExpand,
  commentExpand,
  dispatch,
  mirrorValue,
  collectValue,
  commentValue,
  heartValue,
  canCollect,
  hasCollected,
  hasReacted,
  hasMirrored,
  hasCommented,
  handleHidePost,
  id,
  canDelete,
  followerOnly,
  isMixtape,
  reactionLoaded,
}): JSX.Element => {
  const inCommentBox = useSelector(
    (state: RootState) => state.app.commentShowReducer
  );
  const router = useRouter();
  return (
    <div
      className={`relative w-fit h-fit col-start-1 ${
        router.asPath?.includes("mixtape")
          ? "justify-self-start"
          : "justify-self-center"
      } grid grid-flow-col auto-cols-auto gap-4`}
    >
      <div
        className="relative w-fit h-fit col-start-1 row-start-1 grid grid-flow-col auto-cols-auto gap-2 place-self-center"
        onClick={
          inCommentBox.open
            ? () => {
                router.push(`/post/${id}`);
                commentExpand &&
                  dispatch &&
                  dispatch(
                    commentExpand({
                      actionOpen: false,
                      actionType: "comment",
                      actionValue: commentValue,
                    })
                  );
              }
            : () => {
                heartExpand &&
                  dispatch &&
                  dispatch(
                    heartExpand({
                      actionOpen: true,
                      actionType: "heart",
                      actionValue: heartValue,
                      actionResponseReact: hasReacted,
                    })
                  );
              }
        }
      >
        <div
          className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
            !reactionLoaded && "animate-spin"
          }`}
        >
          {reactionLoaded ? (
            heartAmount && heartAmount > 0 && hasReacted ? (
              <BsSuitHeartFill size={15} color={heartColor} />
            ) : (
              <BsSuitHeart color={heartColor} size={15} />
            )
          ) : (
            <AiOutlineLoading color="black" size={10} />
          )}
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          {!heartAmount ? 0 : heartAmount}
        </div>
      </div>
      <div
        className={`relative w-fit h-fit row-start-1 col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
        onClick={
          router.asPath.includes("post") ||
          router.asPath.includes("mixtape") ||
          inCommentBox?.open
            ? () => {
                router.push(`/post/${id}`);
                commentExpand &&
                  dispatch &&
                  dispatch(
                    commentExpand({
                      actionOpen: false,
                      actionType: "comment",
                      actionValue: commentValue,
                      actionFollower: followerOnly,
                      actionMixtape: isMixtape,
                    })
                  );
              }
            : () => {
                commentExpand &&
                  dispatch &&
                  dispatch(
                    commentExpand({
                      actionOpen: true,
                      actionType: "comment",
                      actionValue: commentValue,
                      actionMixtape: isMixtape,
                    })
                  );
              }
        }
      >
        <div
          className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
            followerOnly && "opacity-50"
          }`}
        >
          {commentAmount && commentAmount > 0 && hasCommented ? (
            <FaCommentDots size={15} color={commentColor} />
          ) : (
            <FaRegCommentDots color={commentColor} size={15} />
          )}
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          {commentAmount}
        </div>
      </div>
      <div
        className={`relative w-fit h-fit row-start-2 col-start-1 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
        onClick={
          inCommentBox.open
            ? () => {
                router.push(`/post/${id}`);
                commentExpand &&
                  dispatch &&
                  dispatch(
                    commentExpand({
                      actionOpen: false,
                      actionType: "comment",
                      actionValue: commentValue,
                    })
                  );
              }
            : () => {
                mirrorExpand &&
                  dispatch &&
                  dispatch(
                    mirrorExpand({
                      actionOpen: true,
                      actionType: "mirror",
                      actionValue: mirrorValue,
                      actionResponseMirror: hasMirrored,
                      actionFollower: followerOnly,
                    })
                  );
              }
        }
      >
        <div
          className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
            followerOnly && "opacity-50"
          }`}
        >
          <AiOutlineRetweet
            color={
              mirrorAmount && mirrorAmount > 0 && hasMirrored
                ? "red"
                : mirrorColor
            }
            size={15}
          />
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          {mirrorAmount}
        </div>
      </div>
      {canCollect && (
        <div
          className={`relative w-fit h-fit row-start-2 col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
          onClick={
            inCommentBox.open
              ? () => {
                  router.push(`/post/${id}`);
                  commentExpand &&
                    dispatch &&
                    dispatch(
                      commentExpand({
                        actionOpen: false,
                        actionType: "comment",
                        actionValue: commentValue,
                      })
                    );
                }
              : () => {
                  collectExpand &&
                    dispatch &&
                    dispatch(
                      collectExpand({
                        actionOpen: true,
                        actionType: "collect",
                        actionValue: collectValue,
                      })
                    );
                }
          }
        >
          <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
            {collectAmount && collectAmount > 0 && hasCollected ? (
              <BsFillCollectionFill size={15} color={collectColor} />
            ) : (
              <BsCollection size={15} color={collectColor} />
            )}
          </div>
          <div
            className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
          >
            {collectAmount}
          </div>
        </div>
      )}
      {canDelete && (
        <div
          className={`relative w-fit h-fit row-start-3 col-start-1 col-span-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center cursor-pointer active:scale-95`}
          onClick={() => handleHidePost(id as string, dispatch)}
        >
          <AiOutlineMinusCircle color={textColor} size={15} />
        </div>
      )}
    </div>
  );
};

export default Reactions;
