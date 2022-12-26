import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { HotProps } from "../types/feed.types";
import Reactions from "../../../../../../Common/Feed/Reactions/Reactions";
import { INFURA_GATEWAY } from "../../../../../../../lib/lens/constants";

const Hot: FunctionComponent<HotProps> = ({
  topMixtape,
  topTracks,
  topTrending,
  isOpen,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full ${
        isOpen ? "h-fit overflow-y-visible" : "h-[100rem] overflow-y-scroll"
      } col-start-2 grid grid-flow-row auto-rows-auto gap-10`}
    >
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-4">
        {topTrending?.map((image: string, index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-80 border-2 border-black rounded-md p-4 grid grid-flow-col auto-cols-auto"
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${image}`}
                layout="fill"
                alt={image}
                objectFit="cover"
                objectPosition={"center"}
                className="rounded absolute"
              />
              <div
                id="hot"
                className="relative w-full h-fit rounded-lg grid grid-flow-col auto-cols-auto p-2 col-start-1 self-end"
              >
                <Reactions
                  textColor={"black"}
                  commentColor={"black"}
                  mirrorColor={"black"}
                  collectColor={"black"}
                  heartColor={"black"}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto gap-10 overflow-x-scroll">
        {topMixtape?.map((image: string, index: number) => {
          return (
            <div
              key={index}
              className="relative w-96 h-60 border-2 border-black rounded-md p-4 grid grid-flow-col auto-cols-auto"
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${image}`}
                layout="fill"
                alt={image}
                objectFit="cover"
                objectPosition={"center"}
                className="rounded absolute"
              />
              <div
                id="hot"
                className="relative w-full h-fit rounded-lg grid grid-flow-col auto-cols-auto p-2 col-start-1 self-end"
              >
                <Reactions
                  textColor={"black"}
                  commentColor={"black"}
                  mirrorColor={"black"}
                  collectColor={"black"}
                  heartColor={"black"}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative w-full h-full row-start-3 grid grid-flow-row auto-rows-auto overflow-x-scroll gap-6">
        {topTracks?.map((image: string, index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-80 border-2 border-black rounded-md p-4 grid grid-flow-col auto-cols-auto"
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${image}`}
                layout="fill"
                alt={image}
                objectFit="cover"
                objectPosition={"center"}
                className="rounded absolute"
              />
              <div
                id="hot"
                className="relative w-full h-fit rounded-lg grid grid-flow-col auto-cols-auto p-2 col-start-1 self-end"
              >
                <Reactions
                  textColor={"black"}
                  commentColor={"black"}
                  mirrorColor={"black"}
                  collectColor={"black"}
                  heartColor={"black"}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hot;
