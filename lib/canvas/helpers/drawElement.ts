import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";
import getStroke from "perfect-freehand";
import getSvgPathFromStroke from "./getSvgPathFromStroke";

const drawElement = (
  element: ElementInterface,
  ctx: CanvasRenderingContext2D | null,
  zoom: number,
  canvas: HTMLCanvasElement
) => {
  ctx?.setLineDash(element?.lineDash ? element?.lineDash : [0]);
  (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;
  switch (element?.type) {
    case "line":
      ctx?.beginPath();
      (ctx as CanvasRenderingContext2D).strokeStyle = element.stroke as string;
      (ctx as CanvasRenderingContext2D).lineWidth =
        (element.strokeWidth as number) / zoom;
      ctx?.moveTo(element.x1 as number, element.y1 as number);
      ctx?.lineTo(
        (element.x2 as number) + (element.x1 as number),
        (element.y2 as number) + (element.y1 as number)
      );
      ctx?.stroke();
      ctx?.closePath;
      break;

    case "ell":
      ctx?.beginPath();
      if (element.fillStyle === "hachure") {
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
        (ctx as CanvasRenderingContext2D).lineWidth =
          (element.strokeWidth as number) / zoom;
        ctx?.ellipse(
          element.x1 as number,
          element.y1 as number,
          Math.abs(element.x2 as number),
          Math.abs(element.y2 as number),
          0,
          0,
          2 * Math.PI
        );
        ctx?.stroke();
      } else {
        (ctx as CanvasRenderingContext2D).fillStyle = element.fill as string;
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
        ctx?.ellipse(
          element.x1 as number,
          element.y1 as number,
          Math.abs(element.x2 as number),
          Math.abs(element.y2 as number),
          0,
          0,
          2 * Math.PI
        );
        ctx?.fill();
      }
      ctx?.closePath;
      break;

    case "rect":
      ctx?.beginPath();
      if (element.fillStyle === "hachure") {
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
        (ctx as CanvasRenderingContext2D).lineWidth =
          (element.strokeWidth as number) / zoom;
        ctx?.strokeRect(
          element.x1 as number,
          element.y1 as number,
          element.x2 as number,
          element.y2 as number
        );
      } else {
        (ctx as CanvasRenderingContext2D).fillStyle = element.fill as string;
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
        ctx?.rect(
          element.x1 as number,
          element.y1 as number,
          element.x2 as number,
          element.y2 as number
        );
        ctx?.fill();
      }
      ctx?.closePath;
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
        (element.text as string) !== undefined ? (element.text as string) : "",
        element.x1 as number,
        element.y1 as number
      );
      break;

    case "image":
      if (element.fill) {
        (ctx as CanvasRenderingContext2D).strokeStyle = "#078FD6";
        (ctx as CanvasRenderingContext2D).lineWidth = 5 / zoom;
        ctx?.drawImage(
          element?.image as HTMLImageElement,
          element.x1 as number,
          element.y1 as number,
          (element.x2 as number) - (element.x1 as number),
          (element.y2 as number) - (element.y1 as number)
        );
        canvas.toDataURL("image/jpeg", 0.75);
        ctx?.strokeRect(
          element.x1 as number,
          element.y1 as number,
          (element.x2 as number) - (element.x1 as number),
          (element.y2 as number) - (element.y1 as number)
        );
      } else {
        ctx?.drawImage(
          element?.image as HTMLImageElement,
          element.x1 as number,
          element.y1 as number,
          (element.x2 as number) - (element.x1 as number),
          (element.y2 as number) - (element.y1 as number)
        );
        canvas.toDataURL("image/jpeg", 0.75);
      }
      break;

    case "marquee":
      ctx?.beginPath();
      (ctx as CanvasRenderingContext2D).strokeStyle = element.stroke as string;
      (ctx as CanvasRenderingContext2D).lineWidth = 1 / zoom;
      ctx?.setLineDash([5, 5]);
      ctx?.strokeRect(
        element.x1 as number,
        element.y1 as number,
        element.x2 as number,
        element.y2 as number
      );
      ctx?.closePath;
      break;
  }
};

export default drawElement;
