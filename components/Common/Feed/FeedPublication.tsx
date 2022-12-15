import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Reactions from "./Reactions/Reactions";
import { FeedPublicationProps } from "../types/common.types";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { MediaSet } from "../types/lens.types";
import moment from "moment";
import { setImageViewer } from "../../../redux/reducers/imageViewerSlice";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  publication,
  dispatch,
}): JSX.Element => {
  let profileImage: string;
  if (!publication.profile?.picture?.original) {
    profileImage = "";
  } else if (publication.profile?.picture?.original) {
    if (publication.profile?.picture?.original?.url.includes("http")) {
      profileImage = publication.profile?.picture.original.url;
    } else {
      const cut = publication.profile?.picture.original.url.split("/");
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
    }
  } else {
    profileImage = publication.profile?.picture?.uri;
  }
  console.log(publication);
  return (
    <div
      className={`relative w-full h-full rounded-md grid grid-flow-row auto-rows-auto p-6 bg-gradient-to-r from-offBlack via-gray-600 to-black gap-6 border-2 border-black`}
    >
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto">
        <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3">
          <div className="relative w-full h-full col-start-1 self-center justify-self-start cursor-pointer hover:opacity-70 active:scale-95 grid grid-flow-col auto-cols-auto">
            <div className="relative flex w-fit h-fit place-self-center col-start-1">
              <Image
                src={profileImage}
                width={25}
                height={25}
                alt="pfp"
                className="relative w-fit h-fit rounded-full self-center"
              />
            </div>
          </div>
          <div className="relative w-fit h-fit col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
            <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-base self-center">
              {publication.profile?.name}
            </div>
            <div
              id="username"
              className={`relative w-fit h-fit ${
                publication.profile?.name ? "row-start02" : "row-start-1"
              } font-dosis text-base cursor-pointer hover:opacity-70 active:scale-95 self-center`}
            >
              @{publication.profile.handle}
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit text-white font-dosis justify-self-end self-center">
          {moment(`${publication.createdAt}`).fromNow()}
        </div>
      </div>
      <div className="relative w-full h-fit row-start-2 text-left font-dosis grid grid-flow-row auto-rows-auto gap-6 pl-6">
        <div className="relative w-full h-fit row-start-1 text-white text-md self-center justify-self-start">
          {publication.metadata.description}
        </div>
        <div className="relative w-full h-fit row-start-2 text-offBlue text-base self-center justify-self-start">
          {publication.metadata?.tags}
        </div>
      </div>
      <div className="relative row-start-3 w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 pl-6">
        {publication.metadata.media?.map((image: MediaSet, index: number) => {
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
      <div className="relative w-full h-fit row-start-4 grid grid-flow-col auto-cols-auto pl-6">
        <Reactions
          textColor={"white"}
          commentColor={"#FBEED1"}
          mirrorColor={"#FEEA66"}
          collectColor={"#81A8F8"}
          heartColor={"red"}
        />
        {/* <div className="relative w-fit h-fit col-start-2 justify-self-end self-center text-white">
        </div> */}
      </div>
    </div>
  );
};

export default FeedPublication;
