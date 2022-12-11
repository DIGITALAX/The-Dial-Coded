import { FunctionComponent } from "react";
import { PresetProps } from "../types/common.types";

const Preset: FunctionComponent<PresetProps> = ({
  index,
  format,
}): JSX.Element => {
  return (
    <span
      key={index}
      className={`relative w-fit h-fit inline-flex items-center px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-white text-offBlack/80 lowercase underline underline-offset-2 drop-shadow-md whitespace-nowrap place-self-center`}
    >
      {format}
    </span>
  );
};

export default Preset;
