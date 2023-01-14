import { FunctionComponent, MouseEvent } from "react";
import { BoardProps } from "../types/canvas.types";

const Board: FunctionComponent<BoardProps> = ({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  zoom,
}): JSX.Element => {
  return (
    <canvas
      ref={canvasRef}
      className="relative z-0 rounded-lg"
      style={{ width: "100%", height: "100%" }}
      width={String(
        (document.getElementById("parent")?.offsetWidth as number) / zoom
      )}
      height={String(
        (document.getElementById("parent")?.offsetHeight as number) / zoom
      )}
      onMouseDown={(e: MouseEvent<HTMLCanvasElement>) => handleMouseDown(e)}
      onMouseUp={(e: MouseEvent<HTMLCanvasElement>) => handleMouseUp(e)}
      onMouseMove={(e: MouseEvent<HTMLCanvasElement>) => handleMouseMove(e)}
    ></canvas>
  );
};

export default Board;
