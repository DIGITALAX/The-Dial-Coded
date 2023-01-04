import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { HotPublicationProps } from "../../types/common.types";
import Reactions from "../Reactions/Reactions";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { setCommentShow } from "../../../../redux/reducers/commentShowSlice";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useAccount } from "wagmi";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";

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
  const profileImage = createProfilePicture(data, true);

  const viewerOpen = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const { address } = useAccount();
  return (
    <div
      id="add"
      className={`relative ${
        width ? `w-${width}` : "w-full"
      } h-${height} border-2 border-black rounded-md p-4 grid grid-flow-row auto-rows-auto`}
    >
      <Image
        src={`${INFURA_GATEWAY}/ipfs/${image}`}
        layout="fill"
        alt={image}
        objectFit="cover"
        objectPosition={"center"}
        className="rounded absolute"
      />
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto row-start-1 gap-2 text-xs">
        <div
          className="relative col-start-1 row-start-1 grid grid-flow-col auto-cols-auto place-self-start cursor-pointer"
          onClick={() => () =>
            router.push(
              `/profile/${
                data?.__typename !== "Mirror"
                  ? data?.profile?.handle?.split(".lens")[0]
                  : data?.mirrorOf?.profile?.handle?.split(".lens")[0]
              }`
            )}
        >
          <div
            className={`relative rounded-full flex bg-white w-6 h-6 place-self-center col-start-1 border-white border`}
            id="crt"
          >
            {profileImage !== "" && (
              <Image
                src={profileImage}
                objectFit="cover"
                alt="pfp"
                layout="fill"
                className="relative w-fit h-fit rounded-full self-center"
              />
            )}
          </div>
        </div>
        <div className="relative col-start-1 row-start-2 grid grid-flow-col auto-cols-auto text-white font-dosis">
          <div className="relative w-fit h-fit col-start-1 justify-self-start self-center text-xs">
            {moment(`${data?.createdAt}`).fromNow()}
          </div>
        </div>
        <div
          id="record2"
          className="relative w-fit h-fit justify-self-end self-start grid grid-flow-col auto-cols-auto font-dosis text-offBlack rounded-md border border-offBlack px-1.5 py-px row-start-1 col-start-2"
        >
          <div className="relative w-fit h-fit place-self-center col-start-1">
            {data?.metadata?.content?.split("\n\n")[2]?.split(",")[index]}
          </div>
        </div>
        <div
          id="record13"
          className="relative w-fit h-fit justify-self-end self-start grid grid-flow-col auto-cols-auto font-dosis text-offBlack rounded-md border border-offBlack px-1.5 py-px row-start-2 col-start-2"
        >
          <div className="relative w-fit h-fit place-self-center col-start-1">
            {data?.metadata?.name}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto self-end gap-2">
        <div
          className="relative w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto self-end justify-self-start bg-offBlack text-xs text-white p-1 rounded-md cursor-pointer hover:opacity-80"
          onClick={() => {
            viewerOpen ? {} : router.push(`/mixtape/${data?.id}`);
          }}
        >
          <div className="relative w-fit h-fit col-start-1 place-self-center whitespace-nowrap">
            Src: {data?.metadata?.content?.split("\n\n")[0]} ——{" "}
            {data?.metadata?.content?.split("\n\n")[1]}
          </div>
        </div>
        <div
          id="hot"
          className="relative w-full h-fit rounded-lg grid grid-flow-col auto-cols-auto p-2 row-start-2 self-end"
        >
          <Reactions
            textColor={"black"}
            commentColor={"black"}
            mirrorColor={"black"}
            collectColor={"black"}
            heartColor={"black"}
            mirrorAmount={Number(data?.stats?.totalAmountOfMirrors)}
            collectAmount={Number(data?.stats?.totalAmountOfCollects)}
            commentAmount={Number(data?.stats?.totalAmountOfComments)}
            heartAmount={reactionsFeed}
            heartExpand={setReactionState}
            mirrorExpand={setReactionState}
            collectExpand={setReactionState}
            commentExpand={setCommentShow}
            dispatch={dispatch}
            mirrorValue={data?.id}
            collectValue={data?.id}
            commentValue={data?.id}
            heartValue={data?.id}
            canCollect={
              data?.collectModule?.__typename !== "RevertCollectModuleSettings"
                ? true
                : false
            }
            hasCollected={
              data?.__typename === "Mirror"
                ? data?.mirrorOf?.hasCollectedByMe
                : data?.hasCollectedByMe
            }
            hasReacted={hasReacted}
            hasMirrored={hasMirrored}
            hasCommented={hasCommented}
            handleHidePost={handleHidePost}
            canDelete={address === data?.profile?.ownedBy ? true : false}
            followerOnly={false}
          />
        </div>
      </div>
    </div>
  );
};

export default HotPublication;
