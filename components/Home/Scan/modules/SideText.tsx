import { FunctionComponent } from "react";

const SideText: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative col-start-1 w-fit h-fit self-center justify-self-start grid grid-flow-row auto-rows-auto">
      <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-lg text-left">
        SOME TEXT ABOUT SITE GOES HERE
      </div>
      <div className="relative w-fit h-fit row-start-2 text-white font-dosis text-5xl uppercase text-left pb-3 pt-1">
        More text
      </div>
      <div className="relative w-fit h-fit row-start-3 text-white font-dosis text-xl text-left">
        And description sentence goes here continued on this line.
      </div>
    </div>
  );
};

export default SideText;
