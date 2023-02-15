import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";
import insideEllipse from "./insideEllipse";
import nearPoint from "./nearPoint";
import onLine from "./onLine";
import onOnePoint from "./onOnePoint";

const positionWithinElement = (
  x: number,
  y: number,
  element: ElementInterface,
  canvas: HTMLCanvasElement,
  zoom: number,
  pan: {
    xOffset: number;
    yOffset: number;
  }
) => {
  const { type, x1, x2, y1, y2 } = element;
  const bounds = canvas.getBoundingClientRect();
  const mouseX = (x / (devicePixelRatio * zoom) - pan.xOffset) / zoom;
  const mouseY = (y / (devicePixelRatio * zoom) - pan.yOffset) / zoom;
  console.log({
    x: (x - bounds?.left - pan.xOffset*zoom*zoom) * devicePixelRatio,
    y: (y - bounds?.top - pan.yOffset*zoom*zoom) * devicePixelRatio,
    x1: (x1 as number) * zoom,
    y1: (y1 as number) * zoom,
    x2: ((x2 as number) + (x1 as number)) * zoom,
    y2: ((y2 as number) + (y1 as number)) * zoom,
  });
  switch (type) {
    case "rect":
      const topLeft = nearPoint(
        (x - bounds?.left - pan.xOffset*zoom*zoom) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset*zoom*zoom) * devicePixelRatio,
        (x1 as number) * zoom,
        (y1 as number) * zoom,
        "tl"
      );
      const topRight = nearPoint(
        (x - bounds?.left - pan.xOffset*zoom*zoom) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset*zoom*zoom) * devicePixelRatio,
        ((x2 as number) + (x1 as number)) * zoom,
        (y1 as number) * zoom,
        "tr"
      );
      const bottomLeft = nearPoint(
        (x - bounds?.left - pan.xOffset*zoom*zoom) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset*zoom*zoom) * devicePixelRatio,
        (x1 as number) * zoom,
        ((y2 as number) + (y1 as number)) * zoom,
        "bl"
      );
      const bottomRight = nearPoint(
        (x - bounds?.left - pan.xOffset*zoom*zoom) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset*zoom*zoom) * devicePixelRatio,
        ((x2 as number) + (x1 as number)) * zoom,
        ((y2 as number) + (y1 as number)) * zoom,
        "br"
      );
      const inside =
        (x - bounds?.left - pan.xOffset*zoom*zoom) * devicePixelRatio >=
          (x1 as number) * zoom &&
        (x - bounds?.left - pan.xOffset*zoom*zoom) * devicePixelRatio <=
          ((x2 as number) + (x1 as number)) * zoom &&
        (y - bounds?.top - pan.yOffset*zoom*zoom) * devicePixelRatio >=
          (y1 as number) * zoom &&
        (y - bounds?.top - pan.yOffset*zoom*zoom) * devicePixelRatio <=
          ((y2 as number) + (y1 as number)) * zoom
          ? "inside"
          : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "ell":
      const ellInside = insideEllipse(
        mouseX,
        mouseY,
        x1 as number,
        y1 as number,
        x2 as number,
        y2 as number
      );
      return ellInside < 0.3 && ellInside > 0.6 * 0.3
        ? "edge"
        : ellInside < 0.3 && "inside";
    case "line":
      const on = onLine(
        x1 as number,
        y1 as number,
        x2 as number,
        y2 as number,
        mouseX,
        mouseY,
        1
      );
      const start = nearPoint(
        mouseX,
        mouseY,
        x1 as number,
        y1 as number,
        "start"
      );
      const end = nearPoint(mouseX, mouseY, x2 as number, y2 as number, "end");
      return start || end || on;
    case "erase":
      break;
    case "pencil":
      if ((element.points as any).length > 1) {
        const betweenAnyPoint = element.points?.some((point, index) => {
          const nextPoint: any = (
            element.points as {
              x: number;
              y: number;
            }[]
          )[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(
              point.x,
              point.y,
              nextPoint.x,
              nextPoint.y,
              ((x - bounds?.left - pan.xOffset * zoom * zoom) / zoom) *
                devicePixelRatio,
              ((y - bounds.top - pan.yOffset * zoom * zoom) / zoom) *
                devicePixelRatio,
              element.strokeWidth as number
            ) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      } else {
        const onPoint = onOnePoint(
          ((x - bounds?.left - pan.xOffset * zoom * zoom) / zoom) *
            devicePixelRatio,
          ((y - bounds.top - pan.yOffset * zoom * zoom) / zoom) *
            devicePixelRatio,
          element.points?.[0]?.x as number,
          element.points?.[0]?.y as number,
          element.strokeWidth as number
        );
        return onPoint ? "inside" : null;
      }

    case "text":
      return x - bounds.left >= (x1 as number) &&
        x <= (x2 as number) &&
        y - bounds.top >= (y1 as number) &&
        y <= (y2 as number)
        ? "inside"
        : null;
    case "image":
      const topImageLeft = nearPoint(
        x - bounds.left,
        y - bounds.top,
        x1 as number,
        y1 as number,
        "tl"
      );
      const topImageRight = nearPoint(
        x - bounds.left,
        y - bounds.top,
        x2 as number,
        y1 as number,
        "tr"
      );
      const bottomImageLeft = nearPoint(
        x - bounds.left,
        y - bounds.top,
        x1 as number,
        y2 as number,
        "bl"
      );
      const bottomImageRight = nearPoint(
        x - bounds.left,
        y - bounds.top,
        x2 as number,
        y2 as number,
        "br"
      );
      const insideImage =
        x - bounds.left >= (x1 as number) &&
        x - bounds.left <= (x2 as number) &&
        y - bounds.top >= (y1 as number) &&
        y - bounds.top <= (y2 as number)
          ? "inside"
          : null;
      return (
        topImageLeft ||
        topImageRight ||
        bottomImageLeft ||
        bottomImageRight ||
        insideImage
      );
    case "marquee":
      break;
  }
};

export default positionWithinElement;
