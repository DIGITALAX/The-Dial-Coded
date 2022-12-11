import { FunctionComponent } from "react";
import { ButtonIconProps } from "../types/common.types";
import Image from "next/legacy/image";

const ButtonIcon: FunctionComponent<ButtonIconProps> = ({
  width,
  height,
  image,
  col,
  self,
  justify,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit col-start-${col} border-4 w-${width} h-${height} border-black bg-yell grid grid-flow-row auto-rows-auto p-px self-${self} justify-self-${justify}`}
    >
      {image && (
        <Image
          src={`https://thedial.infura-ipfs.io/ipfs/${image}`}
          objectFit="cover"
          objectPosition="center"
          layout="fill"
          className="absolute"
        />
      )}
      <div className="relative row-start-1 w-full h-1 bg-white justify-self-center self-start"></div>
      <div className="relative row-start-2 w-2/3 justify-self-center self-end bg-black border border-white h-1.5"></div>
    </div>
  );
};

export default ButtonIcon;
