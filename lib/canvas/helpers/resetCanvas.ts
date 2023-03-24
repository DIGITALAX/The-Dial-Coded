import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";

export const resetCanvas = (
  elements: ElementInterface[],
  canvasState: HTMLCanvasElement
): {
  zoom: number;
  xOffset: number;
  yOffset: number;
} => {
  let xOffset, yOffset, zoom;
  if (elements.length < 1) {
    xOffset = 0;
    yOffset = 0;
    zoom = 1;
  } else {
    const elementBounds = getAllElementsBounds(elements);
    const canvasWidth = canvasState?.width || 0;
    const canvasHeight = canvasState?.height || 0;
    const width = elementBounds!.maxX - elementBounds!.minX;
    const height = elementBounds!.maxY - elementBounds!.minY;
    const centerX = (elementBounds!.maxX + elementBounds!.minX) / 2;
    const centerY = (elementBounds!.maxY + elementBounds!.minY) / 2;
    const zoomX = canvasWidth / width;
    const zoomY = canvasHeight / height;
    zoom = Math.min(zoomX, zoomY);

    if (zoom <= 0.03) {
      xOffset = 0;
      yOffset = 0;
    } else {
      xOffset = canvasWidth / 2 - zoom * centerX;
      yOffset = canvasHeight / 2 - zoom * centerY;
    }
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
    } else if (
      element.type === "rect" ||
      element.type === "line" ||
      element.type === "image"
    ) {
      minX = Math.min(minX, element.x1!);
      minY = Math.min(minY, element.y1!);
      maxX = Math.max(maxX, element.x2! + element.x1!);
      maxY = Math.max(maxY, element.y2! + element.y1!);
    } else if (element.type === "text") {
      minX = Math.min(minX, element.x1!);
      minY = Math.min(minY, element.y1!);
      maxX = Math.max(maxX, element.x2!);
      maxY = Math.max(maxY, element.y2!);
    } else if (element.type === "ell") {
      const left = element.x1! - element.x2! / 2;
      const right = element.x1! + element.x2! / 2;
      const top = element.y1! - element.y2! / 2;
      const bottom = element.y1! + element.y2! / 2;
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, right);
      maxY = Math.max(maxY, bottom);
    }
  });
  return { minX, minY, maxX, maxY };
};
