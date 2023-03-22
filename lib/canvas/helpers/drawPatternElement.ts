import { SvgPatternType } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const drawPatternElement = (
  element: SvgPatternType,
  ctx: CanvasRenderingContext2D | null,
  zoom: number,
  tool: string,
  synthElementMove: SvgPatternType | null,
  synthElementSelect: SvgPatternType[] | null,
  promptLoading: boolean,
  filter?: boolean
) => {
  if (!filter) {
    ctx?.setLineDash(element?.type !== "0" ? [5, 5] : [0]);
    (ctx as CanvasRenderingContext2D).lineWidth = 3 * zoom;
    if (!promptLoading) {
      if (element.points === synthElementMove?.points && tool === "synth") {
        (ctx as CanvasRenderingContext2D).strokeStyle = "#f1d2ef";
      } else if (synthElementSelect?.some(selectedElement => selectedElement.points === element.points)) {
        (ctx as CanvasRenderingContext2D).strokeStyle = "#aeeccf";
      } else {
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
      }
    } else {
      if (synthElementSelect?.some(selectedElement => selectedElement.points === element.points)) {
        (ctx as CanvasRenderingContext2D).strokeStyle = "#aeeccf";
      } else {
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
      }
    }
  } else {
    (ctx as CanvasRenderingContext2D).lineWidth = 3 * zoom;
    if (element.type === "2" || element.type === "1") {
      (ctx as CanvasRenderingContext2D).strokeStyle = "rgba(0, 0, 0, 0)";
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
      if (typeof element.image === "string") {
        const img = new Image();
        img.src = element.image;
        img.onload = () => {
          ctx?.drawImage(
            img,
            ((element.clipElement as SvgPatternType)?.posX as number) * devicePixelRatio,
            ((element.clipElement as SvgPatternType)?.posY as number) * devicePixelRatio,
            (element?.width as number) * devicePixelRatio,
            (element?.height as number) * devicePixelRatio
          );
        };
      } else if (element.image instanceof HTMLImageElement) {
        ctx?.drawImage(
          element.image,
          ((element.clipElement as SvgPatternType)?.posX as number) * devicePixelRatio,
          ((element.clipElement as SvgPatternType)?.posY as number) * devicePixelRatio,
          (element?.width as number) * devicePixelRatio,
          (element?.height as number) * devicePixelRatio
        );
      }
      ctx?.restore();
      break;
  }
};

export default drawPatternElement;
