import { WheelEvent } from "react";

const wheelLogic = (
  e: WheelEvent,
  zoom: number,
  setZoom: (e: number) => void,
  canvasState: HTMLCanvasElement,
  pan: {
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  },
  setPan: (e: {
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  }) => void,
  maxZoom: number
) => {
  const zoomFactor = 1 + e.deltaY / 100;
  const mouseX = e.clientX - canvasState.offsetLeft;
  const mouseY = e.clientY - canvasState.offsetTop;
  const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), maxZoom);
  const x = mouseX / zoom - pan.xOffset / zoom;
  const y = mouseY / zoom - pan.yOffset / zoom;
  setZoom(newZoom);
  setPan({
    xInitial: pan.xInitial,
    yInitial: pan.yInitial,
    xOffset: mouseX - x * newZoom,
    yOffset: mouseY - y * newZoom,
  });
};

export default wheelLogic;
