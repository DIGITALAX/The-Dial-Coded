import { FunctionComponent } from "react";
import { NotificationBannerProps } from "../types/common.types";
import moment from "moment";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import Image from "next/legacy/image";
import { BsFillCollectionFill, BsSuitHeartFill } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useRouter } from "next/router";
import { FaCommentDots } from "react-icons/fa";

const NotificationBanner: FunctionComponent<NotificationBannerProps> = ({
  notification,
}): JSX.Element => {
  let profileImage: string;
  let prefix: any;
  let type: string;
  if (notification?.__typename === "NewCollectNotification") {
    prefix = notification?.collectedPublication?.collectedBy?.defaultProfile;
    type = "collect";
  } else if (notification?.__typename === "NewFollowerNotification") {
    prefix = notification?.wallet?.defaultProfile;
    type = "follow";
  } else if (notification?.__typename === "NewCommentNotification") {
    prefix = notification?.profile;
    type = "comment";
  } else {
    prefix = notification?.profile;
    type = "react";
  }
  if (!prefix?.picture?.original) {
    profileImage = "";
  } else if (prefix?.picture?.original) {
    if (prefix?.picture?.original?.url.includes("http")) {
      profileImage = prefix?.picture?.original.url;
    } else {
      const cut = prefix?.picture?.original?.url.split("//");
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[1]}`;
    }
  } else {
    profileImage = prefix?.picture?.uri;
  }

  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(
          type === "react"
            ? `/post/${notification?.publication?.id}`
            : type === "collect"
            ? `/post/${notification?.collectedPublication?.id}`
            : `/profile/${prefix?.id}`
        )
      }
      className="relative w-full h-fit rounded-md grid grid-flow-cols auto-cols-auto p-6 bg-gradient-to-r from-offBlack via-gray-600 to-black gap-6 border-2 border-black cursor-pointer"
    >
      <div className="relative justify-self-start self-center col-start-1 grid grid-flow-col auto-cols-auto gap-3">
        <div
          className={`relative rounded-full flex bg-white w-6 h-6 place-self-center col-start-1`}
          id="crt"
        >
          {profileImage !== "" && (
            <Image
              src={profileImage}
              objectFit="cover"
              layout="fill"
              alt="pfp"
              className="relative w-fit h-fit rounded-full self-center"
            />
          )}
        </div>
        <div className="relative w-fit h-fit col-start-2 place-self-center text-white font-dosis">
          @{prefix?.handle}
        </div>
      </div>
      <div className="relative w-fit h-fit justify-self-start self-center col-start-2 text-white font-dosis grid grid-flow-col auto-cols-auto gap-3">
        <div className="relative w-fit h-fit col-start-1 place-self-center">
          {type === "collect" ? (
            <BsFillCollectionFill color={"#81A8F8"} size={15} />
          ) : type === "follow" ? (
            <AiOutlineUsergroupAdd color={"#81A8F8"} size={20} />
          ) : type === "comment" ? (
            <FaCommentDots color={"#FBEED1"} size={15} />
          ) : (
            type === "react" &&
            (notification?.reaction === "UPVOTE" ? (
              <BsSuitHeartFill color={"red"} size={15} />
            ) : (
              <></>
            ))
          )}
        </div>
        <div className="relative w-fit h-fit col-start-2 place-self-center text-sm">
          {type === "collect"
            ? "collected your post"
            : type === "follow"
            ? "followed you"
            : type === "comment"
            ? "commented on your post"
            : type === "react" &&
              (notification?.reaction === "UPVOTE" ? "liked your post" : <></>)}
        </div>
      </div>
      <div className="relative justify-self-end self-center text-white font-digiB text-xs col-start-3">
        {moment(`${notification?.createdAt}`).fromNow()}
      </div>
    </div>
  );
};

export default NotificationBanner;
