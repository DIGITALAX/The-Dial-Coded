import { FunctionComponent, useMemo } from "react";
import {
  BsSuitHeartFill,
  BsSuitHeart,
  BsCollection,
  BsFillCollectionFill,
} from "react-icons/bs";
import { FaRegCommentDots, FaCommentDots } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
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
}): JSX.Element => {
  const inCommentBox = useSelector(
    (state: RootState) => state.app.commentShowReducer
  );
  const router = useRouter();
  return (
    <div className="relative w-fit h-fit col-start-1 justify-self-start self-center grid grid-flow-col auto-cols-auto gap-4">
      <div
        className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-2 place-self-center"
        onClick={() => {
          heartExpand &&
            dispatch &&
            dispatch(
              heartExpand({
                actionOpen: true,
                actionType: "heart",
                actionValue: heartValue,
              })
            );
        }}
      >
        <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
          {heartAmount && heartAmount > 0 && hasReacted ? (
            <BsSuitHeartFill size={15} color={heartColor} />
          ) : (
            <BsSuitHeart color="yellow" size={15} />
          )}
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          {heartAmount ? heartAmount : 0}
        </div>
      </div>
      <div
        className={`relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
        onClick={() => {
          !inCommentBox?.open
            ? commentExpand &&
              dispatch &&
              dispatch(
                commentExpand({
                  actionOpen: true,
                  actionType: "comment",
                  actionValue: commentValue,
                })
              )
            : router.push(`/post/${inCommentBox?.value}`);
        }}
      >
        <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
          {commentAmount && commentAmount > 0 ? (
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
        className={`relative w-fit h-fit col-start-3 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
        onClick={() => {
          mirrorExpand &&
            dispatch &&
            dispatch(
              mirrorExpand({
                actionOpen: true,
                actionType: "mirror",
                actionValue: mirrorValue,
              })
            );
        }}
      >
        <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
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
          className={`relative w-fit h-fit col-start-4 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
          onClick={() => {
            collectExpand &&
              dispatch &&
              dispatch(
                collectExpand({
                  actionOpen: true,
                  actionType: "collect",
                  actionValue: collectValue,
                })
              );
          }}
        >
          <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
            {collectAmount && collectAmount > 0 && hasCollected ? (
              <BsFillCollectionFill size={15} color={collectColor} />
            ) : (
              <BsCollection size={15} color="yellow" />
            )}
          </div>
          <div
            className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
          >
            {collectAmount}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reactions;
