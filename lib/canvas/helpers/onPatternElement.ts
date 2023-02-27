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
  const newelements = [...elements];
  newelements.sort((a, b) => (a.id > b.id ? -1 : 1));
  if (!template) {
    lodash.filter(newelements, (element: SvgPatternType) => {
      switch (element.type) {
        case "image":
          for (
            let i = 0;
            i < ((element.clipElement as SvgPatternType).points as {}[]).length;
            i++
          ) {
            const inside = isPointInsidePath(
              (e.clientX - bounds?.left) * devicePixelRatio,
              (e.clientY - bounds?.top) * devicePixelRatio,
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
          if (
            ((e.clientX - bounds.left) * devicePixelRatio) / zoom >=
              (element.x1 as number) &&
            ((e.clientX - bounds.left) * devicePixelRatio) / zoom <=
              (element.x2 as number) &&
            ((e.clientY - bounds.top) * devicePixelRatio) / zoom >=
              (element.y1 as number) &&
            ((e.clientY - bounds.top) * devicePixelRatio) / zoom <=
              (element.y2 as number)
          ) {
            positionArray.push({ ...element });
            return;
          }

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
                ((e.clientX - bounds?.left - pan.xOffset * 0.5 * zoom * zoom) *
                  devicePixelRatio) /
                  zoom,
                ((e.clientY - bounds?.top - pan.yOffset * 0.5 * zoom * zoom) *
                  devicePixelRatio) /
                  zoom,
                element.strokeWidth as number
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
      switch (element.type) {
        case "0":
        case "1":
        case "2":
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
          break;
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
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  var isInside = ctx.isPointInPath(x, y);
  ctx.restore();

  return isInside;
}
