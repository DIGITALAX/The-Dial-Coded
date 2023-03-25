import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { FeedPublicationProps } from "../../types/common.types";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { Media, MediaSet } from "../../types/lens.types";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { setCommentShow } from "../../../../redux/reducers/commentShowSlice";
import descriptionRegex from "../../../../lib/lens/helpers/descriptionRegex";
import Profile from "../Profile/Profile";

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
  reactionLoaded,
}): JSX.Element => {
  const router = useRouter();
  const viewerOpen = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
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
      className={`relative w-full ${
        height ? "h-full" : "h-fit"
      } flex flex-row flex-wrap sm:flex-nowrap gap-6 rounded-md z-0`}
      data-post-id={(publication as any).id}
      id={(publication as any).id}
    >
      <Profile
        publication={publication}
        mixtapeMirror={mixtapeMirror}
        reactionsFeed={reactionsFeed}
        setReactionState={setReactionState}
        handleHidePost={handleHidePost}
        followerOnly={followerOnly}
        dispatch={dispatch}
        setCommentShow={setCommentShow}
        hasCommented={hasCommented}
        hasMirrored={hasMirrored}
        hasReacted={hasReacted}
        mixtape={false}
        reactionLoaded={reactionLoaded}
      />
      <div
        className={`relative w-full h-auto grow rounded-md grid grid-flow-row auto-rows-auto p-3 galaxy:p-6 gap-6 border-2 border-black ${
          mixtapeMirror
            ? "bg-white"
            : "bg-gradient-to-r from-offBlack via-gray-600 to-black"
        }`}
      >
        {(publication as any)?.__typename === "Mirror" && (
          <div className="relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2">
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis ${
                mixtapeMirror ? "text-offBlack" : "text-offWhite"
              }`}
            >
              {mixtapeMirror
                ? `Mixtape Mirrored by @${
                    (publication as any)?.profile?.handle
                  }`
                : `Mirrored by @${(publication as any)?.profile?.handle}`}
            </div>
            <div className="relative w-fit h-fit col-start-2 place-self-center">
              <AiOutlineRetweet color={"red"} size={15} />
            </div>
          </div>
        )}
        <div
          className={`${
            (publication as any)?.__typename === "Mirror"
              ? "row-start-2"
              : "row-start-1"
          } relative w-full h-fit text-left font-dosis grid grid-flow-row auto-rows-auto gap-6`}
        >
          <div
            className={`relative w-full h-fit row-start-1 relative w-fit h-fit ${
              mixtapeMirror ? "text-offBlack" : "text-white"
            } font-dosis self-center justify-self-start `}
          >
            {!mixtapeMirror ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: descriptionRegex(
                    (publication as any)?.__typename !== "Mirror"
                      ? (publication as any)?.metadata?.description
                        ? (publication as any)?.metadata?.description
                        : (publication as any)?.metadata?.content
                      : (publication as any)?.mirrorOf?.metadata?.description
                      ? (publication as any)?.mirrorOf?.metadata?.description
                      : (publication as any)?.mirrorOf?.metadata?.content
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
                {" " +
                  (publication as any)?.mirrorOf?.metadata?.content?.split(
                    "\n\n"
                  )[0]}
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
          className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10 ${
            (publication as any)?.__typename === "Mirror"
              ? "row-start-3"
              : "row-start-2"
          }`}
        >
          {(!mixtapeMirror
            ? (publication as any)?.__typename === "Mirror"
              ? (publication as any)?.mirrorOf?.metadata?.media
              : (publication as any)?.metadata?.media
            : (publication as any)?.mirrorOf?.metadata?.content
                ?.split("\n\n")[3]
                ?.split(",")
          )?.map((image: MediaSet | string, index: number) => {
            let formattedImageURL: string;
            if (!mixtapeMirror) {
              if ((image as MediaSet).original.url.includes("ipfs://")) {
                formattedImageURL = `${INFURA_GATEWAY}/ipfs/${
                  (image as MediaSet).original.url?.split("://")[1]
                }`;
              } else {
                formattedImageURL = (image as MediaSet).original.url;
              }
            } else {
              formattedImageURL = `${INFURA_GATEWAY}/ipfs/${image}`;
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
                      actionType: !mixtapeMirror
                        ? (image as MediaSet).original.mimeType
                        : "image/png",
                      actionOpen: true,
                      actionImage: formattedImageURL,
                    })
                  )
                }
              >
                <div className="relative w-full h-full col-start-1 flex">
                  {(image as MediaSet)?.original?.mimeType !== "video/mp4" ||
                  mixtapeMirror ? (
                    <Image
                      src={
                        (image as MediaSet)?.original?.mimeType ===
                          "image/png" || mixtapeMirror
                          ? formattedImageURL
                          : (image as MediaSet)?.original?.url
                      }
                      layout="fill"
                      objectFit="cover"
                      objectPosition={"center"}
                      className="rounded-md"
                      draggable={false}
                    />
                  ) : (
                    <video
                      muted
                      controls
                      className="rounded-md absolute w-full h-full object-cover"
                    >
                      <source src={formattedImageURL} type="video/mp4" />
                    </video>
                  )}
                  {mixtapeMirror && (
                    <div className="relative w-full h-fit p-3 grid grid-flow-col auto-cols-auto">
                      <div
                        id="mixtapeOne"
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
          className={`relative w-full h-full ${
            (publication as any)?.__typename === "Mirror"
              ? "row-start-4"
              : "row-start-3"
          } grid grid-flow-col auto-cols-auto`}
        >
          {!router.asPath.includes((publication as any)?.id) && (
            <div
              className={`relative w-fit h-full col-start-1 row-start-1 sm:col-start-2 sm:pt-0 pt-3 justify-self-end self-center grid grid-flow-col auto-cols-auto font-digiR gap-1 cursor-pointer hover:opacity-70 active:scale-95 ${
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
              <div className="relative w-fit h-fit self-end col-start-1 text-sm">
                {type === "Post" && !mixtapeMirror
                  ? "View Post"
                  : !mixtapeMirror && type !== "Post"
                  ? "View Comment"
                  : "View Mixtape"}
              </div>
              <div className="relative w-fit h-fit col-start-2 self-end">
                <AiFillEye
                  color={mixtapeMirror ? "black" : "white"}
                  size={20}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPublication;
