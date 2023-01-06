import { FunctionComponent, MouseEvent } from "react";
import { BoardProps } from "../types/canvas.types";

const Board: FunctionComponent<BoardProps> = ({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseWheel,

}): JSX.Element => {

  return (
    <canvas
      ref={canvasRef}
      className="relative z-0 rounded-lg"
      style={{ width: "100%", height: "100%" }}
      width={(document.getElementById("parent")?.offsetWidth as number) * 1}
      height={
        (document.getElementById("parent")?.offsetHeight as number) * 1
      }
      onMouseDown={(e: MouseEvent<HTMLCanvasElement>) => handleMouseDown(e)}
      onMouseUp={(e: MouseEvent<HTMLCanvasElement>) => handleMouseUp(e)}
      onMouseMove={(e: MouseEvent<HTMLCanvasElement>) => handleMouseMove(e)}
      onWheel={(e: MouseEvent<HTMLCanvasElement>) => handleMouseWheel(e)}
    ></canvas>
  );
};

export default Board;
