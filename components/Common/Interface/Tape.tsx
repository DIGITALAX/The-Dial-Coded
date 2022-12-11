import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { TapeProps } from "../types/common.types";
import { RiLock2Fill } from "react-icons/ri";

const Tape: FunctionComponent<TapeProps> = ({
  bgColor,
  sideImage,
  title,
  mixtape,
  index,
  locked,
}): JSX.Element => {
  return (
    <div
      key={index}
      id={bgColor}
      className={`relative w-full h-20 border-black border-b-2 ${
        index !== 0 && "border-t-2"
      } grid grid-flow-col auto-cols-auto ${
        !sideImage ? "pr-2 pl-20" : "pr-2 pl-2"
      } cursor-pointer hover:mix-blend-hard-light`}
    >
      {sideImage && (
        <div className="relative w-16 h-full col-start-1 self-center justify-self-start mix-blend-hard-light">
          <Image
            src={`https://thedial.infura-ipfs.io/ipfs/${sideImage}`}
            layout="fill"
            priority
          />
        </div>
      )}
      <div
        className={`relative w-52 h-fit p-2 ${
          sideImage ? "col-start-2" : "col-start-1"
        } grid grid-flow-col auto-cols-auto place-self-center`}
      >
        <div
          className={`relative w-full h-10 rounded-tl-2xl bg-white font-digiB text-black text-2xl grid grid-flow-col auto-cols-auto border border-bright`}
        >
          <div className="relative w-fit h-fit place-self-center">
            {mixtape ? (
              `mixtape vol ${index} - ${title}`
            ) : locked ? (
              <RiLock2Fill color="black" size={20} />
            ) : (
              title
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tape;
