import Image from "next/legacy/image";
import { FunctionComponent, useMemo, useState } from "react";
import Reactions from "./Reactions/Reactions";
import { FeedPublicationProps } from "../types/common.types";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { MediaSet } from "../types/lens.types";
import { setImageViewer } from "../../../redux/reducers/imageViewerSlice";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import { setReactionState } from "../../../redux/reducers/reactionStateSlice";
import { setCommentShow } from "../../../redux/reducers/commentShowSlice";
import moment from "moment";
import lodash from "lodash";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  publication,
  dispatch,
  fetchReactions,
  didMirror,
  type,
  getMoreMirrors
}): JSX.Element => {
  let imagePrefix: any;
  let profileImage: string;
  if ((publication as any)?.__typename === "Mirror") {
    imagePrefix = (publication as any)?.mirrorOf?.profile?.picture;
  } else {
    imagePrefix = (publication as any)?.profile?.picture;
  }
  if (!imagePrefix?.original) {
    profileImage = "";
  } else if (imagePrefix?.original) {
    if ((publication as any)?.profile.picture?.original?.url.includes("http")) {
      profileImage = imagePrefix?.original.url;
    } else {
      const cut = (publication as any)?.profile?.picture?.original?.url.split(
        "/"
      );
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
    }
  } else {
    profileImage = imagePrefix?.uri;
  }
  const router = useRouter();
  const viewerOpen = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const reactionState = useSelector(
    (state: RootState) => state.app.reactionStateReducer.open
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const [reaction, setReaction] = useState<number>();
  const [hasReacted, setHasReacted] = useState<any[]>([]);
  useMemo(async () => {
    const reactionArr = await fetchReactions((publication as any)?.id);
    const reactionLength = reactionArr.length;
    setHasReacted(
      lodash.filter(reactionArr, (arr) => arr.profile.id === profileId)
    );
    setReaction(reactionLength as number);
    if (didMirror?.length === 50) {
      await getMoreMirrors();
    }
  }, [reactionState, profileId, viewerOpen, didMirror]);
  return (
    <div
      className={`relative w-full h-full rounded-md grid grid-flow-row auto-rows-auto p-6 bg-gradient-to-r from-offBlack via-gray-600 to-black gap-6 border-2 border-black z-0`}
    >
      {(publication as any)?.__typename === "Mirror" && (
        <div className="relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2">
          <div className="relative w-fit h-fit col-start-1 place-self-center text-xs text-offWhite font-dosis">
            Mirrored by @{(publication as any)?.profile?.handle}
          </div>
          <div className="relative w-fit h-fit col-start-2 place-self-center">
            <AiOutlineRetweet color={"red"} size={15} />
          </div>
        </div>
      )}
      <div
        className={`relative w-full h-fit ${
          (publication as any)?.__typename === "Mirror"
            ? "row-start-2"
            : "row-start-1"
        } grid grid-flow-col auto-cols-auto`}
      >
        <div
          className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer hover:opacity-70 active:scale-95"
          onClick={() =>
            router.push(
              `/profile/${
                (publication as any)?.__typename !== "Mirror"
                  ? (publication as any)?.profile?.handle.split(".lens")[0]
                  : (publication as any)?.mirrorOf?.profile?.handle.split(
                      ".lens"
                    )[0]
              }`
            )
          }
        >
          <div className="relative w-full h-full col-start-1 self-center justify-self-start grid grid-flow-col auto-cols-auto">
            <div
              className={`relative rounded-full flex bg-white w-fit h-fit place-self-center col-start-1 ${
                profileImage !== "" ? "w-fit h-fit" : "w-6 h-6"
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
              {(publication as any)?.__typename !== "Mirror"
                ? (publication as any)?.profile?.name
                : (publication as any)?.mirrorOf?.profile?.name}
            </div>
            <div
              id="username"
              className={`relative w-fit h-fit ${
                (publication as any).profile?.name
                  ? "row-start02"
                  : "row-start-1"
              } font-dosis text-base self-center`}
            >
              @
              {(publication as any)?.__typename !== "Mirror"
                ? (publication as any)?.profile?.handle
                : (publication as any)?.mirrorOf?.profile?.handle}
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit text-white font-dosis justify-self-end self-center col-start-2">
          {moment(`${(publication as any)?.createdAt}`).fromNow()}
        </div>
      </div>
      <div
        className={`${
          (publication as any)?.__typename === "Mirror"
            ? "row-start-3"
            : "row-start-2"
        } relative w-full h-fit  text-left font-dosis grid grid-flow-row auto-rows-auto gap-6 pl-6`}
      >
        <div className="relative w-full h-fit row-start-1 text-white text-md self-center justify-self-start">
          {(publication as any)?.__typename !== "Mirror"
            ? (publication as any)?.metadata?.description
            : (publication as any)?.mirrorOf?.metadata?.description}
        </div>
        <div className="relative w-full h-fit row-start-2 text-offBlue text-base self-center justify-self-start">
          {(publication as any)?.__typename !== "Mirror"
            ? (publication as any)?.metadata?.tags
            : (publication as any)?.mirrorOf?.metadata?.tags}
        </div>
      </div>
      <div
        className={`relative -fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 pl-6 z-10 ${
          (publication as any)?.__typename === "Mirror"
            ? "row-start-4"
            : "row-start-3"
        }`}
      >
        {((publication as any)?.__typename === "Mirror"
          ? (publication as any)?.mirrorOf?.metadata?.media
          : (publication as any)?.metadata?.media
        )?.map((image: MediaSet, index: number) => {
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
        })}
      </div>
      <div
        className={`relative w-full h-fit ${
          (publication as any)?.__typename === "Mirror"
            ? "row-start-5"
            : "row-start-4"
        } grid grid-flow-col auto-cols-auto pl-6`}
      >
        <Reactions
          textColor={"white"}
          commentColor={"#FBEED1"}
          mirrorColor={"#FEEA66"}
          collectColor={"#81A8F8"}
          heartColor={"red"}
          mirrorAmount={Number(
            (publication as any)?.stats?.totalAmountOfMirrors
          )}
          collectAmount={Number(
            (publication as any)?.stats?.totalAmountOfCollects
          )}
          commentAmount={Number(
            (publication as any)?.stats?.totalAmountOfComments
          )}
          heartAmount={reaction}
          heartExpand={setReactionState}
          mirrorExpand={setReactionState}
          collectExpand={setReactionState}
          commentExpand={setCommentShow}
          dispatch={dispatch}
          mirrorValue={(publication as any)?.id}
          collectValue={(publication as any)?.id}
          commentValue={(publication as any)?.id}
          heartValue={(publication as any)?.id}
          canCollect={
            (publication as any).collectModule?.__typename !==
            "RevertCollectModuleSettings"
              ? true
              : false
          }
          hasCollected={
            (publication as any)?.__typename === "Mirror"
              ? (publication as any)?.mirrorOf?.hasCollectedByMe
              : (publication as any)?.hasCollectedByMe
          }
          hasReacted={hasReacted.length > 0 ? true : false}
          hasMirrored={
            lodash.filter(
              didMirror,
              (mirror) => mirror.mirrorOf.id === (publication as any).id
            )?.length > 0
              ? true
              : false
          }
        />
        <div
          className="relative w-fit h-fit col-start-2 justify-self-end self-center text-white grid grid-flow-col auto-cols-auto font-digiR gap-1 cursor-pointer hover:opacity-70 active:scale-95"
          onClick={() => {
            viewerOpen ? {} : router.push(`/post/${(publication as any)?.id}`);
          }}
        >
          <div className="relative w-fit h-fit col-start-1 text-sm">
            {type === "post" ? "View Post" : "View Comment"}
          </div>
          <div className="relative w-fit h-fit col-start-2">
            <AiFillEye color="white" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPublication;
