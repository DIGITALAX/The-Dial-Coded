import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Reactions from "../Reactions/Reactions";
import { FeedPublicationProps } from "../types/common.types";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  images,
  row,
}): JSX.Element => {
  return (
    <div
      className={`relative row-start-${row} w-full h-full rounded-md grid grid-flow-row auto-rows-auto p-6 bg-gradient-to-r from-offBlack via-gray-600 to-black gap-6 border-2 border-black`}
    >
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto">
        <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3">
          <div className="relative w-fit h-fit col-start-1 self-center justify-self-start cursor-pointer hover:opacity-70 active:scale-95 self-center">
            <Image src="" width={15} height={15} alt="pfp" />
          </div>
          <div className="relative w-fit h-fit col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
            <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-base self-center">
              username - status
            </div>
            <div
              id="username"
              className="relative w-fit h-fit row-start-2 font-dosis text-base cursor-pointer hover:opacity-70 active:scale-95 self-center"
            >
              @something.lens
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit text-white font-dosis justify-self-end self-center">
          10 mins ago
        </div>
      </div>
      <div className="relative w-full h-fit row-start-2 text-left font-dosis grid grid-flow-row auto-rows-auto gap-6 pl-6">
        <div className="relative w-full h-fit row-start-1 text-white text-md self-center justify-self-start">
          Some witty comment.
        </div>
        <div className="relative w-full h-fit row-start-2 text-offBlue text-base self-center justify-self-start">
          #some #other #hashtags #go #here
        </div>
      </div>
      <div className="relative row-start-3 w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 pl-6">
        {images?.map((image: string, index: number) => {
          return (
            <div
              key={index}
              className={`relative w-60 h-60 border-2 border-black rounded-lg bg-black grid grid-flow-col auto-cols-auto col-start-${
                index + 1
              } cursor-pointer hover:opacity-70 active:scale-95`}
            >
              <div className="relative w-full h-full col-start-1 flex">
                <Image
                  src={`https://thedial.infura-ipfs.io/ipfs/${image}`}
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
        <div className="relative w-fit h-fit col-start-2 justify-self-end self-center text-white">
          more data
        </div>
      </div>
    </div>
  );
};

export default FeedPublication;
