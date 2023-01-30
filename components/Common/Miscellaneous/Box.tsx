import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { BoxProps } from "../types/common.types";

const Box: FunctionComponent<BoxProps> = ({
  image,
  row,
  col,
  justify,
  self,
  rounded,
  contain,
  bgColor,
  border
}): JSX.Element => {
  return (
    <div
      className={`relative row-start-${row} col-start-${col} justify-self-${justify} self-${self} h-12 w-12 ${
        bgColor && "bg-white"
      } ${rounded ? "rounded-full" : "rounded-md "} ${border && "border-black border-2"}`}
    >
      <Image
        src={`${INFURA_GATEWAY}/ipfs/${image}`}
        alt="box"
        objectFit={contain ? "contain" : "cover"}
        objectPosition={"center"}
        layout="fill"
        draggable={false}
      />
    </div>
  );
};

export default Box;
