import { INFURA_GATEWAY } from "../../lens/constants";

const convertSvgToPath = async (image: string, scale: number) => {
  const base: Response = await fetch(`${INFURA_GATEWAY}/ipfs/${image}`);
  const text = await base.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(text, "image/svg+xml");
  const path = svgDoc.getElementsByTagName("path")[0].getAttribute("d");
  const commands = path?.match(/[a-df-z][^a-df-z]*/gi) as RegExpMatchArray;
  const extractedPoints = [];
  let x = 0;
  let y = 0;

  for (let i = 0; i < commands.length; i++) {
    let command = commands[i];
    let type = command[0];
    let args = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);

    switch (type) {
      case "L":
      case "M":
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

  return extractedPoints;
};

export default convertSvgToPath;
