import {
  useRef,
  useState,
  MutableRefObject,
  useLayoutEffect,
  MouseEvent,
  FormEvent,
} from "react";
import rough from "roughjs/bundled/rough.cjs";
import { ElementInterface, Point2 } from "../types/canvas.types";
import getStroke from "perfect-freehand";

const useDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSideDrawOptions, setShowSideDrawOptions] =
    useState<boolean>(false);
  const [showBottomDrawOptions, setShowBottomDrawOptions] =
    useState<boolean>(false);
  const [shapes, setShapes] = useState<boolean>(false);
  const [pencil, setPencil] = useState<boolean>(true);
  const [shapeFillType, setShapeFillType] = useState<string[]>([
    "solid",
    "rect",
  ]);
  const [pan, setPan] = useState<boolean>(false);
  const [zoom, setZoom] = useState<boolean>(false);
  const [erase, setErase] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [tool, setTool] = useState<string>("pencil");
  const [action, setAction] = useState<string>("none");
  const [draftBoard, setDraftBoard] = useState<boolean>(false);
  const [onDrawTracker, setOnDrawTracker] = useState<boolean>(true);
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<boolean>(false);
  const [elements, setElements] = useState<ElementInterface[]>([]);
  const generator = rough.generator();
  const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>)?.current;
  const ctx = canvas?.getContext("2d");
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;
  let dragStart = { x: 0, y: 0 };
  let cameraOffset = {
    x: (document.getElementById("parent")?.offsetWidth as number) / 2,
    y: (document.getElementById("parent")?.offsetHeight as number) / 2,
  };
  let cameraZoom = 1;

  const getSvgPathFromStroke = (stroke: any) => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc: any, [x0, y0]: any, i: number, arr: any[]) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  };

  const drawElement = (
    element: ElementInterface,
    roughCanvas: any,
    ctx: CanvasRenderingContext2D | null
  ) => {
    switch (element?.type) {
      case "shape":
        roughCanvas?.draw(element?.roughElement);
        break;

      case "pencil":
        (ctx as CanvasRenderingContext2D).fillStyle = element?.color as string;
        const pathData = getSvgPathFromStroke(
          getStroke(element?.points as { x: number; y: number }[], {
            size: element?.thickness,
          })
        );
        ctx?.fill(new Path2D(pathData));
        break;

      case "text":
        // coming soon
        break;

      default:
        throw new Error("type not supported");
    }
  };

  const handleSave = (): void => {
    const img = canvas.toDataURL("image/png");
    let xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function () {
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = "image_name.png";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open("GET", img); // This is to download the canvas Image
    xhr.send();
  };

  const handleImageAdd = (e: FormEvent) => {};

  useLayoutEffect(() => {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    if (ctx) {
      const roughCanvas = rough?.canvas(canvas);
      elements.forEach((element) => {
        drawElement(element, roughCanvas, ctx);
      });
    }
  }, [elements]);

  const nearPoint = (
    x: number,
    y: number,
    x1: number,
    y1: number,
    name: string
  ) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
  };

  const distance = (a: Point2, b: Point2) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  const onLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number,
    maxDistance = 1
  ) => {
    const a: Point2 = { x: x1, y: y1 };
    const b: Point2 = { x: x2, y: y2 };
    const c: Point2 = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
  };

  const positionWithinElement = (
    x: number,
    y: number,
    element: ElementInterface
  ) => {
    const { type, x1, x2, y1, y2 } = element;
    switch (type) {
      case "line":
        const on = onLine(x1, y1, x2, y2, x, y);
        const start = nearPoint(x, y, x1, y1, "start");
        const end = nearPoint(x, y, x2, y2, "end");
        return start || end || on;
      case "rectangle":
        const topLeft = nearPoint(x, y, x1, y1, "tl");
        const topRight = nearPoint(x, y, x2, y1, "tr");
        const bottomLeft = nearPoint(x, y, x1, y2, "bl");
        const bottomRight = nearPoint(x, y, x2, y2, "br");
        const inside =
          x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      case "pencil":
        const betweenAnyPoint = element.points.some((point, index) => {
          const nextPoint = element.points[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      case "text":
        return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const createElement = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: string
  ): ElementInterface | undefined => {
    let roughElement;
    const bounds = canvas?.getBoundingClientRect();
    switch (type) {
      case "shape":
        if (shapeFillType[1] === "rect") {
          roughElement = generator.rectangle(
            x1 - bounds?.left,
            y1 - bounds?.top,
            x2 - x1,
            y2 - y1,
            {
              fill: hex,
              stroke: hex,
              strokeWidth: brushWidth,
              fillStyle: shapeFillType[0],
            }
          );
        } else if (shapeFillType[1] === "ell") {
          roughElement = generator.ellipse(
            x1 - bounds?.left,
            y1 - bounds?.top,
            x2 - x1,
            y2 - y1,
            {
              fill: hex,
              stroke: hex,
              strokeWidth: brushWidth,
              fillStyle: shapeFillType[0],
            }
          );
        } else {
          roughElement = generator.line(
            x1 - bounds?.left,
            y1 - bounds?.top,
            x2 - bounds?.left,
            y2 - bounds?.top,
            {
              strokeWidth: brushWidth,
              stroke: hex,
            }
          );
        }
        return { type, x1, y1, x2, y2, roughElement };

      case "pencil":
        return {
          type,
          points: [{ x: x1 - bounds?.left, y: y1 - bounds?.top }],
          color: hex,
          thickness: brushWidth,
        };
    }
  };

  const getElementPosition = (x: number, y: number) => {
    return;
  };

  const updateElement = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: string,
    index: number
  ) => {
    const elementsCopy = [...elements];
    const bounds = canvas?.getBoundingClientRect();
    switch (type) {
      case "shape":
        elementsCopy[index] = createElement(
          x1 as number,
          y1 as number,
          x2,
          y2,
          type
        ) as ElementInterface;
        break;

      case "pencil":
        elementsCopy[index].points = [
          ...(elementsCopy[index].points as any),
          { x: x2 - bounds?.left, y: y2 - bounds?.top },
        ];
        break;
    }
    setElements(elementsCopy);
  };

  const handleMouseDown = (e: MouseEvent): void => {
    if (tool === "selection") {
    } else {
      if (pan) {
        setAction("panning");
        dragStart.x = e.clientX / cameraZoom - cameraOffset.x;
        dragStart.y = e.clientY / cameraZoom - cameraOffset.y;
      } else {
        setAction("drawing");
        const newElement = createElement(
          e.clientX,
          e.clientY,
          e.clientX,
          e.clientY,
          onDrawTracker ? "pencil" : "shape"
        );

        setElements([...elements, newElement as ElementInterface]);
      }
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (!action) return;
    if (action === "drawing") {
      const index = elements?.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(
        x1 as number,
        y1 as number,
        e.clientX,
        e.clientY,
        onDrawTracker ? "pencil" : "shape",
        index
      );
    } else if (action === "panning") {
      panAndZoom();
    }
  };

  const handleMouseUp = (e: MouseEvent): void => {
    setAction("none");
  };

  const panAndZoom = () => {
    canvas.width = document.getElementById("parent")?.offsetWidth as number;
    canvas.height = document.getElementById("parent")?.offsetHeight as number;
    ctx?.translate(
      (document.getElementById("parent")?.offsetWidth as number) / 2,
      (document.getElementById("parent")?.offsetHeight as number) / 2
    );
    ctx?.scale(cameraZoom, cameraZoom);
    ctx?.translate(
      -(document.getElementById("parent")?.offsetWidth as number) / 2 +
        cameraOffset.x,
      -window.innerHeight / 2 + cameraOffset.y
    );
  };

  return {
    hex,
    setHex,
    showSideDrawOptions,
    setShowSideDrawOptions,
    canvasRef,
    brushWidth,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    showBottomDrawOptions,
    setShowBottomDrawOptions,
    colorPicker,
    setColorPicker,
    shapes,
    setShapes,
    pencil,
    setPencil,
    shapeFillType,
    setShapeFillType,
    setOnDrawTracker,
    setThickness,
    thickness,
    setBrushWidth,
    erase,
    setErase,
    pan,
    setPan,
    handleSave,
    setDraftBoard,
    draftBoard
  };
};

export default useDraw;
