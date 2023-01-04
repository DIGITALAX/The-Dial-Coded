import { FunctionComponent } from "react";
import ColorPicker from "./ColorPicker";
import { DrawOptionsProps } from "../types/canvas.types";

const DrawOptions: FunctionComponent<DrawOptionsProps> = ({
  hex,
  setHex,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto">
      <ColorPicker hex={hex} setHex={setHex} />
    </div>
  );
};

export default DrawOptions;
