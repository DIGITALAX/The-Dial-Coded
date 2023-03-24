import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";

export const resetCanvas = (
  elements: ElementInterface[],
  canvasState: HTMLCanvasElement
): {
  zoom: number;
  xOffset: number;
  yOffset: number;
} => {
  let xOffset, yOffset;
  const elementBounds = getAllElementsBounds(elements);
  const canvasWidth = canvasState?.width || 0;
  const canvasHeight = canvasState?.height || 0;
  const width = elementBounds!.maxX - elementBounds!.minX;
  const height = elementBounds!.maxY - elementBounds!.minY;
  const centerX = (elementBounds!.maxX + elementBounds!.minX) / 2;
  const centerY = (elementBounds!.maxY + elementBounds!.minY) / 2;
  const zoomX = canvasWidth / width;
  const zoomY = canvasHeight / height;
  const zoom = Math.min(zoomX, zoomY);

  if (zoom <= 0.03) {
    xOffset = 0;
    yOffset = 0;
  } else {
    xOffset = canvasWidth / 2 - zoom * centerX;
    yOffset = canvasHeight / 2 - zoom * centerY;
  }

  return {
    zoom,
    xOffset,
    yOffset,
  };
};

export const getAllElementsBounds = (elements: ElementInterface[]) => {
  if (elements.length === 0) {
    return null;
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  elements.forEach((element) => {
    if (element.type === "pencil" && element.points) {
      element.points.forEach(({ x, y }) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    }
  });
  console.log({
    minX,
    minY,
    maxX,
    maxY,
  });
  return { minX, minY, maxX, maxY };
};
