import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BsFlower2 } from "react-icons/bs";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { MixButtonProps } from "../../../types/common.types";

const MixButton: FunctionComponent<MixButtonProps> = ({
  col,
  text,
  bgColor,
  textSize,
  width,
  border,
  clickHandle,
  loader,
}): JSX.Element => {
  return (
    <div
      id={bgColor}
      onClick={
        loader
          ? () => {}
          : () => {
              clickHandle && clickHandle();
            }
      }
      className={`relative w-${width} col-start-${col} h-fit grid grid-flow-col auto-cols-auto ${
        !loader && "cursor-pointer active:scale-95"
      } rounded-md pb-1 pt-1 pl-3 pr-1`}
    >
      <Image
        src={`${INFURA_GATEWAY}/ipfs/QmTLN24oXMbEj3QgHX7dD3GWnYwL2GqsP16yvLzm29bk5X`}
        className="absolute w-full h-full"
        layout="fill"
        objectFit="cover"
        draggable={false}
      />
      <div
        className={`relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto  gap-3 pl-0.5 py-1 pr-2 rounded-tr-md ${
          border && "border-white border-t-2 border-r-2"
        }`}
      >
        <div
          className={`${
            loader && "animate-spin"
          } relative col-start-1 place-self-center w-fit h-fit`}
        >
          {loader ? (
            <AiOutlineLoading color="white" size={15} />
          ) : (
            <BsFlower2 color="white" size={15} />
          )}
        </div>
        <div
          className={`relative col-start-2 place-self-center w-fit h-fit text-white font-digiB text-${textSize}`}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default MixButton;
