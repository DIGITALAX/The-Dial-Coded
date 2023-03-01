import { INFURA_GATEWAY } from "../../lens/constants";

const convertSvgToPath = async (image: string, scale: number) => {
  const base: Response = await fetch(`${INFURA_GATEWAY}/ipfs/${image}`);
  const text = await base.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(text, "image/svg+xml");
  let pathData: string[] = [];
  const paths = svgDoc.querySelectorAll("path, polygon, rect");

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const tagName = path.tagName.toLowerCase();

    if (tagName === "rect") {
      const x = parseFloat(path.getAttribute("x") || "0");
      const y = parseFloat(path.getAttribute("y") || "0");
      const width = parseFloat(path.getAttribute("width") || "0");
      const height = parseFloat(path.getAttribute("height") || "0");
      pathData.push(
        `M ${x},${y} L ${x + width},${y} L ${x + width},${y + height} L ${x},${
          y + height
        } L ${x},${y} Z`
      );
    } else if (tagName === "polygon") {
      const points = path.getAttribute("points")?.split(/\s+/);

      let lastPoint = points![points!.length - 1];
      pathData.push(`M ${lastPoint}`);

      for (const point of points!) {
        if (point === lastPoint) {
          continue;
        }

        const [x, y] = point.split(",");
        const [lastX, lastY] = lastPoint.split(",");
        pathData.push(
          `Q ${lastX},${lastY} ${(Number(x) + Number(lastX)) / 2},${
            (Number(y) + Number(lastY)) / 2
          }`
        );
        lastPoint = point;
      }

      pathData.push(`Q ${lastPoint} Z`);
    } else {
      const pathString = path.getAttribute("d");
      const pathStringWithMoveTo = pathString!.replace(/([mM])/g, "M $1");
      pathData.push(pathStringWithMoveTo);
    }
  }

  const commands = pathData.flatMap(
    (path) => path.match(/[a-df-z][^a-df-z]*/gi) as RegExpMatchArray
  );
  const extractedPoints = [];
  let x = 0;
  let y = 0;
  let lastSubpath = false;

  for (let i = 0; i < commands.length; i++) {
    let command = commands[i];
    let type = command[0];
    let args = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);

    if (type === "M") {
      if (i !== 0 && lastSubpath) {
        extractedPoints.push({
          x: Number(x) / scale,
          y: Number(y) / scale,
        });
      }
      x = args[0];
      y = args[1];
      extractedPoints.push({
        x: Number(x) / scale,
        y: Number(y) / scale,
      });
      lastSubpath = false;
    } else if (type === "Z") {
      lastSubpath = true;
    } else {
      lastSubpath = false;
      switch (type) {
        case "L":
          x = args[0];
          y = args[1];
          extractedPoints.push({ x: Number(x) / scale, y: Number(y) / scale });
          break;

        case "C":
          for (let j = 0; j < args.length; j += 6) {
            let x1 = args[j];
            let y1 = args[j + 1];
            let x2 = args[j + 2];
            let y2 = args[j + 3];
            let x3 = args[j + 4];
            let y3 = args[j + 5];

            for (let t = 0; t <= 1; t += 0.1) {
              let xCoord =
                Math.pow(1 - t, 3) * x +
                3 * Math.pow(1 - t, 2) * t * x1 +
                3 * (1 - t) * t * t * x2 +
                Math.pow(t, 3) * x3;
              let yCoord =
                Math.pow(1 - t, 3) * y +
                3 * Math.pow(1 - t, 2) * t * y1 +
                3 * (1 - t) * t * t * y2 +
                Math.pow(t, 3) * y3;
              extractedPoints.push({
                x: Number(xCoord) / scale,
                y: Number(yCoord) / scale,
              });
            }

            x = x3;
            y = y3;
          }
          break;
        default:
          if (!isNaN(parseFloat(command[0]))) {
            extractedPoints.push({
              x: Number(command.split(",")[0]) / scale,
              y: Number(command.split(",")[1]) / scale,
            });
          }
          break;
      }
    }
  }

  if (lastSubpath) {
    extractedPoints.push({
      x: Number(x) / scale,
      y: Number(y) / scale,
    });
  }

  return extractedPoints;
};

export default convertSvgToPath;
