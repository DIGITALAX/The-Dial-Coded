import Image from "next/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { ArrowProps } from "../../types/common.types";

const Arrow: FunctionComponent<ArrowProps> = ({
  handleValue,
  value,
  up,
  middle,
  down,
  vertical,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit col-start-2 grid ${
        !vertical && "hover:opacity-80 active:scale-95 cursor-pointer fo:pl-6"
      } place-self-center z-2 ${
        vertical
          ? "grid-flow-row auto-rows-auto"
          : "grid-flow-col auto-cols-auto"
      }`}
      onClick={() => {
        handleValue && handleValue(!value);
      }}
    >
      <div
        className={`relative w-fit place-self-center h-fit ${
          vertical ? "row-start-1" : "col-start-1"
        }`}
      >
        <Image
          width={12}
          height={12}
          alt="leftArrow"
          src={`${INFURA_GATEWAY}/ipfs/${up}`}
          draggable={false}
        />
      </div>
      <div
        className={`relative w-fit h-fit ${
          vertical ? "row-start-2" : "col-start-2"
        } place-self-center`}
      >
        <Image
          width={12}
          height={12}
          alt="centerDot"
          src={`${INFURA_GATEWAY}/ipfs/${middle}`}
          draggable={false}
        />
      </div>
      <div
        className={`relative w-fit h-fit place-self-center ${
          vertical ? "row-start-3" : "col-start-3"
        }`}
      >
        <Image
          width={12}
          height={12}
          alt="rightArrow"
          src={`${INFURA_GATEWAY}/ipfs/${down}`}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Arrow;
