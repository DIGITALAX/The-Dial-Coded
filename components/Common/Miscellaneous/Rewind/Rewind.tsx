import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { RewindProps } from "../../types/common.types";

const Rewind: FunctionComponent<RewindProps> = ({
  row,
  scale,
  limitValue,
  currentValue,
  handleValueChange,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit row-start-${row} place-self-center ${
        scale && "scale-x-[-1]"
      } ${
        currentValue && currentValue === limitValue
          ? "opacity-40"
          : "cursor-pointer hover:opacity-80 active:opacity-70"
      }`}
      onClick={() => {
        handleValueChange && handleValueChange(currentValue as number);
      }}
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
