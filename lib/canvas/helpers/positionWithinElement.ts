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
  const bounds = canvas.getBoundingClientRect();
  const ctx = canvas.getContext("2d");
  switch (element.type) {
    case "rect":
      let updatedX2: number,
        updatedY2: number,
        updatedX1: number,
        updatedY1: number;
      if (element.x2! < 1) {
        updatedX1 = element.x2! + element.x1!;
        updatedX2 = element.x1!;
      } else {
        updatedX1 = element.x1!;
        updatedX2 = element.x2! + element.x1!;
      }
      if (element.y2! < 1) {
        updatedY1 = element.y2! + element.y1!;
        updatedY2 = element.y1!;
      } else {
        updatedY1 = element.y1!;
        updatedY2 = element.y2! + element.y1!;
      }
      const topLeft = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        updatedX1 * zoom,
        updatedY1 * zoom,
        "tl"
      );
      const topRight = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        updatedX2 * zoom,
        updatedY1 * zoom,
        "tr"
      );
      const bottomLeft = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        updatedX1 * zoom,
        updatedY2 * zoom,
        "bl"
      );
      const bottomRight = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        updatedX2 * zoom,
        updatedY2 * zoom,
        "br"
      );
      const inside =
        (x - bounds?.left - pan.xOffset) * devicePixelRatio >=
          updatedX1 * zoom &&
        (x - bounds?.left - pan.xOffset) * devicePixelRatio <=
          updatedX2 * zoom &&
        (y - bounds?.top - pan.yOffset) * devicePixelRatio >=
          updatedY1 * zoom &&
        (y - bounds?.top - pan.yOffset) * devicePixelRatio <= updatedY2 * zoom
          ? "inside"
          : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "ell":
      const ellInside = insideEllipse(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        element.x1! * zoom,
        element.y1! * zoom,
        (element.x2! + element.x1!) * zoom,
        (element.y2! + element.y1!) * zoom
      );
      return ellInside < 0.1 && ellInside > 0.6 * 0.1
        ? "edge"
        : ellInside < 0.1 && "inside";
    case "line":
      const on = onLine(
        element.x1! * zoom,
        element.y1! * zoom,
        (element.x2! + element.x1!) * zoom,
        (element.y2! + element.y1!) * zoom,
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        1
      );
      const start = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        element.x1! * zoom,
        element.y1! * zoom,
        "start"
      );
      const end = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        (element.x2! + element.x1!) * zoom,
        (element.y2! + element.y1!) * zoom,
        "end"
      );
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
              ((x - bounds?.left - pan.xOffset) / zoom) * devicePixelRatio,
              ((y - bounds.top - pan.yOffset) / zoom) * devicePixelRatio,
              element.strokeWidth!
            ) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      } else {
        const onPoint = onOnePoint(
          ((x - bounds?.left - pan.xOffset) / zoom) * devicePixelRatio,
          ((y - bounds.top - pan.yOffset) / zoom) * devicePixelRatio,
          element.points?.[0]?.x!,
          element.points?.[0]?.y!,
          element.strokeWidth!
        );
        return onPoint ? "inside" : null;
      }

    case "text":
      const baselineOffset = ctx?.measureText("M").width! / 2;
      return ((x - bounds.left - pan.xOffset) * devicePixelRatio) / zoom >=
        element.x1! &&
        ((x - bounds.left - pan.xOffset) * devicePixelRatio) / zoom <=
          element.x2! &&
        ((y - bounds.top - pan.yOffset) * devicePixelRatio) / zoom >=
          element.y1! &&
        ((y - bounds.top - pan.yOffset - baselineOffset) * devicePixelRatio) /
          zoom <=
          element.y2!
        ? "inside"
        : null;
    case "image":
      const topImageLeft = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        element.x1! * zoom,
        element.y1! * zoom,
        "tl"
      );
      const topImageRight = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        element.x2! * zoom,
        element.y1! * zoom,
        "tr"
      );
      const bottomImageLeft = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        element.x1! * zoom,
        element.y2! * zoom,
        "bl"
      );
      const bottomImageRight = nearPoint(
        (x - bounds?.left - pan.xOffset) * devicePixelRatio,
        (y - bounds?.top - pan.yOffset) * devicePixelRatio,
        element.x2! * zoom,
        element.y2! * zoom,
        "br"
      );
      const insideImage =
        (x - bounds?.left - pan.xOffset) * devicePixelRatio >=
          element.x1! * zoom &&
        (x - bounds?.left - pan.xOffset) * devicePixelRatio <=
          element.x2! * zoom &&
        (y - bounds?.top - pan.yOffset) * devicePixelRatio >=
          element.y1! * zoom &&
        (y - bounds?.top - pan.yOffset) * devicePixelRatio <= element.y2! * zoom
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
