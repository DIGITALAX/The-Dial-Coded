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
import lodash from "lodash";

const useDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSideDrawOptions, setShowSideDrawOptions] =
    useState<boolean>(false);
  const [showBottomDrawOptions, setShowBottomDrawOptions] =
    useState<boolean>(false);
  const [shapeFillType, setShapeFillType] = useState<string>("solid");
  const [text, setText] = useState<boolean>(false);
  const [zoom, setZoom] = useState<boolean>(false);
  const [shapes, setShapes] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [tool, setTool] = useState<string>("pencil");
  const [action, setAction] = useState<string>("none");
  const [draftBoard, setDraftBoard] = useState<boolean>(false);
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<boolean>(false);
  const [elements, setElements] = useState<ElementInterface[]>([]);
  const generator = rough.generator();
  const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>)?.current;
  const ctx = canvas?.getContext("2d");

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
      case "line":
      case "ell":
      case "rect":
        roughCanvas?.draw(element?.roughElement);
        break;

      case "pencil":
        (ctx as CanvasRenderingContext2D).fillStyle = element?.fill as string;
        const pathData = getSvgPathFromStroke(
          getStroke(element?.points as { x: number; y: number }[], {
            size: element?.thickness,
          })
        );
        ctx?.fill(new Path2D(pathData));
        break;

      case "text":
        (ctx as CanvasRenderingContext2D).font = "24px san-serif";
        (ctx as CanvasRenderingContext2D).fillText(
          element.text as string,
          element.x1 as number,
          element.y1 as number
        );
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
      a.download = "thedial.png";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open("GET", img);
    xhr.send();
  };

  const handleImageAdd = (e: FormEvent) => {
    const image = (e.target as HTMLFormElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = (e) => {
      const imageObject = new Image(); // Creates image object
      imageObject.src = e.target?.result as string;
      imageObject.onload = function (ev) {
        ctx?.drawImage(imageObject, 0, 0); // Draws the image on canvas
        const imgData = canvas.toDataURL("image/jpeg", 0.75); // Assigns image base64 string in jpeg format to a variable
      };
    };
  };

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
    const bounds = canvas.getBoundingClientRect();
    switch (type) {
      case "rect":
        const minX = Math.min(x1 as number, x2 as number);
        const maxX = Math.max(x1 as number, x2 as number);
        const minY = Math.min(y1 as number, y2 as number);
        const maxY = Math.max(y1 as number, y2 as number);
        return x >= minX && x <= maxX && y <= maxY && y >= minY;
      case "ell":
      // something hrere
      case "line":
        const on = onLine(
          x1 as number,
          y1 as number,
          x2 as number,
          y2 as number,
          x - bounds.left,
          y - bounds.top
        );
        const start = nearPoint(
          x - bounds.left,
          y - bounds.top,
          x1 as number,
          y1 as number,
          "start"
        );
        const end = nearPoint(
          x - bounds.left,
          y - bounds.top,
          x2 as number,
          y2 as number,
          "end"
        );
        return start || end || on;
      case "pencil":
        const betweenAnyPoint = element.points?.some((point, index) => {
          const nextPoint = (
            element.points as {
              x: number;
              y: number;
            }[]
          )[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(
              point.x,
              point.y,
              nextPoint.x,
              nextPoint.y,
              x - bounds.left,
              y - bounds.top,
              5
            ) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      case "text":
        return x >= (x1 as number) &&
          x <= (x2 as number) &&
          y >= (y1 as number) &&
          y <= (y2 as number)
          ? "inside"
          : null;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const createElement = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: string,
    id: number,
    strokeWidth: number,
    fill: string,
    fillStyle: string,
    stroke: string
  ): ElementInterface | undefined => {
    let roughElement;
    const bounds = canvas?.getBoundingClientRect();
    switch (type) {
      case "rect":
        roughElement = generator.rectangle(
          x1 - bounds?.left,
          y1 - bounds?.top,
          x2 - x1,
          y2 - y1,
          {
            fill,
            stroke,
            strokeWidth,
            fillStyle,
          }
        );
        return {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          roughElement,
          fill,
          stroke,
          strokeWidth,
          fillStyle,
        };
      case "ell":
        roughElement = generator.ellipse(
          x1 - bounds?.left,
          y1 - bounds?.top,
          x2 - x1,
          y2 - y1,
          {
            fill,
            stroke,
            strokeWidth,
            fillStyle,
          }
        );
        return {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          roughElement,
          fill,
          stroke,
          strokeWidth,
          fillStyle,
        };
      case "line":
        roughElement = generator.line(
          x1 - bounds?.left,
          y1 - bounds?.top,
          x2 - bounds?.left,
          y2 - bounds?.top,
          {
            strokeWidth,
            stroke,
          }
        );

        return {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          roughElement,
          stroke,
          strokeWidth,
        };
      case "pencil":
        return {
          id,
          type,
          points: [{ x: x1 - bounds?.left, y: y1 - bounds?.top }],
          fill,
          thickness: strokeWidth,
        };
      case "text":
        const transformedX1 = x1 - bounds?.left;
        const transformedY1 = y1 - bounds?.top;

        return {
          id,
          type,
          x1: transformedX1,
          y1: transformedY1,
          text: "hello world",
        };
    }
  };

  const getElementPosition = (x: number, y: number) => {
    let positionArray: ElementInterface[] = [];
    lodash.filter(elements, (element) => {
      const returned = positionWithinElement(x, y, element);
      if (returned) {
        positionArray.push(element);
      }
    });
    return positionArray;
  };

  const updateElement = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: string,
    index: number,
    strokeWidth: number,
    fill: string,
    fillStyle: string,
    stroke: string
  ) => {
    const elementsCopy = [...elements];
    const bounds = canvas?.getBoundingClientRect();
    switch (type) {
      case "line":
      case "ell":
      case "rect":
        elementsCopy[index] = createElement(
          x1 as number,
          y1 as number,
          x2,
          y2,
          type,
          index,
          strokeWidth,
          fill,
          fillStyle,
          stroke
        ) as ElementInterface;
        break;

      case "pencil":
        elementsCopy[index].points = [
          ...(elementsCopy[index].points as any),
          { x: x2 - bounds?.left, y: y2 - bounds?.top },
        ];
        break;

      case "text":
        break;
    }
    setElements(elementsCopy);
  };

  const handleMouseDown = (e: MouseEvent): void => {
    if (tool === "selection") {
      const element = getElementPosition(e.clientX, e.clientY);
      if (element.length > 0) {
        setSelectedElement(element[0]);
        setAction("moving");
      }
    } else if (tool === "default") {
      setAction("none");
    } else if (
      tool === "pencil" ||
      tool === "rect" ||
      tool === "ell" ||
      tool === "line"
    ) {
      setAction("drawing");
      const id = elements.length;
      const newElement = createElement(
        e.clientX,
        e.clientY,
        e.clientX,
        e.clientY,
        tool,
        id,
        brushWidth,
        hex,
        shapeFillType,
        hex
      );

      setElements([...elements, newElement as ElementInterface]);
    } else if (tool === "text") {
      setAction("writing");
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
        tool,
        index,
        brushWidth,
        hex,
        shapeFillType,
        hex
      );
    } else if (action === "writing") {
    } else if (action === "moving") {
      const { x2, x1, y2, y1, id, type, fill, fillStyle, stroke, strokeWidth } =
        selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      updateElement(
        e.clientX,
        e.clientY,
        e.clientX + width,
        e.clientY + height,
        type,
        id,
        strokeWidth,
        fill,
        fillStyle,
        stroke
      );
    }
  };

  const handleMouseUp = (e: MouseEvent): void => {
    setAction("none");
    setSelectedElement(null);
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
    shapeFillType,
    setShapeFillType,
    setThickness,
    thickness,
    setBrushWidth,
    handleSave,
    setDraftBoard,
    draftBoard,
    handleImageAdd,
    setTool,
    tool,
    shapes,
    setShapes,
    text,
    setText,
  };
};

export default useDraw;
