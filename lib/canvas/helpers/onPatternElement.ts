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
): SvgPatternType[] => {
  let positionArray: SvgPatternType[] = [];
  const bounds = canvas?.getBoundingClientRect();
  if (!template) {
    lodash.filter(elements, (element: SvgPatternType) => {
      if (element.type === "image") {
        const insideImage =
          ((e.clientX - bounds?.left) * devicePixelRatio) / zoom >=
            (element.clipElement.posX - pan.xOffset * 0.5 * zoom) * zoom &&
          ((e.clientX - bounds?.left) * devicePixelRatio) / zoom <=
            (element.image.width as number) * zoom * zoom &&
          ((e.clientY - bounds?.top) * devicePixelRatio) / zoom >=
            (element.clipElement.posY - pan.yOffset * 0.5 * zoom) * zoom &&
          ((e.clientY - bounds?.top) * devicePixelRatio) / zoom <=
            (element.image.height as number) * zoom
            ? "inside"
            : null;
        console.log(insideImage);
        if (insideImage) {
          positionArray.push({ ...element });
          return;
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
