import createElement from "./createElement";

const updateElement = (
  pan: {
    xOffset: number;
    yOffset: number;
  },
  canvas: HTMLCanvasElement,
  zoom: number,
  generator: any,
  elements: any,
  setElements: (e: any, b: boolean) => void,
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number | null,
  y2: number | null,
  type: string | null,
  index: number,
  strokeWidth: number | null,
  fill: string | null,
  fillStyle: string | null,
  stroke: string | null,
  text?: string,
  image?: any
) => {
  const elementsCopy = [...elements];
  const bounds = canvas?.getBoundingClientRect();
  console.log({
    x:
      ((x1 - bounds?.left + pan.xOffset * zoom * zoom) / zoom) *
      devicePixelRatio,
    y:
      ((y1 - bounds?.top + pan.yOffset * zoom * zoom) / zoom) *
      devicePixelRatio,
    ex: x1,
    ey: y1,
  });
  switch (type) {
    case "line":
    case "ell":
    case "rect":
      elementsCopy[index] = createElement(
        {
          xOffset: pan.xOffset,
          yOffset: pan.yOffset,
        },
        canvas,
        zoom,
        generator,
        x1 as number,
        y1 as number,
        x2 as number,
        y2 as number,
        type,
        index,
        strokeWidth as number,
        fill as string,
        fillStyle as string,
        stroke as string,
        undefined
      ) as any;
      break;

    case "image":
      elementsCopy[index] = createElement(
        {
          xOffset: pan.xOffset,
          yOffset: pan.yOffset,
        },
        canvas,
        zoom,
        generator,
        x1 as number,
        y1 as number,
        x2 as number,
        y2 as number,
        type,
        index,
        undefined,
        undefined,
        undefined,
        undefined,
        image
      ) as any;
      break;

    case "pencil":
      elementsCopy[index].points = [
        ...(elementsCopy[index]?.points as any),
        {
          x:
            (((x2 as number) -
              canvas?.offsetLeft -
              bounds?.left -
              pan.xOffset * zoom * zoom) /
              zoom) *
            devicePixelRatio,
          y:
            (((y2 as number) -
              canvas?.offsetTop -
              bounds?.top -
              pan.yOffset * zoom * zoom) /
              zoom) *
            devicePixelRatio,
        },
      ];
      break;

    case "text":
      const textWidth = ctx?.measureText(text as string).width as number;
      elementsCopy[index] = {
        ...createElement(
          {
            xOffset: pan.xOffset,
            yOffset: pan.yOffset,
          },
          canvas,
          zoom,
          generator,
          (x1 / zoom) * devicePixelRatio -
            bounds.left* zoom / (devicePixelRatio ),
          (y1 / zoom) * devicePixelRatio -
            bounds.top* zoom / (devicePixelRatio),
          (x2 as number) + textWidth,
          (y2 as number) + (strokeWidth as number),
          type,
          index,
          strokeWidth as number,
          fill as string,
          undefined,
          undefined,
          undefined
        ),
        text,
      };
      break;

    case "marquee":
      elementsCopy[index] = createElement(
        {
          xOffset: pan.xOffset,
          yOffset: pan.yOffset,
        },
        canvas,
        zoom,
        generator,
        x1 as number,
        y1 as number,
        x2 as number,
        y2 as number,
        type,
        index
      ) as any;
      break;
  }
  setElements(elementsCopy, true);
};

export default updateElement;
