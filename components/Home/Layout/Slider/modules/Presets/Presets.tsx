import { FunctionComponent } from "react";
import usePresets from "./hooks/usePresets";
import lodash from "lodash";
import Preset from "../../../../../Common/Preset/Preset";

const Presets: FunctionComponent = (): JSX.Element => {
  const { more, setMore, presetOptions } = usePresets();
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto row-start-5 gap-5 pt-10 pl-20">
      <div className="relative row-start-1 w-fit h-fit justify-self-start text-black font-dosis text-left text-lg">
        Common, novel & highlighted presets:
      </div>
      <div className="relative w-11/12 h-full row-start-2 flex flex-wrap justify-center gap-2 place-self-center text-center min-h-96">
        {(more ? presetOptions : lodash.slice(presetOptions, 0, 13)).map(
          (format: string, index: number) => {
            return <Preset index={index} format={format} key={index} />;
          }
        )}
        {presetOptions.length > 13 && (
          <div
            className="row-start-2 relative w-fit h-9 inline-flex rounded-full shadow-sm grid grid-flow-col auto-cols-[auto auto] cursor-pointer active:scale-95"
            onClick={() => setMore(!more)}
          >
            <div className="relative w-fit h-fit place-self-center col-start-1 grid grid-flow-col auto-cols-[auto auto] px-2 py-2 gap-1 hover:opacity-60">
              <div className="relative w-1 h-1 rounded-full bg-black col-start-1"></div>
              <div className="relative w-1 h-1 rounded-full bg-black col-start-2"></div>
              <div className="relative w-1 h-1 rounded-full bg-black col-start-3"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Presets;
