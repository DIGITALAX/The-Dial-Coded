import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { CanvasOptionProps } from "../types/common.types";

const CanvasOption: FunctionComponent<CanvasOptionProps> = ({
  setShowBool,
  setShowString,
  bool_option,
  string_option,
  image,
  bgColor,
  width,
  height,
  color,
}): JSX.Element => {
  return (
    <div
      className={`relative w-12 h-12 rounded-md ${
        bgColor ? `bg-${bgColor}` : !color && "bg-ocean"
      } ${
        !color && "border border-white"
      } grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-start`}
      onClick={
        setShowBool
          ? () => setShowBool(!bool_option)
          : setShowString
          ? () => setShowString(string_option as string)
          : () => {}
      }
    >
      <div className="col-start-1 relative w-fit h-fit place-self-center flex">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${image}`}
          width={width}
          height={height}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default CanvasOption;
