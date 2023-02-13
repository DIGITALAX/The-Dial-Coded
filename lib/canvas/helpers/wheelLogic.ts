import { WheelEvent } from "react";

const wheelLogic = (
  e: WheelEvent,
  canvas: HTMLCanvasElement,
  zoom: number,
  setZoom: (e: number) => void,
  ctx: CanvasRenderingContext2D,
  maxZoom: number
) => {
  const { clientX, clientY } = e;
  const canvasBounds = canvas?.getBoundingClientRect();
  const x = clientX - canvasBounds?.left;
  const y = clientY - canvasBounds?.top;
  const zoomDelta = e.deltaY * -0.01;
  const newZoom = Math.min(Math.max(zoom + zoomDelta, 0.1), maxZoom);
  const zoomFactor = newZoom / zoom;
  const cx = x / canvas?.width;
  const cy = y / canvas?.height;

  ctx?.setTransform(
    newZoom,
    0,
    0,
    newZoom,
    (1 - zoomFactor) * cx * canvas?.width,
    (1 - zoomFactor) * cy * canvas?.height
  );

  setZoom(newZoom);
};

export default wheelLogic;
