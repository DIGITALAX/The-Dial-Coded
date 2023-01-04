import { FunctionComponent } from "react";
import { DrawProps } from "../types/canvas.types";
import Menu from "./Menu";
import Board from "./Board";

const Draw: FunctionComponent<DrawProps> = ({
  setShowDrawOptions,
  showDrawOptions,
  hex,
  setHex,
  drawing,
  canvasRef,
  brushWidth
}): JSX.Element => {
  return (
    <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
      <Menu
        hex={hex}
        setHex={setHex}
        showDrawOptions={showDrawOptions}
        setShowDrawOptions={setShowDrawOptions}
      />
      <Board drawing={drawing} canvasRef={canvasRef} brushWidth={brushWidth} hex={hex} />
    </div>
  );
};
export default Draw;
