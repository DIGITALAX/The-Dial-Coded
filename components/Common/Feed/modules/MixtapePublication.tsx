import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import { useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { RootState } from "../../../../redux/store";
import { MixtapePublicationProps } from "../../types/common.types";
import moment from "moment";
import { MediaSet } from "../../types/lens.types";
import Reactions from "../Reactions/Reactions";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { setCommentShow } from "../../../../redux/reducers/commentShowSlice";
import { useAccount } from "wagmi";

const MixtapePublication: FunctionComponent<MixtapePublicationProps> = ({
  publication,
  dispatch,
  type,
  hasReacted,
  reactionsFeed,
  hasMirrored,
  hasCommented,
  handleHidePost
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
  const { address } = useAccount();
  return (
    <div
      className={`relative w-full h-fit rounded-md grid grid-flow-row auto-rows-auto p-6 bg-white gap-6 border-2 border-black z-0`}
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
        className={`relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer hover:opacity-70 active:scale-95 justify-self-start self-center row-start-1`}
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
        <div
          className={`relative w-full h-full justify-self-end self-center grid grid-flow-col auto-cols-auto col-start-1`}
        >
          <div
            className={`relative rounded-full flex bg-white w-6 h-6 place-self-center col-start-1`}
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
        <div className="relative w-fit h-fit col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
          <div className="relative w-fit h-fit row-start-1 text-black font-dosis text-base self-center">
            {(publication as any)?.__typename !== "Mirror"
              ? (publication as any)?.profile?.name
              : (publication as any)?.mirrorOf?.profile?.name}
          </div>
          <div
            id="profile"
            className={`relative w-fit h-fit row-start-2 font-dosis text-base self-center`}
          >
            @
            {(publication as any)?.__typename !== "Mirror"
              ? (publication as any)?.profile?.handle
              : (publication as any)?.mirrorOf?.profile?.handle}
          </div>
        </div>
      </div>
      <div
        className={`${
          (publication as any)?.__typename === "Mirror"
            ? "row-start-3"
            : "row-start-2"
        } relative w-full h-fit  text-left font-dosis grid grid-flow-row auto-rows-auto gap-6 pl-6`}
      >
        <div className="relative w-full h-fit row-start-1 text-black text-md self-center justify-self-start grid grid-flow-col auto-cols-auto gap-4">
          <div className="relative w-fit h-fit col-start-1 row-start-1 text-2xl text-offBlack">
            {(publication as any)?.metadata?.name}
          </div>
          <div className="relative w-fit h-fit col-start-1 row-start-2 grid grid-flow-col auto-cols-auto">
            <div className="relative w-fit h-fit rounded-md bg-black text-white text-md grid grid-flow-col auto-cols-auto px-2 py-1">
              <div className="relative w-fit h-fit place-self-center">
                Src: {(publication as any)?.metadata?.content?.split("\n\n")[0]}{" "}
                —— {(publication as any)?.metadata?.content?.split("\n\n")[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 pl-6 z-10 ${
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
              className={`relative w-96 h-[35vw] border-2 border-black rounded-lg bg-black grid grid-flow-col auto-cols-auto col-start-${
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
                <div className="relative w-full h-fit p-3 grid grid-flow-col auto-cols-auto">
                  <div
                    id="record2"
                    className="relative w-fit h-fit justify-self-end self-start grid grid-flow-col auto-cols-auto font-dosis text-offBlack rounded-md border border-offBlack px-2 py-1 text-md"
                  >
                    <div className="relative w-fit h-fit place-self-center col-start-1">
                      {
                        ((publication as any)?.metadata?.content)
                          .split("\n\n")[2]
                          .split(",")[index]
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={`relative w-full h-fit grid grid-flow-col auto-cols-auto ${
          (publication as any)?.__typename === "Mirror"
            ? "row-start-5"
            : "row-start-4"
        }`}
      >
        <div
          className={`relative w-full h-fit  grid grid-flow-col auto-cols-auto pl-6 col-start-1`}
        >
          <Reactions
            id={(publication as any)?.id}
            textColor={"black"}
            commentColor={"black"}
            mirrorColor={"black"}
            collectColor={"black"}
            heartColor={"black"}
            mirrorAmount={Number(
              (publication as any)?.stats?.totalAmountOfMirrors
            )}
            collectAmount={Number(
              (publication as any)?.stats?.totalAmountOfCollects
            )}
            commentAmount={Number(
              (publication as any)?.stats?.totalAmountOfComments
            )}
            heartAmount={reactionsFeed}
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
              (publication as any)?.collectModule?.__typename !==
              "RevertCollectModuleSettings"
                ? true
                : false
            }
            hasCollected={
              (publication as any)?.__typename === "Mirror"
                ? (publication as any)?.mirrorOf?.hasCollectedByMe
                : (publication as any)?.hasCollectedByMe
            }
            hasReacted={hasReacted}
            hasMirrored={hasMirrored}
            hasCommented={hasCommented}
            handleHidePost={handleHidePost}
            canDelete={
              address === (publication as any)?.profile?.id ? true : false
            }
          />
        </div>
        <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto justify-self-end">
          <div className="relative w-fit h-fit text-black font-dosis justify-self-end self-center col-start-2">
            {moment(`${(publication as any)?.createdAt}`).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixtapePublication;
