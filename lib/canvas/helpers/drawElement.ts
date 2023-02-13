import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";
import getStroke from "perfect-freehand";
import getSvgPathFromStroke from "./getSvgPathFromStroke";

const drawElement = (
  element: ElementInterface,
  roughCanvas: any,
  ctx: CanvasRenderingContext2D | null,
  zoom: number,
  canvas: HTMLCanvasElement,
  pan: {
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  }
) => {
  console.log(pan.xOffset, pan.yOffset);
  ctx?.setLineDash(element?.lineDash ? element?.lineDash : [0]);
  (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;
  switch (element?.type) {
    case "line":
    case "ell":
    case "rect":
      roughCanvas?.draw(element.roughElement);
      break;

    case "pencil":
      (ctx as CanvasRenderingContext2D).fillStyle = element?.fill as string;
      const pathData = getSvgPathFromStroke(
        getStroke(element?.points as { x: number; y: number }[], {
          size: element?.strokeWidth as number,
        })
      );
      ctx?.fill(new Path2D(pathData));
      break;

    case "text":
      (ctx as CanvasRenderingContext2D).textBaseline = "top";
      (ctx as CanvasRenderingContext2D).font = `${
        (element.strokeWidth as number) * devicePixelRatio
      }px dosis`;
      (ctx as CanvasRenderingContext2D).fillStyle = element.fill as string;
      (ctx as CanvasRenderingContext2D).fillText(
        element.text as string,
        element.x1 as number,
        element.y1 as number
      );
      break;

    case "image":
      ctx?.drawImage(
        element?.image as HTMLImageElement,
        element.x1 as number,
        element.y1 as number,
        (element.x2 as number) - (element.x1 as number),
        (element.y2 as number) - (element.y1 as number)
      );
      canvas.toDataURL("image/jpeg", 0.75);
      break;

    case "marquee":
      ctx?.beginPath();
      (ctx as CanvasRenderingContext2D).strokeStyle = element.stroke as string;
      (ctx as CanvasRenderingContext2D).lineWidth = 1 / zoom;
      ctx?.strokeRect(
        element.x1 as number,
        element.y1 as number,
        element.x2 as number,
        element.y2 as number
      );
      ctx?.closePath();
      break;
  }
};

export default drawElement;
