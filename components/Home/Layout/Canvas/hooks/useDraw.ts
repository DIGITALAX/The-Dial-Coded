import {
  useRef,
  useState,
  MutableRefObject,
  useLayoutEffect,
  MouseEvent,
} from "react";
import rough from "roughjs/bundled/rough.cjs";
import { ElementInterface, Point2 } from "../types/canvas.types";

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
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [tool, setTool] = useState<string>("draw");
  const [action, setAction] = useState<string>("none");
  const [onDrawTracker, setOnDrawTracker] = useState<boolean>(true);
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<boolean>(false);
  const [elements, setElements] = useState<ElementInterface[]>([]);
  const generator = rough.generator();
  const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>)?.current;
  useLayoutEffect(() => {
    const ctx = canvas?.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    if (canvas) {
      const roughCanvas = rough.canvas(canvas);
      elements.forEach(({ roughElement }) => {
        roughCanvas?.draw(roughElement);
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

  const createElement = (x1: number, y1: number, x2: number, y2: number) => {
    let roughElement;
    const bounds = canvas?.getBoundingClientRect();
    if (onDrawTracker) {
      roughElement = generator.line(
        x1 - bounds?.left,
        y1 - bounds?.top,
        x2 - bounds?.left,
        y2 - bounds?.top
      );
    } else {
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
    }

    return { x1, y1, x2, y2, roughElement };
  };

  const getElementPosition = (x: number, y: number) => {
    return;
  };

  const handleMouseDown = (e: MouseEvent): void => {
    if (tool === "selection") {
    } else {
      setAction("drawing");
      const newElement = createElement(
        e.clientX,
        e.clientY,
        e.clientX,
        e.clientY
      );
      setElements([...elements, newElement]);
    }
  };
  const handleMouseMove = (e: MouseEvent): void => {
    if (!action) return;
    if (action === "drawing") {
      const bounds = canvas.getBoundingClientRect();
      const index = elements?.length - 1;
      const { x1, y1 } = elements[index];
      const updatedElement = createElement(x1, y1, e.clientX, e.clientY);
      const elementsCopy = [...elements];
      elementsCopy[index] = updatedElement;
      setElements(elementsCopy);
    }
  };
  const handleMouseUp = (e: MouseEvent): void => {
    setAction("none");
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
  };
};

export default useDraw;
