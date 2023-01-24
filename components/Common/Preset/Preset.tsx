import { FunctionComponent } from "react";
import { PresetProps } from "../types/common.types";

const Preset: FunctionComponent<PresetProps> = ({
  index,
  format,
  dispatch,
  handleOnClick,
  searchTarget,
}): JSX.Element => {
  return (
    <span
      key={index}
      className={`relative w-fit h-fit inline-flex items-center px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-white text-offBlack/80 lowercase underline underline-offset-2 drop-shadow-md md:whitespace-nowrap place-self-center text-xs galaxy:text-sm md:text-base`}
      onClick={() => handleOnClick(format, dispatch, searchTarget)}
    >
      {format}
    </span>
  );
};

export default Preset;
