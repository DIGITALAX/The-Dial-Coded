import { Point2 } from "../../../components/Home/Layout/Canvas/types/canvas.types";
import distance from "./distance";

const onOnePoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  maxDistance: number,
  zoom: number
) => {
  const a: Point2 = { x: x1, y: y1 };
  const c: Point2 = { x: x / zoom, y: y / zoom };
  return Math.abs(distance(a, c)) < maxDistance ? "inside" : null;
};

export default onOnePoint;
