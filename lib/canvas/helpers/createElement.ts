import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const createElement = (
  pan: { xOffset: number; yOffset: number },
  canvas: HTMLCanvasElement,
  zoom: number,
  generator: any,
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
  image?: HTMLImageElement
): ElementInterface | undefined => {
  let roughElement;
  const bounds = canvas?.getBoundingClientRect();
  switch (type) {
    case "rect":
      roughElement = generator.rectangle(
        ((x1 - canvas?.offsetLeft - bounds?.left) / zoom) * devicePixelRatio,
        ((y1 - canvas?.offsetTop - bounds?.top) / zoom) * devicePixelRatio,
        ((x2 - x1) / zoom) * devicePixelRatio,
        ((y2 - y1) / zoom) * devicePixelRatio,
        {
          fill,
          stroke,
          strokeWidth,
          fillStyle,
        }
      );
      return {
        id,
        type,
        x1,
        y1,
        x2,
        y2,
        roughElement,
        fill,
        stroke,
        strokeWidth,
        fillStyle,
      };
    case "ell":
      roughElement = generator.ellipse(
        ((x1 - canvas?.offsetLeft - bounds?.left) / zoom) * devicePixelRatio,
        ((y1 - canvas?.offsetTop - bounds?.top) / zoom) * devicePixelRatio,
        (((x2 - x1) * Math.PI) / zoom) * devicePixelRatio,
        (((y2 - y1) * Math.PI) / zoom) * devicePixelRatio,
        {
          fill,
          stroke,
          strokeWidth,
          fillStyle,
        }
      );
      return {
        id,
        type,
        x1,
        y1,
        x2,
        y2,
        roughElement,
        fill,
        stroke,
        strokeWidth,
        fillStyle,
      };
    case "line":
      roughElement = generator.line(
        ((x1 - canvas?.offsetLeft - bounds?.left) / zoom) * devicePixelRatio,
        ((y1 - canvas?.offsetTop - bounds?.top) / zoom) * devicePixelRatio,
        ((x2 - canvas?.offsetLeft - bounds?.left) / zoom) * devicePixelRatio,
        ((y2 - canvas?.offsetTop - bounds?.top) / zoom) * devicePixelRatio,
        {
          strokeWidth,
          stroke,
        }
      );
      return {
        id,
        type,
        x1,
        y1,
        x2,
        y2,
        roughElement,
        stroke,
        strokeWidth,
      };

    case "pencil":
      return {
        id,
        type,
        points: [
          {
            x:
              ((x1 - canvas?.offsetLeft - bounds?.left - pan.xOffset * zoom*zoom) /
                zoom) *
              devicePixelRatio,
            y:
              ((y1 - canvas?.offsetTop - bounds?.top - pan.yOffset * zoom*zoom) /
                zoom) *
              devicePixelRatio,
          },
        ],
        fill: fill,
        strokeWidth,
      };
    case "text":
      return {
        id,
        type,
        x1: x1 - bounds?.left,
        y1: y1 - bounds?.top,
        x2: x2 + (strokeWidth as number),
        y2: y2 + (strokeWidth as number),
        fill,
        strokeWidth,
        text: "",
      };
    case "image":
      return {
        id,
        type,
        x1: (x1 / zoom) * devicePixelRatio,
        y1: (y1 / zoom) * devicePixelRatio,
        x2: (x2 / zoom) * devicePixelRatio,
        y2: (y2 / zoom) * devicePixelRatio,
        image,
      };
    case "marquee":
      return {
        id,
        type,
        x1: x1,
        y1: y1,
        x2: x2 - x1,
        y2: y2 - y1,
        stroke: "#929292",
        lineDash: [10, 10],
      };
  }
};

export default createElement;
