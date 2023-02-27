import lodash from "lodash";
import { MouseEvent } from "react";
import { SvgPatternType } from "../../../components/Home/Layout/Canvas/types/canvas.types";
import onLine from "./onLine";

const onPatternElement = (
  elements: SvgPatternType[],
  zoom: number,
  pan: {
    xOffset: number;
    yOffset: number;
    xInitial: number;
    yInitial: number;
  },
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  template: boolean
) => {
  let positionArray: SvgPatternType[] = [];
  const bounds = canvas?.getBoundingClientRect();
  const ctx = canvas?.getContext("2d");
  if (!template) {
    lodash.filter(elements, (element: SvgPatternType) => {
      switch (element.type) {
        case "image":
          for (
            let i = 0;
            i < ((element.clipElement as SvgPatternType).points as {}[]).length;
            i++
          ) {
            const inside = isPointInsidePath(
              e.clientX - bounds.left,
              e.clientY - bounds.top,
              element?.clipElement as SvgPatternType,
              ctx as CanvasRenderingContext2D
            );

            if (inside) {
              positionArray.push({ ...element });
              return;
            }
          }
          break;

        case "text":
          ((e.clientX - bounds.left - pan.xOffset * zoom * zoom) *
            devicePixelRatio) /
            zoom >=
            (element.x1 as number) &&
          ((e.clientX - bounds.left - pan.xOffset * zoom * zoom) *
            devicePixelRatio) /
            zoom <=
            (element.x2 as number) &&
          ((e.clientY - bounds.top - pan.yOffset * zoom * zoom) *
            devicePixelRatio) /
            zoom >=
            (element.y1 as number) &&
          ((e.clientY - bounds.top - pan.yOffset * zoom * zoom) *
            devicePixelRatio) /
            zoom <=
            (element.y2 as number)
            ? "inside"
            : null;
          break;

        case "pencil":
          const returned = element.points?.some((point, index) => {
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
                ((e.clientX - bounds?.left) * devicePixelRatio) / zoom,
                ((e.clientY - bounds?.top) * devicePixelRatio) / zoom,
                2
              ) != null
            );
          });
          if (returned) {
            positionArray.push({ ...element });
            return;
          }
          break;
      }
    });
  } else {
    lodash.filter(elements, (element: SvgPatternType) => {
      if (
        element.type === "0" ||
        element.type === "1" ||
        element.type === "2"
      ) {
        const returned = element.points?.some((point, index) => {
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
              ((e.clientX - bounds?.left - pan.xOffset * 0.5 * zoom * zoom) *
                devicePixelRatio) /
                zoom,
              ((e.clientY - bounds?.top - pan.yOffset * 0.5 * zoom * zoom) *
                devicePixelRatio) /
                zoom,
              2
            ) != null
          );
        });
        if (returned) {
          positionArray.push({ ...element });
          return;
        }
      }
    });
  }

  return positionArray;
};

export default onPatternElement;

function isPointInsidePath(
  x: any,
  y: any,
  path: SvgPatternType,
  ctx: CanvasRenderingContext2D
) {
  ctx.save();
  ctx.beginPath();
  path.points?.forEach(function (point: any, index: number) {
    if (index === 0) {
      ctx.moveTo(point.x * devicePixelRatio, point.y * devicePixelRatio);
    } else {
      ctx.lineTo(point.x * devicePixelRatio, point.y * devicePixelRatio);
    }
  });
  ctx.closePath();
  var isInside = ctx.isPointInPath(x * devicePixelRatio, y * devicePixelRatio);
  ctx.restore();
  return isInside;
}
