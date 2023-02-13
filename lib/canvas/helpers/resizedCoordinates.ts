const resizedCoordinates = (
  mouseX: number,
  mouseY: number,
  position: any,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { x1: number; y1: number; x2: number; y2: number } | null => {
  switch (position) {
    case "tl":
    case "start":
      return { x1: mouseX, y1: mouseY, x2, y2 };
    case "tr":
      return { x1, y1: mouseY, x2: mouseX, y2 };
    case "bl":
      return { x1: mouseX, y1, x2, y2: mouseY };
    case "br":
    case "end":
      return { x1, y1, x2: mouseX, y2: mouseY };
    default:
      return null;
  }
};

export default resizedCoordinates;
