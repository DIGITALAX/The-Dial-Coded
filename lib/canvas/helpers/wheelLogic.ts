import { WheelEvent } from "react";

const wheelLogic = (
  e: WheelEvent,
  zoom: number,
  setZoom: (e: number) => void,
  maxZoom: number
) => {
  const zoomDelta = e.deltaY * -0.01;
  const newZoom = Math.min(Math.max(zoom + zoomDelta, 0.1), maxZoom);

  setZoom(newZoom);
};

export default wheelLogic;
