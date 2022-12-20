import { FunctionComponent } from "react";
import { SideTextProps } from "../types/scan.types";

const SideText: FunctionComponent<SideTextProps> = ({
  imageArtist,
  imageDescription,
  imageTitle,
  currentSetting,
}): JSX.Element => {
  return (
    <div className="relative row-start-1 col-start-1 w-fit h-fit self-center justify-self-start grid grid-flow-row auto-rows-auto top-48 sm:top-28 md:top-0">
      <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-xl text-left capitalize">
        {imageArtist[currentSetting]}
      </div>
      <div className="relative w-fit h-fit row-start-2 text-white font-dosis text-5xl uppercase text-left pb-6 pt-2">
        {imageTitle[currentSetting]}
      </div>
      <div className="relative w-fit h-fit row-start-3 text-white font-dosis text-md text-left w-96">
        {imageDescription[currentSetting]}
      </div>
    </div>
  );
};

export default SideText;
