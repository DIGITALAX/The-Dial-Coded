import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { RewindProps } from "../../types/common.types";

const Rewind: FunctionComponent<RewindProps> = ({
  row,
  scale,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit row-start-${row} place-self-center cursor-pointer hover:opacity-80 active:opacity-70 ${
        scale && "scale-x-[-1]"
      }`}
    >
      <Image
        width={40}
        height={40}
        src="https://thedial.infura-ipfs.io/ipfs/QmeEDch97j4u2fKzsSTZk5WxE4CWDppqngEXHmTJ9hne5T"
        alt="forward"
      />
    </div>
  );
};

export default Rewind;
