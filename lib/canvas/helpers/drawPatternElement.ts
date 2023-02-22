import { SvgPatternType } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const drawPatternElement = (
  element: any,
  ctx: CanvasRenderingContext2D | null,
  zoom: number,
  pan: {
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  },
  tool: string,
  synthElementMove: SvgPatternType | undefined,
  synthElementSelect: SvgPatternType | undefined
) => {
  ctx?.setLineDash(element?.type !== 0 ? [5, 5] : [0]);
  (ctx as CanvasRenderingContext2D).lineWidth = 3 * zoom;

  if (element.points === synthElementMove?.points && tool !== "pan") {
    (ctx as CanvasRenderingContext2D).strokeStyle = "#f1d2ef";
  } else if (element.points === synthElementSelect?.points) {
    (ctx as CanvasRenderingContext2D).strokeStyle = "#aeeccf";
  } else {
    (ctx as CanvasRenderingContext2D).strokeStyle = element.stroke;
  }

  (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;
  switch (element?.type) {
    case "0":
    case "1":
    case "2":
      ctx?.beginPath();
      ctx?.moveTo(
        (element.points[0].x + element.posX - pan.xOffset * 0.5 * zoom) *
          zoom *
          devicePixelRatio,
        (element.points[0].y + element.posY - pan.yOffset * 0.5 * zoom) *
          zoom *
          devicePixelRatio
      );
      for (let i = 1; i < element.points.length; i++) {
        ctx?.lineTo(
          (element.points[i].x + element.posX - pan.xOffset * 0.5 * zoom) *
            zoom *
            devicePixelRatio,
          (element.points[i].y + element.posY - pan.yOffset * 0.5 * zoom) *
            zoom *
            devicePixelRatio
        );
      }
      ctx?.stroke();
      ctx?.closePath();
      break;

    case "image":
      // if (element.points === synthElementSelect?.points) {
      //   const { destX, destY, destWidth, destHeight } = promptImageResize();
      //   ctx?.save();
      //   ctx?.clip();
      //   ctx?.drawImage(
      //     element.image,
      //     destX,
      //     destY,
      //     destWidth,
      //     destHeight
      //   );
      // }
      // ctx?.restore();
      break;
  }
};

export default drawPatternElement;
