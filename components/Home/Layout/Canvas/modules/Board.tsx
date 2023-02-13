import { FunctionComponent, MouseEvent, WheelEvent } from "react";
import { BoardProps } from "../types/canvas.types";

const Board: FunctionComponent<BoardProps> = ({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  synthArea,
  handleMouseDownPattern,
  handleMouseMovePattern,
  handleWheel,
  handleWheelPattern,
  canvasPatternRef,
}): JSX.Element => {
  return (
    <canvas
      id="canvasId"
      ref={synthArea ? canvasPatternRef : canvasRef}
      className="relative z-0 rounded-lg"
      style={{ width: "100%", height: "100%" }}
      width={String(
        (document.getElementById("parent")?.offsetWidth as number)
      )}
      height={String(
        (document.getElementById("parent")?.offsetHeight as number)
      )}
      onMouseDown={(e: MouseEvent<HTMLCanvasElement>) =>
        synthArea ? handleMouseDownPattern(e) : handleMouseDown(e)
      }
      onMouseUp={(e: MouseEvent<HTMLCanvasElement>) => handleMouseUp(e)}
      onMouseMove={(e: MouseEvent<HTMLCanvasElement>) =>
        synthArea ? handleMouseMovePattern(e) : handleMouseMove(e)
      }
      onWheel={(e: WheelEvent<HTMLCanvasElement>) =>
        synthArea ? handleWheelPattern(e) : handleWheel(e)
      }
    ></canvas>
  );
};

export default Board;
