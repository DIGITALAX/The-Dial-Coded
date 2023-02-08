import moment from "moment";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { useAccount } from "wagmi";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { ProfileSideBarProps } from "../../types/common.types";
import Reactions from "../Reactions/Reactions";

const Profile: FunctionComponent<ProfileSideBarProps> = ({
  publication,
  mixtapeMirror,
  reactionsFeed,
  setReactionState,
  handleHidePost,
  followerOnly,
  dispatch,
  setCommentShow,
  hasCommented,
  hasMirrored,
  hasReacted,
  mixtape,
}): JSX.Element => {
  const router = useRouter();
  const profileImage = createProfilePicture(publication, true);
  const { address } = useAccount();
  return (
    <div
      className={`relative h-auto rounded-md pr-px py-px ${
        mixtape ? "w-fit" : "w-full sm:w-40 min-w-[7.5rem]"
      }`}
      id="sideProfile"
    >
      <div className={`relative w-full h-full bg-shame rounded-md flex flex-col items-start sm:items-center ${!mixtape ? "py-1.5 px-1 gap-3" : "p-2 gap-1"}`}>
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full rounded-lg"
        />
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`${
              router.asPath?.includes("post") ? "w-24" : "w-20"
            } relative h-8 rounded-full flex justify-self-center`}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
              layout="fill"
              alt="backdrop"
              priority
              draggable={false}
              className="rounded-full w-full h-full"
            />
          </div>
          <div
            className={`absolute rounded-full flex bg-white w-8 h-full justify-self-center ${mixtape ? "right-1.5" : "right-6"} col-start-1 cursor-pointer active:scale-95 hover:opacity-80`}
            id="crt"
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
            {profileImage !== "" && (
              <Image
                src={profileImage}
                objectFit="cover"
                alt="pfp"
                layout="fill"
                className="relative w-full h-full rounded-full"
                draggable={false}
              />
            )}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit ${
              mixtapeMirror && "text-offBlack"
            } font-dosis text-xs justify-self-center`}
            id={mixtapeMirror ? "" : "username"}
          >
            {(publication as any)?.__typename !== "Mirror"
              ? (publication as any)?.profile?.name
                ? (publication as any)?.profile?.name?.length > 25
                  ? (publication as any)?.profile?.name?.substring(0, 25) +
                    "..."
                  : (publication as any)?.profile?.name
                : ""
              : (publication as any)?.mirrorOf?.profile?.name
              ? (publication as any)?.mirrorOf?.profile?.name?.length > 25
                ? (publication as any)?.mirrorOf?.profile?.name?.substring(
                    0,
                    25
                  ) + "..."
                : (publication as any)?.mirrorOf?.profile?.name
              : ""}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            id={mixtapeMirror ? "profile" : ""}
            className={`relative w-fit h-fit ${
              (publication as any)?.profile?.name
                ? "row-start-2"
                : "row-start-1"
            } font-clash text-xs justify-self-center ${
              !mixtapeMirror && "text-black"
            }`}
          >
            @
            {(publication as any)?.__typename !== "Mirror"
              ? (publication as any)?.profile?.handle?.length > 15
                ? (publication as any)?.profile?.handle?.substring(0, 15) +
                  "..."
                : (publication as any)?.profile?.handle
              : (publication as any)?.mirrorOf?.profile?.handle?.length > 15
              ? (publication as any)?.mirrorOf?.profile?.handle?.substring(
                  0,
                  15
                ) + "..."
              : (publication as any)?.mirrorOf?.profile?.handle}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit text-offBlack font-dosis justify-self-center fo:pb-0 pb-2 text-xs `}
          >
            {moment(`${(publication as any)?.createdAt}`).fromNow()}
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-col auto-cols-auto items-end pt-3">
          <Reactions
            id={(publication as any)?.id}
            textColor={"black"}
            commentColor={mixtapeMirror ? "black" : "#0AC7AB"}
            mirrorColor={mixtapeMirror ? "black" : "#712AF6"}
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
            followerOnly={followerOnly as boolean}
            isMixtape={mixtapeMirror as boolean}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
