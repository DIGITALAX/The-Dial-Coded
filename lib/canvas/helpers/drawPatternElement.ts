import { SvgPatternType } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const drawPatternElement = (
  element: SvgPatternType,
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
  synthElementSelect: SvgPatternType | undefined,
  promptLoading: boolean
) => {
  ctx?.setLineDash(element?.type !== "0" ? [5, 5] : [0]);
  (ctx as CanvasRenderingContext2D).lineWidth = 3 * zoom;

  if (!promptLoading) {
    if (element.points === synthElementMove?.points && tool === "synth") {
      (ctx as CanvasRenderingContext2D).strokeStyle = "#f1d2ef";
    } else if (element.points === synthElementSelect?.points) {
      (ctx as CanvasRenderingContext2D).strokeStyle = "#aeeccf";
    } else {
      (ctx as CanvasRenderingContext2D).strokeStyle = element.stroke as string;
    }
  } else {
    if (element.points === synthElementSelect?.points) {
      (ctx as CanvasRenderingContext2D).strokeStyle = "#aeeccf";
    } else {
      (ctx as CanvasRenderingContext2D).strokeStyle = element.stroke as string;
    }
  }

  (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;
  switch (element?.type) {
    case "0":
    case "1":
    case "2":
      ctx?.beginPath();
      ctx?.moveTo(
        (element.points?.[0] as { x: number; y: number }).x,
        (element.points?.[0] as { x: number; y: number }).y
      );
      for (
        let i = 1;
        i < (element?.points as { x: number; y: number }[]).length;
        i++
      ) {
        ctx?.lineTo(
          (element?.points as { x: number; y: number }[])?.[i].x,
          (element?.points as { x: number; y: number }[])?.[i].y
        );
      }
      ctx?.stroke();
      ctx?.closePath();
      break;

    case "image":
      ctx?.save();
      ctx?.clip();
      ctx?.drawImage(
        element.image as HTMLImageElement,
        ((element.clipElement as SvgPatternType).posX as number) *
          devicePixelRatio,
        ((element.clipElement as SvgPatternType).posY as number) *
          devicePixelRatio,
        (element.image as HTMLImageElement).width * devicePixelRatio,
        (element.image as HTMLImageElement).height * devicePixelRatio
      );
      ctx?.restore();
      break;
  }
};

export default drawPatternElement;
