import { Point2 } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const distance = (a: Point2, b: Point2) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export default distance;
