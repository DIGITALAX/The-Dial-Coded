import { TemplateTypes } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const normalizePoints = (
  element: {
    points: { x: number; y: number }[];
    types: TemplateTypes;
    posX: number;
    posY: number;
  },
  zoom: number
) => {
  for (let i = 0; i < element.points.length; i++) {
    element.points[i].x = (element.points[i].x + element.posX) * (1/zoom);
    element.points[i].y = (element.points[i].y + element.posY) * (1/zoom);
  }

  return element;
};

export default normalizePoints;
