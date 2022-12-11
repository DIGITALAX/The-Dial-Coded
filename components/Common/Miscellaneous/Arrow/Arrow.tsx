import Image from "next/image";
import { FunctionComponent } from "react";
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
        !vertical && "hover:opacity-80 active:scale-95 cursor-pointer pl-6"
      } place-self-center ${
        vertical
          ? "grid-flow-row auto-rows-auto"
          : "grid-flow-col auto-cols-auto"
      }`}
      onClick={() => {
        handleValue && handleValue(!value);
      }}
    >
      <div
        className={`relative w-fit h-fit ${
          vertical ? "row-start-1" : "col-start-1"
        }`}
      >
        <Image
          width={12}
          height={12}
          alt="leftArrow"
          src={`https://thedial.infura-ipfs.io/ipfs/${up}`}
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
          src={`https://thedial.infura-ipfs.io/ipfs/${middle}`}
        />
      </div>
      <div
        className={`relative w-fit h-fit ${
          vertical ? "row-start-3" : "col-start-3"
        }`}
      >
        <Image
          width={12}
          height={12}
          alt="rightArrow"
          src={`https://thedial.infura-ipfs.io/ipfs/${down}`}
        />
      </div>
    </div>
  );
};

export default Arrow;
