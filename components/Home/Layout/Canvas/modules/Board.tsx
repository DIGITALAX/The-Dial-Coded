import { FunctionComponent, MouseEvent, WheelEvent, TouchEvent } from "react";
import { BoardProps } from "../types/canvas.types";

const Board: FunctionComponent<BoardProps> = ({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  canvasType,
  handleMouseDownPattern,
  handleMouseMovePattern,
  handleWheel,
  handleWheelPattern,
  canvasPatternRef,
  handleMouseUpPattern,
}): JSX.Element => {
  return (
    <canvas
      id="canvasId"
      ref={canvasType ? canvasPatternRef : canvasRef}
      className="relative z-0 rounded-lg"
      style={{ width: "100%", height: "100%" }}
      width={String(document.getElementById("parent")?.offsetWidth as number)}
      height={String(document.getElementById("parent")?.offsetHeight as number)}
      onMouseDown={(e: MouseEvent<HTMLCanvasElement>) =>
        canvasType ? handleMouseDownPattern(e) : handleMouseDown(e)
      }
      onMouseUp={(e: MouseEvent<HTMLCanvasElement>) =>
        canvasType ? handleMouseUpPattern(e) : handleMouseUp(e)
      }
      onMouseMove={(e: MouseEvent<HTMLCanvasElement>) =>
        canvasType ? handleMouseMovePattern(e) : handleMouseMove(e)
      }
      onWheel={(e: WheelEvent<HTMLCanvasElement>) =>
        canvasType ? handleWheelPattern(e) : handleWheel(e)
      }
    ></canvas>
  );
};

export default Board;
