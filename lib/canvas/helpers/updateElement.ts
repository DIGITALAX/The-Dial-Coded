import createElement from "./createElement";

const updateElement = (
  pan: {
    xOffset: number;
    yOffset: number;
  },
  canvas: HTMLCanvasElement,
  zoom: number,
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
        x1!,
        y1!,
        x2!,
        y2!,
        type,
        index,
        strokeWidth!,
        fill!,
        fillStyle!,
        stroke!,
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
        x1!,
        y1!,
        x2!,
        y2!,
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
          x: ((x2! - bounds?.left - pan.xOffset) / zoom) * devicePixelRatio,
          y: ((y2! - bounds?.top - pan.yOffset) / zoom) * devicePixelRatio,
        },
      ];
      break;

    case "text":
      (ctx as CanvasRenderingContext2D).font = `${
        strokeWidth! * devicePixelRatio
      }px dosis`;
      const textWidth = ctx?.measureText(text!).width!;
      elementsCopy[index] = {
        ...createElement(
          {
            xOffset: pan.xOffset,
            yOffset: pan.yOffset,
          },
          canvas,
          zoom,
          x1,
          y1,
          x1! + textWidth * zoom,
          y1! + strokeWidth! * zoom,
          type,
          index,
          strokeWidth!,
          fill!,
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
        x1!,
        y1!,
        x2!,
        y2!,
        type,
        index
      ) as any;
      break;
  }
  setElements(elementsCopy, true);
};

export default updateElement;
