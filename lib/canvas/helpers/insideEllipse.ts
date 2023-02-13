const insideEllipse = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const p =
    Math.pow(x - x1, 2) / Math.pow((x2 - x1) * Math.PI, 2) +
    Math.pow(y - y1, 2) / Math.pow((y2 - y1) * Math.PI, 2);
  return p;
};

export default insideEllipse;
