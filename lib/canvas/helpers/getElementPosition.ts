import lodash from "lodash";
import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";
import positionWithinElement from "./positionWithinElement";

const getElementPosition = (
  x: number,
  y: number,
  elements: any,
  canvas: HTMLCanvasElement,
  zoom: number,
  pan: {
    xOffset: number,
    yOffset: number
  }
) => {
  let positionArray: ElementInterface[] = [];
  lodash.filter(elements, (element) => {
    const returned = positionWithinElement(x, y, element, canvas, zoom, pan);
    if (returned) {
      positionArray.push({ ...element, position: returned });
    }
  });
  return positionArray;
};

export default getElementPosition;
