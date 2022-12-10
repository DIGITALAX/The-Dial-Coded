import Image from "next/image";
import { FunctionComponent } from "react";
import useSlider from "./hooks/useSlider";
import Samples from "./modules/Samples/Samples";
import SliderSwitch from "./SliderSwitch";

const Slider: FunctionComponent = (): JSX.Element => {
  const {
    scannerSlider,
    dropsSlider,
    highlightsSlider,
    reachSlider,
    recordsSlider,
  } = useSlider();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white py-10 pl-10 gap-10">
      <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto gap-4">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 col-span-1">
          <div className="relative w-fit h-fit row-start-1 place-self-center cursor-pointer hover:opacity-80 active:opacity-70">
            <Image
              width={40}
              height={40}
              src="https://thedial.infura-ipfs.io/ipfs/QmeEDch97j4u2fKzsSTZk5WxE4CWDppqngEXHmTJ9hne5T"
              alt="forward"
            />
          </div>
          <div className="relative w-fit h-fit row-start-2 place-self-center cursor-pointer hover:opacity-80 scale-x-[-1] active:opacity-70">
            <Image
              width={40}
              height={40}
              src="https://thedial.infura-ipfs.io/ipfs/QmeEDch97j4u2fKzsSTZk5WxE4CWDppqngEXHmTJ9hne5T"
              alt="back"
            />
          </div>
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
    </div>
  );
};

export default Slider;
