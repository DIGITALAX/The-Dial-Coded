import lodash from "lodash";

const getCanvas = (canvas: HTMLCanvasElement, elements: any): string => {
  let img: string;
  const marquee = lodash.find(elements, { type: "marquee" });
  if (marquee) {
    const hiddenCanvas = document.createElement("canvas");
    hiddenCanvas.style.display = "none";
    document.body.appendChild(hiddenCanvas);
    const hiddenCanvasCtx = hiddenCanvas.getContext("2d");
    hiddenCanvas.width = marquee.x2;
    hiddenCanvas.height = marquee.y2;
    hiddenCanvasCtx?.drawImage(
      canvas,
      marquee.x1 + 1,
      marquee.y1 + 1,
      marquee.x2 - 2,
      marquee.y2 - 2,
      0,
      0,
      hiddenCanvas.width,
      hiddenCanvas.height
    );
    img = hiddenCanvas.toDataURL("image/png");
  } else {
    img = canvas.toDataURL("image/png");
  }

  return img;
};

export default getCanvas;
