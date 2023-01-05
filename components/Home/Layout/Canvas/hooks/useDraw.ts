import {
  useRef,
  useState,
  MutableRefObject,
  useLayoutEffect,
  MouseEvent,
  FormEvent,
  useEffect,
} from "react";
import rough from "roughjs/bundled/rough.cjs";
import { ElementInterface, Point2 } from "../types/canvas.types";
import getStroke from "perfect-freehand";
import lodash from "lodash";

const useDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writingRef = useRef<HTMLTextAreaElement>(null);
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
  const generator = rough.generator();
  const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>)?.current;
  const ctx = canvas?.getContext("2d");

  const useElementHistory = (initialState: any) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([initialState]);

    const setState = (action: any, overwrite = false) => {
      const newState =
        typeof action === "function" ? action(history[index]) : action;
      if (overwrite) {
        const historyCopy = [...history];
        historyCopy[index] = newState;
        setHistory(historyCopy);
      } else {
        const updatedState = [...history].slice(0, index + 1);
        setHistory([...updatedState, newState]);
        setIndex((prevState) => prevState + 1);
      }
    };

    const undo = (): boolean | void =>
      index > 0 && setIndex((prevState) => prevState - 1);
    const redo = (): boolean | void =>
      index < history.length - 1 && setIndex((prevState) => prevState + 1);

    return [history[index], setState, undo, redo];
  };

  const [elements, setElements, undo, redo] = useElementHistory([]);

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
            size: element?.strokeWidth,
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
      a.download = "thedial_drafts.png";
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
      elements.forEach((element: any) => {
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

  const insideEllipse = (
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const p =
      Math.pow(x - x1, 2) / Math.pow(x2 - x1, 2) +
      Math.pow(y - y1, 2) / Math.pow(y2 - y1, 2);
    return p < 1;
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
        const topLeft = nearPoint(x, y, x1 as number, y1 as number, "tl");
        const topRight = nearPoint(x, y, x2 as number, y1 as number, "tr");
        const bottomLeft = nearPoint(x, y, x1 as number, y2 as number, "bl");
        const bottomRight = nearPoint(x, y, x2 as number, y2 as number, "br");
        const inside =
          x >= (x1 as number) &&
          x <= (x2 as number) &&
          y >= (y1 as number) &&
          y <= (y2 as number)
            ? "inside"
            : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      case "ell":
        const ellInside = insideEllipse(
          x,
          y,
          x1 as number,
          y1 as number,
          x2 as number,
          y2 as number
        );
        return ellInside;
      case "line":
        const on = onLine(
          x1 as number,
          y1 as number,
          x2 as number,
          y2 as number,
          x,
          y
        );
        const start = nearPoint(x, y, x1 as number, y1 as number, "start");
        const end = nearPoint(x, y, x2 as number, y2 as number, "end");
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
    strokeWidth?: number,
    fill?: string,
    fillStyle?: string,
    stroke?: string
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
          strokeWidth,
        };
      case "text":
        const transformedX1 = x1 - bounds?.left;
        const transformedY1 = y1 - bounds?.top;

        return {
          id,
          type,
          x1: transformedX1,
          y1: transformedY1,
          text: "",
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
    stroke: string,
    text: string
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
        const textWidth = ctx?.measureText(text).width as number;
        const textHeight = 24 as number;
        elementsCopy[index] = {
          ...createElement(x1, y1, x1 + textWidth, y1 + textHeight, type, index, ""),
          text: text,
        };
        break;
    }
    setElements(elementsCopy, true);
  };

  const handleMouseDown = (e: MouseEvent): void => {
    if (tool === "selection") {
      const element = getElementPosition(e.clientX, e.clientY);
      if (element.length > 0) {
        if (element[0].type === "pencil") {
          const offsetXs = element[0].points?.map(
            (point) => e.clientX - point.x
          );
          const offsetYs = element[0].points?.map(
            (point) => e.clientY - point.y
          );
          setSelectedElement({ ...element[0], offsetXs, offsetYs });
        } else {
          const offsetX = e.clientX - (element[0]?.x1 as number);
          const offsetY = e.clientY - (element[0]?.y1 as number);
          setSelectedElement({ ...element[0], offsetX, offsetY });
        }
        setElements((prevState: any) => prevState);

        setAction("moving");
      }
    } else if (tool === "default") {
      setAction("none");
    } else if (
      tool === "pencil" ||
      tool === "rect" ||
      tool === "ell" ||
      tool === "line" ||
      tool === "text"
    ) {
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
      setElements((prevState: any) => [...prevState, newElement]);
      setSelectedElement(newElement);
      setAction(tool === "text" ? "writing" : "drawing");
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
      return;
    } else if (action === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points?.map(
          (_: ElementInterface, index: number) => ({
            x: e.clientX - selectedElement?.offsetXs[index],
            y: e.clientY - selectedElement?.offsetYs[index],
          })
        );
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const {
          x2,
          x1,
          y2,
          y1,
          id,
          type,
          fill,
          fillStyle,
          stroke,
          strokeWidth,
          offsetX,
          offsetY,
        } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const afterOffsetX = e.clientX - offsetX;
        const afterOffsetY = e.clientY - offsetY;
        updateElement(
          afterOffsetX,
          afterOffsetY,
          afterOffsetX + width,
          afterOffsetY + height,
          type,
          id,
          strokeWidth,
          fill,
          fillStyle,
          stroke
        );
      }
    }
  };

  useEffect(() => {}, [undo, redo]);

  const handleMouseUp = (e: MouseEvent): void => {
    // if (selectedElement) {
    //   if (
    //     selectedElement.type === "text" &&
    //     e.clientX - selectedElement.offsetX === selectedElement.x1 &&
    //     e.clientY - selectedElement.offsetY === selectedElement.y1
    //   ) {
    //     setAction("writing");
    //     return;
    //   }
    // }

    if (action === "writing") return;
    setAction("none");
    setSelectedElement(null);
  };

  useEffect(() => {
    const textAreaElement = writingRef.current;
    if (action === "writing") {
      textAreaElement?.focus();
      (textAreaElement as HTMLTextAreaElement).value = selectedElement.text;
    }
  }, [action, selectedElement]);

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
    undo,
    redo,
    selectedElement,
    action,
    writingRef,
  };
};

export default useDraw;
