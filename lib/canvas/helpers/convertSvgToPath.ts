import { INFURA_GATEWAY } from "../../lens/constants";

const convertSvgToPath = async (
  image: string,
  scale: number,
) => {
  const base: Response = await fetch(`${INFURA_GATEWAY}/ipfs/${image}`);
  const text = await base.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(text, "image/svg+xml");

  let pathData: string[] = [];
  const paths = svgDoc.querySelectorAll("path, polygon, rect");

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const transform = path.getAttribute("transform");
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

      let pathString = "";
      for (let j = 0; j < points!.length; j++) {
        const [x, y] = points![j].split(",");
        if (j === 0) {
          pathString += `M ${x},${y} `;
        } else {
          pathString += `L ${x},${y} `;
        }
      }
      pathString += "Z";
      pathData.push(pathString);
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
  let lastSubpathStartX = 0;
  let lastSubpathStartY = 0;
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
      if (i !== 0 && lastSubpathStartX !== x && lastSubpathStartY !== y) {
        extractedPoints.push({
          x: Number(x) / scale,
          y: Number(y) / scale,
        });
      }
      x = args[0];
      y = args[1];
      lastSubpathStartX = x;
      lastSubpathStartY = y;
      extractedPoints.push({
        x: Number(x) / scale,
        y: Number(y) / scale,
      });
      lastSubpath = false;
    } else if (type === "Z") {
      x = lastSubpathStartX;
      y = lastSubpathStartY;
      extractedPoints.push({
        x: Number(x) / scale,
        y: Number(y) / scale,
      });
      lastSubpath = true;
    } else {
      switch (type) {
        case "M":
          if (lastSubpath) {
            extractedPoints.push({
              x: Number(lastSubpathStartX) / scale,
              y: Number(lastSubpathStartY) / scale,
            });
          }
          x = args[0];
          y = args[1];
          extractedPoints.push({
            x: Number(x) / scale,
            y: Number(y) / scale,
          });
          lastSubpathStartX = x;
          lastSubpathStartY = y;
          lastSubpath = false;
          break;
        case "L":
          x = args[0];
          y = args[1];
          extractedPoints.push({
            x: Number(x) / scale,
            y: Number(y) / scale,
          });
          lastSubpath = false;
          break;
        case "H":
          x = args[0];
          extractedPoints.push({
            x: Number(x) / scale,
            y: Number(y) / scale,
          });
          lastSubpath = false;
          break;
        case "V":
          y = args[0];
          extractedPoints.push({
            x: Number(x) / scale,
            y: Number(y) / scale,
          });
          lastSubpath = false;
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
        case "Q":
          x = args[2];
          y = args[3];
          extractedPoints.push({
            x: Number(x) / scale,
            y: Number(y) / scale,
          });
          lastSubpath = false;
          break;
        case "T":
          x = args[0];
          y = args[1];
          extractedPoints.push({
            x: Number(x) / scale,
            y: Number(y) / scale,
          });
          lastSubpath = false;
          break;
        case "A":
          x = args[5];
          y = args[6];
          extractedPoints.push({
            x: Number(x) / scale,
            y: Number(y) / scale,
          });
          lastSubpath = false;
          break;
        case "Z":
          extractedPoints.push({
            x: Number(lastSubpathStartX) / scale,
            y: Number(lastSubpathStartY) / scale,
          });
          lastSubpath = true;
          break;
      }
    }
  }
  return extractedPoints;
};

export default convertSvgToPath;
