import { FunctionComponent } from "react";
import { BottomMenuProps } from "../../types/canvas.types";
import BottomOptions from "./BottomOptions";
import { FiTool } from "react-icons/fi";

const BottomMenu: FunctionComponent<BottomMenuProps> = ({
  setShowBottomDrawOptions,
  showBottomDrawOptions,
  colorPicker,
  setColorPicker,
  hex,
  setHex,
  setShapeFillType,
  setThickness,
  thickness,
  setBrushWidth,
  brushWidth,
  setTool,
  shapes,
  setShapes,
}): JSX.Element => {
  return (
    <div className="absolute w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto justify-self-start self-end p-3 gap-2 z-10">
      <div
        className="relative w-12 h-12 rounded-md bg-white grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-end"
        onClick={() => setShowBottomDrawOptions(!showBottomDrawOptions)}
      >
        <div className="col-start-1 relative w-fit h-fit place-self-center">
          <FiTool color="black" size={20} />
        </div>
      </div>
      {showBottomDrawOptions && (
        <BottomOptions
          colorPicker={colorPicker}
          hex={hex}
          setHex={setHex}
          setColorPicker={setColorPicker}
          setShapeFillType={setShapeFillType}
          setThickness={setThickness}
          thickness={thickness}
          setBrushWidth={setBrushWidth}
          brushWidth={brushWidth}
          setTool={setTool}
          shapes={shapes}
          setShapes={setShapes}
        />
      )}
    </div>
  );
};

export default BottomMenu;
