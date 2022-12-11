import { FunctionComponent } from "react";
import {
  BsSuitHeartFill,
  BsSuitHeart,
  BsCollection,
  BsFillCollectionFill,
} from "react-icons/bs";
import { FaRegCommentDots, FaCommentDots } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { ReactionProps } from "../../types/common.types";

const Reactions: FunctionComponent<ReactionProps> = ({
  textColor,
  commentColor,
  mirrorColor,
  heartColor,
  collectColor
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit col-start-1 justify-self-start self-center grid grid-flow-col auto-cols-auto gap-4">
      <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
        <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
          <BsSuitHeart color={heartColor} size={15} />
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          100
        </div>
      </div>
      <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
        <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
          <FaRegCommentDots color={commentColor} size={15} />
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          100
        </div>
      </div>
      <div className="relative w-fit h-fit col-start-3 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
        <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
          <AiOutlineRetweet color={mirrorColor} size={15} />
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          100
        </div>
      </div>
      <div className="relative w-fit h-fit col-start-4 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
        <div className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95">
          <BsCollection size={15} color={collectColor} />
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center`}
        >
          100
        </div>
      </div>
    </div>
  );
};

export default Reactions;
