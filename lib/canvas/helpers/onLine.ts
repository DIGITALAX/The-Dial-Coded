import { Point2 } from "../../../components/Home/Layout/Canvas/types/canvas.types";
import distance from "./distance";

const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number,
  maxDistance: number,
) => {
  const a: Point2 = { x: x1, y: y1 };
  const b: Point2 = { x: x2, y: y2 };
  const c: Point2 = { x, y};
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

export default onLine;
