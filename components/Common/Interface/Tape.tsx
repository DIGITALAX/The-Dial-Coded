import { FunctionComponent } from "react";
import { TapeProps } from "../types/common.types";

const Tape: FunctionComponent<TapeProps> = ({
  bgColor,
  sideImage,
  title,
  mixtape,
  index,
}): JSX.Element => {
  return (
    <div
    key={index}
      id={bgColor}
      className={`relative w-96 h-20 border-black border-b-2 ${
        index !== 0 && "border-t-2"
      } grid grid-flow-col auto-cols-auto py-2 pr-2 pl-20`}
    >
      <div className="relative w-full h-10 rounded-tl-2xl bg-white col-start-1 font-digiB text-black text-2xl grid grid-flow-col auto-cols-auto border-2 border-bright">
        <div className="relative w-fit h-fit place-self-center">
          {mixtape ? `mixtape vol ${index} - ${title}` : title}
        </div>
      </div>
    </div>
  );
};

export default Tape;
