import { FunctionComponent, MouseEvent } from "react";
import { BoardProps } from "../types/canvas.types";

const Board: FunctionComponent<BoardProps> = ({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}): JSX.Element => {
  console.log(window.innerHeight)
  console.log(window.innerWidth)
  return (
    <canvas
      ref={canvasRef}
      className="relative z-0 rounded-lg"
      style={{ width: "100%", height: "100%" }}
      width={document.getElementById("parent")?.offsetWidth}
      height={document.getElementById("parent")?.offsetHeight}
      onMouseDown={(e: MouseEvent<HTMLCanvasElement>) => handleMouseDown(e)}
      onMouseUp={(e: MouseEvent<HTMLCanvasElement>) => handleMouseUp(e)}
      onMouseMove={(e: MouseEvent<HTMLCanvasElement>) => handleMouseMove(e)}
    ></canvas>
  );
};

export default Board;
