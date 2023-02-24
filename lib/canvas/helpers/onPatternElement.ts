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
      if (element.type === "image") {
        console.log(
          (e.clientX - bounds?.left) * devicePixelRatio,
          (e.clientX - bounds?.top) * devicePixelRatio
        );

        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        for (
          let i = 0;
          i < (element.clipElement as SvgPatternType).points.length;
          i++
        ) {
          const inside = isPointInsidePath(
            x,
            y,
            element?.clipElement as SvgPatternType,
            ctx as CanvasRenderingContext2D
          );

          if (inside) {
            positionArray.push({ ...element });
            return;
          }
        }
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
              (point.x + element.posX - pan.xOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
              (point.y + element.posY - pan.yOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
              (nextPoint.x + element.posX - pan.xOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
              (nextPoint.y + element.posY - pan.yOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
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
  path.points.forEach(function (point: any, index: number) {
    if (index === 0) {
      ctx.moveTo(
        (point.x + path.posX) * devicePixelRatio,
        (point.y + path.posY) * devicePixelRatio
      );
    } else {
      ctx.lineTo(
        (point.x + path.posX) * devicePixelRatio,
        (point.y + path.posY) * devicePixelRatio
      );
    }
  });
  ctx.closePath();
  var isInside = ctx.isPointInPath(x * devicePixelRatio, y * devicePixelRatio);
  ctx.restore();
  return isInside;
}
