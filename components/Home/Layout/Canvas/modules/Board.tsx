import { FunctionComponent, useLayoutEffect, useRef, useState } from "react";
import { BoardProps } from "../types/canvas.types";
import CanvasDraw from "@win11react/react-canvas-draw";

const Board: FunctionComponent<BoardProps> = ({
  canvasRef,
  drawing,
  hex,
  brushWidth,
}): JSX.Element => {

  return (
    <div ref={parentRef} className="relative w-full h-full z-0">
      <CanvasDraw
        ref={canvasRef}
        lazyRadius={0}
        hideGrid={true}
        brushColor={hex}
        brushRadius={brushWidth}
        canvasWidth={width}
        canvasHeight={height}
        enablePanAndZoom={true}
        style={{ backgroundColor: "transparent", width: width, height: height }}
      />
    </div>
  );
};

export default Board;
