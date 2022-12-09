import { FunctionComponent } from "react";
import { SideTextProps } from "../types/scan.types";

const SideText: FunctionComponent<SideTextProps> = ({
  imageArtist,
  imageDescription,
  imageTitle,
  currentSetting,
}): JSX.Element => {
  return (
    <div className="relative col-start-1 w-fit h-fit self-center justify-self-start grid grid-flow-row auto-rows-auto">
      <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-lg text-left capitalize">
        {imageArtist[currentSetting - 1]}
      </div>
      <div className="relative w-fit h-fit row-start-2 text-white font-dosis text-5xl uppercase text-left pb-3 pt-1">
        {imageTitle[currentSetting - 1]}
      </div>
      <div className="relative w-fit h-fit row-start-3 text-white font-dosis text-xl text-left">
        {imageDescription[currentSetting - 1]}
      </div>
    </div>
  );
};

export default SideText;
