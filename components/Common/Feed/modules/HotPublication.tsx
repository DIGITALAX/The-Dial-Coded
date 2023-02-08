import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { HotPublicationProps } from "../../types/common.types";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { setCommentShow } from "../../../../redux/reducers/commentShowSlice";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Profile from "../Profile/Profile";

const HotPublication: FunctionComponent<HotPublicationProps> = ({
  height,
  width,
  data,
  index,
  image,
  reactionsFeed,
  dispatch,
  hasReacted,
  hasMirrored,
  hasCommented,
  handleHidePost,
}): JSX.Element => {
  const router = useRouter();
  const viewerOpen = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  return (
    <div
      id="add"
      className={`relative ${
        width ? `w-${width}` : "w-full"
      } min-h-${height} h-full border-2 border-black rounded-md px-4 py-1.5 grid grid-flow-row auto-rows-auto`}
    >
      <Image
        src={`${INFURA_GATEWAY}/ipfs/${image}`}
        layout="fill"
        alt={image}
        objectFit="cover"
        objectPosition={"center"}
        className="rounded absolute"
        draggable={false}
      />
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-1 gap-2 text-xs">
        <div className="relative col-start-1 row-start-1 grid grid-flow-col auto-cols-auto text-white font-dosis">
          <div className="relative w-fit h-fit col-start-1 justify-self-start self-center text-xs">
            {moment(`${data?.createdAt}`).fromNow()}
          </div>
        </div>
        <div
          id="mixtapeOne"
          className="relative w-fit h-fit justify-self-end self-start grid grid-flow-col auto-cols-auto font-dosis text-offBlack rounded-md border border-offBlack px-1.5 py-px row-start-1 col-start-2"
        >
          <div className="relative w-fit h-fit place-self-center col-start-1">
            {data?.metadata?.content?.split("\n\n")[2]?.split(",")[index]}
          </div>
        </div>
        <div
          id="mixtapeTwo"
          className="relative w-fit h-fit justify-self-end self-start grid grid-flow-col auto-cols-auto font-dosis text-offBlack rounded-md border border-offBlack px-1.5 py-px row-start-2 col-start-2"
        >
          <div className="relative w-fit h-fit place-self-center col-start-1">
            {data?.metadata?.name}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto self-end gap-2">
        <div
          className="relative w-fit h-fit row-start-2 grid grid-flow-col auto-cols-auto self-end justify-self-start bg-offBlack text-xs text-white p-1 rounded-md cursor-pointer hover:opacity-80"
          onClick={() => {
            viewerOpen ? {} : router.push(`/mixtape/${data?.id}`);
          }}
        >
          <div className="relative w-fit h-fit col-start-1 place-self-center whitespace-nowrap">
            Src: {data?.metadata?.content?.split("\n\n")[0]} ——{" "}
            {data?.metadata?.content?.split("\n\n")[1]}
          </div>
        </div>
        <Profile
          publication={data}
          reactionsFeed={reactionsFeed}
          setReactionState={setReactionState}
          handleHidePost={handleHidePost}
          followerOnly={false}
          dispatch={dispatch}
          setCommentShow={setCommentShow}
          hasCommented={hasCommented}
          hasMirrored={hasMirrored}
          hasReacted={hasReacted}
        />
      </div>
    </div>
  );
};

export default HotPublication;
