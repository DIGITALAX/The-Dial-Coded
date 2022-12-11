import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { HotProps } from "../types/feed.types";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import lodash from "lodash";
import Reactions from "../../../../../../Common/Reactions/Reactions";

const Hot: FunctionComponent<HotProps> = ({
  topMixtape,
  topTracks,
  topTrending,
}): JSX.Element => {
  const isOpen = useSelector(
    (state: RootState) => state.app.moreFeedReducer.value
  );
  return (
    <div className="relative w-full h-fit col-start-2 grid grid-flow-row auto-rows-auto gap-10">
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-4">
        {topTrending?.map((image: string, index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-80 border-2 border-black rounded-md p-4 grid grid-flow-col auto-cols-auto"
            >
              <Image
                src={`https://thedial.infura-ipfs.io/ipfs/${image}`}
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
                src={`https://thedial.infura-ipfs.io/ipfs/${image}`}
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
      <div className="relative w-full h-fit row-start-3 grid grid-flow-row auto-rows-auto overflow-x-scroll gap-6">
        {(isOpen ? topTracks : lodash.slice(topTracks, 0, 2))?.map(
          (image: string, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full h-80 border-2 border-black rounded-md p-4 grid grid-flow-col auto-cols-auto"
              >
                <Image
                  src={`https://thedial.infura-ipfs.io/ipfs/${image}`}
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
          }
        )}
      </div>
    </div>
  );
};

export default Hot;
