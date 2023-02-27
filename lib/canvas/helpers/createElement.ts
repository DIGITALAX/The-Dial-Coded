import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const createElement = (
  pan: { xOffset: number; yOffset: number },
  canvas: HTMLCanvasElement,
  zoom: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string,
  id: number,
  strokeWidth?: number,
  fill?: string,
  fillStyle?: string,
  stroke?: string,
  image?: HTMLImageElement,
): ElementInterface | undefined => {
  const bounds = canvas?.getBoundingClientRect();
  switch (type) {
    case "line":
    case "ell":
      return {
        id,
        type,
        x1,
        y1,
        x2: x2 - x1,
        y2: y2 - y1,
        fill,
        stroke,
        strokeWidth,
        fillStyle,
      };
    case "rect":
      return {
        id,
        type,
        x1,
        y1,
        x2: x2 - x1,
        y2: y2 - y1,
        fill,
        stroke,
        strokeWidth,
        fillStyle,
      };
    case "pencil":
      return {
        id,
        type,
        points: [
          {
            x:
              ((x1 -
                canvas?.offsetLeft -
                bounds?.left -
                pan.xOffset * zoom * zoom) /
                zoom) *
              devicePixelRatio,
            y:
              ((y1 -
                canvas?.offsetTop -
                bounds?.top -
                pan.yOffset * zoom * zoom) /
                zoom) *
              devicePixelRatio,
          },
        ],
        fill,
        strokeWidth,
      };
    case "text":
      return {
        id,
        type,
        x1: x1 - bounds?.left,
        y1: y1 - bounds?.top,
        x2: x2 - bounds?.left,
        y2: y2 - bounds?.top,
        fill,
        strokeWidth,
        text: "",
      };
    case "image":
      return {
        id,
        type,
        x1: ((x1 - pan.xOffset * zoom * zoom) / zoom) * devicePixelRatio,
        y1: ((y1 - pan.yOffset * zoom * zoom) / zoom) * devicePixelRatio,
        x2: ((x2 - pan.xOffset * zoom * zoom) / zoom) * devicePixelRatio,
        y2: ((y2 - pan.yOffset * zoom * zoom) / zoom) * devicePixelRatio,
        image,
      };
    case "marquee":
      return {
        id,
        type,
        x1,
        y1,
        x2: x2 - x1,
        y2: y2 - y1,
        stroke: "#929292",
        lineDash: [10, 10],
      };
  }
};

export default createElement;
