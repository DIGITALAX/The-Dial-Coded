import { FunctionComponent } from "react";
import Rewind from "../../../Common/Miscellaneous/Rewind/Rewind";
import useSlider from "./hooks/useSlider";
import Presets from "./modules/Presets/Presets";
import Samples from "./modules/Samples/Samples";
import SliderSwitch from "./SliderSwitch";

const Slider: FunctionComponent = (): JSX.Element => {
  const {
    scannerSlider,
    dropsSlider,
    highlightsSlider,
    reachSlider,
    recordsSlider,
    handleBackward,
    handleForward,
    currentValue
  } = useSlider();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white py-10 pl-10 gap-10">
      <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto gap-4">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 col-span-1">
          <Rewind
            row={"1"}
            handleValueChange={handleForward}
            limitValue={4}
            currentValue={currentValue}
          />
          <Rewind
            row={"2"}
            scale={"-1"}
            handleValueChange={handleBackward}
            limitValue={0}
            currentValue={currentValue}
          />
        </div>
        <SliderSwitch
          scannerSlider={scannerSlider}
          dropsSlider={dropsSlider}
          reachSlider={reachSlider}
          recordsSlider={recordsSlider}
          highlightsSlider={highlightsSlider}
        />
      </div>
      <Samples />
      <Presets />
    </div>
  );
};

export default Slider;
