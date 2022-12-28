import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { TapeProps } from "../types/common.types";
import { RiLock2Fill } from "react-icons/ri";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const Tape: FunctionComponent<TapeProps> = ({
  bgColor,
  sideImage,
  backgroundImages,
  title,
  mixtape,
  index,
  locked,
  handleTapeSet,
}): JSX.Element => {
  const notifications = useSelector(
    (state: RootState) => state.app.notificationsReducer.value
  );
  return (
    <div
      key={index}
      id={bgColor}
      className={`relative w-full h-20 border-black border-b-2 ${
        index !== 0 && "border-t-2"
      } grid grid-flow-col auto-cols-auto ${
        !sideImage ? "pr-2 pl-10" : "pr-2 pl-2"
      } cursor-pointer hover:mix-blend-hard-light`}
      onClick={() => {
        handleTapeSet && handleTapeSet(title as string);
      }}
    >
      {sideImage && (
        <div className="relative w-16 h-full col-start-1 self-center justify-self-start mix-blend-hard-light">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${sideImage}`}
            layout="fill"
            priority
          />
        </div>
      )}
      {backgroundImages && (
        <div className="absolute w-full h-full mix-blend-hard-light">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${backgroundImages[index + 1]}`}
            layout="fill"
            priority
            objectFit="cover"
            objectPosition={"center"}
          />
        </div>
      )}
      <div
        className={`relative w-fit h-fit p-2 ${
          sideImage ? "col-start-2" : "col-start-1"
        } grid grid-flow-col auto-cols-auto self-center justify-self-end`}
      >
        <div
          className={`relative ${
            sideImage ? "w-52" : "w-fit"
          } h-10 rounded-tl-2xl font-digiB text-black text-2xl grid grid-flow-col auto-cols-auto border border-bright whitespace-nowrap ${
            notifications && title === "notifications"
              ? "bg-offBlue animate-pulse"
              : "bg-white"
          }`}
        >
          <div className={`relative w-fit h-fit place-self-center p-1`}>
            {mixtape ? (
              `mixtape vol ${index + 1} - ${title}`
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
