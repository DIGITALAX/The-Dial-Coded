import { RefObject } from "react";
import { SvgPatternType } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const getBoundingBox = (points: { x: number; y: number }[]) => {
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (let i = 1; i < points.length; i++) {
    const { x, y } = points[i];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

const createCanvasInit = (
  synthElementMove: SvgPatternType,
  canvasPatternRef: RefObject<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): string => {
  const bounds = getBoundingBox(synthElementMove.points!);
  const clippedCanvas = document.createElement("canvas");
  clippedCanvas.width = bounds.width!;
  clippedCanvas.height = bounds.height!;
  const clippedCtx = clippedCanvas.getContext("2d");
  clippedCtx?.beginPath();

  clippedCtx!.moveTo(
    synthElementMove.points![0].x,
    synthElementMove.points![0].y
  );
  for (let i = 1; i < synthElementMove.points!.length; i++) {
    clippedCtx!.lineTo(
      synthElementMove.points![i].x,
      synthElementMove.points![i].y
    );
  }
  clippedCtx!.closePath();
  clippedCtx!.drawImage(
    canvasPatternRef.current!,
    bounds.x + canvas.offsetLeft,
    bounds.y + canvas.offsetTop,
    bounds.width,
    bounds.height,
    0,
    0,
    bounds.width,
    bounds.height
  );
  return clippedCanvas.toDataURL("image/png");
};

export default createCanvasInit;
