import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Reactions from "../Reactions/Reactions";
import { FeedPublicationProps } from "../../types/common.types";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { MediaSet } from "../../types/lens.types";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { setCommentShow } from "../../../../redux/reducers/commentShowSlice";
import moment from "moment";
import { useAccount } from "wagmi";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import descriptionRegex from "../../../../lib/lens/helpers/descriptionRegex";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  publication,
  dispatch,
  type,
  hasReacted,
  reactionsFeed,
  hasMirrored,
  hasCommented,
  mixtapeMirror,
  handleHidePost,
  followerOnly,
  height,
}): JSX.Element => {
  const profileImage = createProfilePicture(publication, true);
  const router = useRouter();
  const viewerOpen = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const { address } = useAccount();
  const tags = document.querySelectorAll("em");
  if (tags.length > 0) {
    for (let i = 0; i < tags.length; i++) {
      tags[i].addEventListener("click", (e) => {
        router
          ?.push(
            `/?search=${(e.target as any)?.innerText.replaceAll(
              "#",
              ""
            )}/#Slider`
          )
          .catch((e) => {
            if (!e.cancelled) {
              throw e;
            }
          });
      });
    }
  }
  return (
    <div
      className={`relative ${
        height ? "h-full" : "h-fit"
      } w-full rounded-md grid grid-flow-row auto-rows-auto p-6 gap-6 border-2 border-black z-0 ${
        mixtapeMirror
          ? "bg-white"
          : "bg-gradient-to-r from-offBlack via-gray-600 to-black"
      }`}
    >
      {(publication as any)?.__typename === "Mirror" && (
        <div className="relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2 ">
          <div
            className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis ${
              mixtapeMirror ? "text-offBlack" : "text-offWhite"
            }`}
          >
            {mixtapeMirror
              ? `Mixtape Mirrored by @${(publication as any)?.profile?.handle}`
              : `Mirrored by @${(publication as any)?.profile?.handle}`}
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
                  ? (publication as any)?.profile?.handle?.split(".test")[0]
                  : (publication as any)?.mirrorOf?.profile?.handle?.split(
                      ".test"
                    )[0]
              }`
            )
          }
        >
          <div className="relative w-full h-full col-start-1 self-center justify-self-start grid grid-flow-col auto-cols-auto">
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
            <div
              className={`relative w-fit h-fit row-start-1 ${
                mixtapeMirror ? "text-offBlack" : "text-white"
              } font-dosis text-base self-center`}
            >
              {(publication as any)?.__typename !== "Mirror"
                ? (publication as any)?.profile?.name
                : (publication as any)?.mirrorOf?.profile?.name}
            </div>
            <div
              id={mixtapeMirror ? "profile" : "username"}
              className={`relative w-fit h-fit ${
                (publication as any)?.profile?.name
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
        <div
          className={`relative w-fit h-fit ${
            mixtapeMirror ? "text-offBlack" : "text-white"
          } font-dosis justify-self-end self-center col-start-2`}
        >
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
        <div
          className={`relative w-full h-fit row-start-1 relative w-fit h-fit ${
            mixtapeMirror ? "text-offBlack" : "text-white"
          } font-dosis self-center text-base self-center justify-self-start`}
        >
          {!mixtapeMirror ? (
            <div
              dangerouslySetInnerHTML={{
                __html: descriptionRegex(
                  (publication as any)?.__typename !== "Mirror"
                    ? (publication as any)?.metadata?.description
                    : (publication as any)?.mirrorOf?.metadata?.description
                ),
              }}
              className="relative grid grid-flow-col auto-cols-auto place-self-center"
            ></div>
          ) : (
            <>
              {(publication as any)?.mirrorOf?.metadata?.name}
              <br />
              <br />
              Src:
              {
                (publication as any)?.mirrorOf?.metadata?.content?.split(
                  "\n\n"
                )[0]
              }
              ——
              {
                (publication as any)?.mirrorOf?.metadata?.content?.split(
                  "\n\n"
                )[1]
              }
            </>
          )}
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
              image.original.url?.split("://")[1]
            }`;
          } else {
            formattedImageURL = image.original.url;
          }
          return (
            <div
              key={index}
              className={`relative w-60 h-60 border-2 border-black rounded-lg bg-spots grid grid-flow-col auto-cols-auto col-start-${
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
                {mixtapeMirror && (
                  <div className="relative w-full h-fit p-3 grid grid-flow-col auto-cols-auto">
                    <div
                      id="record2"
                      className="relative w-fit h-fit justify-self-end self-start grid grid-flow-col auto-cols-auto font-dosis text-offBlack rounded-md border border-offBlack px-2 py-1 text-base"
                    >
                      <div className="relative w-fit h-fit place-self-center col-start-1">
                        {
                          (publication as any)?.metadata?.content
                            ?.split("\n\n")[2]
                            ?.split(",")[index]
                        }
                      </div>
                    </div>
                  </div>
                )}
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
          id={(publication as any)?.id}
          textColor={mixtapeMirror ? "black" : "white"}
          commentColor={mixtapeMirror ? "black" : "#FBEED1"}
          mirrorColor={mixtapeMirror ? "black" : "#FEEA66"}
          collectColor={mixtapeMirror ? "black" : "#81A8F8"}
          heartColor={mixtapeMirror ? "black" : "red"}
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
          canDelete={
            (publication as any)?.profile?.ownedBy === address ? true : false
          }
          handleHidePost={handleHidePost}
          followerOnly={followerOnly}
          isMixtape={mixtapeMirror as boolean}
        />
        {!router.asPath.includes((publication as any)?.id) && (
          <div
            className={`relative w-fit h-fit col-start-2 justify-self-end self-center grid grid-flow-col auto-cols-auto font-digiR gap-1 cursor-pointer hover:opacity-70 active:scale-95 ${
              mixtapeMirror ? "text-offBlack" : "text-white"
            }`}
            onClick={
              viewerOpen
                ? () => {}
                : () => {
                    router.push(
                      `/${mixtapeMirror ? "mixtape" : "post"}/${
                        (publication as any)?.id
                      }`
                    );
                    dispatch(
                      setCommentShow({
                        actionOpen: false,
                        actionType: "comment",
                        actionValue: (publication as any)?.id,
                      })
                    );
                  }
            }
          >
            <div className="relative w-fit h-fit col-start-1 text-sm">
              {type === "Post" && !mixtapeMirror
                ? "View Post"
                : !mixtapeMirror && type !== "Post"
                ? "View Comment"
                : "View Mixtape"}
            </div>
            <div className="relative w-fit h-fit col-start-2">
              <AiFillEye color={mixtapeMirror ? "black" : "white"} size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPublication;
