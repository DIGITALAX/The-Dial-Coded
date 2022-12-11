import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { BoxProps } from "../types/common.types";

const Box: FunctionComponent<BoxProps> = ({ image, row, col, justify, self}): JSX.Element => {
  return (
    <div className={`relative row-start-${row} col-start-${col} justify-self-${justify} self-${self} h-12 w-12 rounded-md border-black border-2 bg-white`}>
      <Image
        src={`https://thedial.infura-ipfs.io/ipfs/${image}`}
        alt="box"
        objectFit="cover"
        objectPosition={"center"}
        layout="fill"
      />
    </div>
  );
};

export default Box;
