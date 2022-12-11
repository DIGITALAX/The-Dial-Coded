import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { BsFlower2 } from "react-icons/bs";
import { MixButtonProps } from "../../types/common.types";

const MixButton: FunctionComponent<MixButtonProps> = ({
  col,
  text,
  bgColor,
}): JSX.Element => {
  return (
    <div
      id={bgColor}
      className={`relative w-fit col-start-${col} h-fit grid grid-flow-col auto-cols-auto px-3 py-1 gap-3`}
    >
      <Image
        src="https://thedial.infura-ipfs.io/ipfs/QmTLN24oXMbEj3QgHX7dD3GWnYwL2GqsP16yvLzm29bk5X"
        className="absolute w-full h-full"
        layout="fill"
        objectFit="cover"
      />
      <div className="relative col-start-1 place-self-center w-fit h-fit">
        <BsFlower2 color="white" size={10} />
      </div>
      <div className="relative col-start-2 place-self-center w-fit h-fit text-white font-digiB text-xl">
        {text}
      </div>
    </div>
  );
};

export default MixButton;
