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
import { ElementInterface, Point, Point2 } from "../types/canvas.types";
import getStroke from "perfect-freehand";
import lodash from "lodash";
import { useDispatch } from "react-redux";
import { setPublication } from "../../../../../redux/reducers/publicationSlice";
import useImageUpload from "../../../../Common/Modals/Publications/hooks/useImageUpload";

const useDraw = () => {
  const { uploadImage } = useImageUpload();
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writingRef = useRef<HTMLTextAreaElement>(null);
  const [showSideDrawOptions, setShowSideDrawOptions] =
    useState<boolean>(false);
  const [showBottomDrawOptions, setShowBottomDrawOptions] =
    useState<boolean>(false);
  const [shapeFillType, setShapeFillType] = useState<string>("solid");
  const [text, setText] = useState<boolean>(false);
  const [transformCtx, setTransformCtx] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [reset, setReset] = useState<boolean>(false);
  const [wheel, setWheel] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [shapes, setShapes] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [tool, setTool] = useState<string>("pencil");
  const [action, setAction] = useState<string>("none");
  const [draftBoard, setDraftBoard] = useState<boolean>(false);
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const generator = rough.generator();
  const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>)?.current;
  const ctx = canvas?.getContext("2d");
  const dosis = new FontFace("dosis", "url(fonts/DosisRegular.ttf)");
  const [scale, setScale] = useState<number>(1);

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

  const handleMouseWheel = (e: WheelEvent) => {
    // if (ctx) {
    //   setWheel(!wheel);
    //   const bounds = canvas?.getBoundingClientRect();
    //   console.log(e);
    //   setMx(e.clientX / scale + ox);
    //   setMy(e.clientY / scale + oy);
    //   mousex = e.clientX / scale + ox;
    //   mousey = e.clientY / scale + oy;
    //   const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    //   // var zoom = 1 + wheelMouse / 2;
    //   ctx?.clearRect(0, 0, canvas.width / (scale * zoom), canvas.height) /
    //     (scale * zoom);
    //   ctx?.translate(ox, oy);
    //   ctx?.scale(zoom, zoom);
    //   ctx?.translate(
    //     -(mousex / scale + ox - mousex / (scale * zoom)),
    //     -(mousey / scale + oy - mousey / (scale * zoom))
    //   );
    //   setOx(mousex / scale + ox - mousex / (scale * zoom));
    //   setOy(mousey / scale + oy - mousey / (scale * zoom));
    //   setScale(scale * zoom);
    //   e.preventDefault();
    // }
  };

  const drawElement = (
    element: ElementInterface,
    roughCanvas: any,
    ctx: CanvasRenderingContext2D | null
  ) => {
    (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;
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
        (ctx as CanvasRenderingContext2D).textBaseline = "top";
        (
          ctx as CanvasRenderingContext2D
        ).font = `${element.strokeWidth}px dosis`;
        (ctx as CanvasRenderingContext2D).fillStyle = element.fill as string;
        (ctx as CanvasRenderingContext2D).fillText(
          element.text as string,
          element.x1 as number,
          element.y1 as number
        );
        break;

      case "image":
        ctx?.drawImage(
          element?.image as HTMLImageElement,
          element.x1 as number,
          element.y1 as number,
          (element.x2 as number) - (element.x1 as number),
          (element.y2 as number) - (element.y1 as number)
        );
        const imgData = canvas.toDataURL("image/jpeg", 0.75);
        break;

      case "marquee":
        ctx?.beginPath();
        ctx?.setLineDash([10, 10]);
        (ctx as CanvasRenderingContext2D).strokeStyle = "#929292";
        // (ctx as CanvasRenderingContext2D).lineDashOffset = -borderOffset;
        ctx?.strokeRect(
          element.x1 as number,
          element.y1 as number,
          element.x2 as number,
          element.y2 as number
        );
        ctx?.stroke();
        break;

      default:
        throw new Error("type not supported");
    }
  };

  const getCanvas = (): string => {
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
        marquee.x1,
        marquee.y1,
        marquee.x2,
        marquee.y2,
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

  const handleSave = (): void => {
    const img = getCanvas();
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

  const dispatchPostCanvas = async (): Promise<void> => {
    const imgURL = getCanvas();
    const res: Response = await fetch(imgURL);
    const blob: Blob = await res.blob();
    const postImage = new File([blob], "thedial_drafts", { type: "image/png" });
    await uploadImage(postImage, true);
  };

  const handleCanvasPost = async (): Promise<void> => {
    await dispatchPostCanvas();
    dispatch(setPublication(true));
  };

  const handleImageAdd = (e: FormEvent) => {
    const image = (e.target as HTMLFormElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onloadend = (e) => {
      const imageObject = new Image();
      imageObject.src = e.target?.result as string;
      imageObject.onload = function (ev) {
        const newElement = createElement(
          50,
          50,
          50 + imageObject.width,
          50 + imageObject.height,
          "image",
          elements?.length,
          undefined,
          undefined,
          undefined,
          undefined,
          imageObject
        );
        setElements((prevState: any) => [...prevState, newElement]);
      };
    };
  };

  useLayoutEffect(() => {
    if (ctx) {
      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";

      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      const roughCanvas = rough?.canvas(canvas);
      elements?.forEach((element: any) => {
        if (action === "writing" && selectedElement.id === element.id) return;
        drawElement(element, roughCanvas, ctx);
      });
    }
  }, [
    elements,
    action,
    selectedElement,
    tool,
    ctx,
    transformCtx,
    panStart,
    wheel,
  ]);

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
    maxDistance: number
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
      Math.pow(x - x1, 2) / Math.pow((x2 - x1) * Math.PI, 2) +
      Math.pow(y - y1, 2) / Math.pow((y2 - y1) * Math.PI, 2);
    return p;
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

        return ellInside < 0.3 && ellInside > 0.6 * 0.3
          ? "edge"
          : ellInside < 0.3 && "inside";
      case "line":
        const on = onLine(
          x1 as number,
          y1 as number,
          x2 as number,
          y2 as number,
          x,
          y,
          element.strokeWidth as number
        );
        const start = nearPoint(x, y, x1 as number, y1 as number, "start");
        const end = nearPoint(x, y, x2 as number, y2 as number, "end");
        return start || end || on;
      case "pencil":
        const betweenAnyPoint = element.points?.some((point, index) => {
          const nextPoint: any = (
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
              element.strokeWidth as number
            ) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      case "text":
        return x - bounds.left >= (x1 as number) &&
          x <= (x2 as number) &&
          y - bounds.top >= (y1 as number) &&
          y <= (y2 as number)
          ? "inside"
          : null;
      case "image":
        const topImageLeft = nearPoint(
          x - bounds.left,
          y - bounds.top,
          x1 as number,
          y1 as number,
          "tl"
        );
        const topImageRight = nearPoint(
          x - bounds.left,
          y - bounds.top,
          x2 as number,
          y1 as number,
          "tr"
        );
        const bottomImageLeft = nearPoint(
          x - bounds.left,
          y - bounds.top,
          x1 as number,
          y2 as number,
          "bl"
        );
        const bottomImageRight = nearPoint(
          x - bounds.left,
          y - bounds.top,
          x2 as number,
          y2 as number,
          "br"
        );
        const insideImage =
          x - bounds.left >= (x1 as number) &&
          x - bounds.left <= (x2 as number) &&
          y - bounds.top >= (y1 as number) &&
          y - bounds.top <= (y2 as number)
            ? "inside"
            : null;
        return (
          topImageLeft ||
          topImageRight ||
          bottomImageLeft ||
          bottomImageRight ||
          insideImage
        );
      case "marquee":
        break;
      // const topMarqueeLeft = nearPoint(
      //   x - bounds.left,
      //   y - bounds.top,
      //   x1 as number,
      //   y1 as number,
      //   "tl"
      // );
      // const topMarqueeRight = nearPoint(
      //   x - bounds.left,
      //   y - bounds.top,
      //   (x2 as number) + (x1 as number),
      //   y1 as number,
      //   "tr"
      // );
      // const bottomMarqueeLeft = nearPoint(
      //   x - bounds.left,
      //   y - bounds.top,
      //   x1 as number,
      //   (y2 as number) + (y1 as number),
      //   "bl"
      // );
      // const bottomMarqueeRight = nearPoint(
      //   x - bounds.left,
      //   y - bounds.top,
      //   (x2 as number) + (x1 as number),
      //   (y2 as number) + (y1 as number),
      //   "br"
      // );
      // const insideMarquee =
      //   x - bounds.left >= (x1 as number) &&
      //   x - bounds.left <= (x2 as number) + (x1 as number);
      // y - bounds.top >= (y1 as number) &&
      // y - bounds.top <= (y2 as number) + (y1 as number)
      //   ? "inside"
      //   : null;
      // return (
      //   topMarqueeLeft ||
      //   topMarqueeRight ||
      //   bottomMarqueeLeft ||
      //   bottomMarqueeRight ||
      //   insideMarquee
      // );
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
    stroke?: string,
    image?: HTMLImageElement
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
          (x2 - x1) * Math.PI,
          (y2 - y1) * Math.PI,
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
          points: [
            {
              x: x1 - bounds?.left,
              y: y1 - bounds?.top,
            },
          ],
          fill,
          strokeWidth,
        };
      case "text":
        return {
          id,
          type,
          x1: x1 - bounds?.left,
          y1: y1 - bounds?.top,
          x2: x2 + (strokeWidth as number),
          y2: y2 + (strokeWidth as number),
          fill,
          strokeWidth,
          text: "",
        };
      case "image":
        return {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          image,
        };
      case "marquee":
        return {
          id,
          type,
          x1: x1,
          y1: y1,
          x2: x2 - x1,
          y2: y2 - y1,
        };
    }
  };

  const getElementPosition = (x: number, y: number) => {
    let positionArray: ElementInterface[] = [];
    lodash.filter(elements, (element) => {
      const returned = positionWithinElement(x, y, element);
      if (returned) {
        positionArray.push({ ...element, position: returned });
      }
    });
    return positionArray;
  };

  const updateElement = (
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
          x1 as number,
          y1 as number,
          x2 as number,
          y2 as number,
          type,
          index,
          strokeWidth as number,
          fill as string,
          fillStyle as string,
          stroke as string
        ) as ElementInterface;
        break;

      case "image":
        elementsCopy[index] = createElement(
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
        ) as ElementInterface;
        break;

      case "pencil":
        elementsCopy[index].points = [
          ...(elementsCopy[index].points as any),
          { x: (x2 as number) - bounds?.left, y: (y2 as number) - bounds?.top },
        ];
        break;

      case "text":
        const textWidth = ctx?.measureText(text as string).width as number;
        elementsCopy[index] = {
          ...createElement(
            x1,
            y1,
            x1 + textWidth,
            y1 + (strokeWidth as number),
            type,
            index,
            strokeWidth as number,
            fill as string
          ),
          text,
        };
        break;

      case "marquee":
        elementsCopy[index] = createElement(
          x1 as number,
          y1 as number,
          x2 as number,
          y2 as number,
          type,
          index
        ) as ElementInterface;
        break;
    }
    setElements(elementsCopy, true);
  };

  const removeMarquee = (): ElementInterface[] => {
    const filteredMarqueeElements = lodash.filter(
      elements,
      (element) => element.type !== "marquee"
    );
    return filteredMarqueeElements;
  };

  const handleMouseDown = (e: MouseEvent): void => {
    if (tool === "selection" || tool === "resize") {
      const element = getElementPosition(e.clientX, e.clientY);
      if (element?.length > 0) {
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
        if (tool === "resize") {
          setAction("resizing");
        } else if (tool === "selection") {
          setAction("moving");
        }
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
      const filteredMarqueeElements = removeMarquee();
      const id = filteredMarqueeElements?.length;
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
      setElements([...filteredMarqueeElements, newElement]);
      setSelectedElement(newElement);
      setAction(tool === "text" ? "writing" : "drawing");
    } else if (tool === "erase") {
      setAction("erasing");
    } else if (tool === "pan") {
      setAction("panning");
    } else if (tool === "marquee") {
      // remove any previous marquee
      const filteredMarqueeElements = removeMarquee();
      const bounds = canvas?.getBoundingClientRect();
      const id = filteredMarqueeElements?.length;
      const newElement = createElement(
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        tool,
        id
      );
      setAction("marquee");
      setElements([...filteredMarqueeElements, newElement]);
      setSelectedElement(newElement);
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (!action || action === "writing") return;
    if (action === "drawing") {
      const index = elements?.length - 1;
      const values = elements?.[index];
      updateElement(
        values?.x1 as number,
        values?.y1 as number,
        e.clientX,
        e.clientY,
        tool,
        index,
        brushWidth,
        hex,
        shapeFillType,
        hex
      );
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
      } else if (selectedElement.type === "image") {
        const { x2, x1, y2, y1, id, type, offsetX, offsetY, image } =
          selectedElement;
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
          null,
          null,
          null,
          null,
          undefined,
          image
        );
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
          type === "text" ? e.clientX : afterOffsetX,
          type === "text" ? e.clientY : afterOffsetY,
          afterOffsetX + width,
          afterOffsetY + height,
          type,
          id,
          strokeWidth,
          fill,
          fillStyle,
          stroke,
          type === "text" && selectedElement?.text
        );
      }
    } else if (action === "erasing") {
      const eraseElement = getElementPosition(e.clientX, e.clientY);
      if (eraseElement.length > 0) {
        const filteredElements = lodash.filter(
          elements,
          (element) => element.id !== eraseElement[0].id
        );
        setElements(filteredElements);
      }
    } else if (action === "panning") {
    } else if (action === "marquee") {
      const index = elements?.length - 1;
      const { x1, y1 } = elements[index];
      const bounds = canvas?.getBoundingClientRect();
      updateElement(
        x1 as number,
        y1 as number,
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        tool,
        index,
        brushWidth,
        hex,
        shapeFillType,
        hex
      );
    } else if (action === "resizing") {
      const values = selectedElement;
      if (
        values?.type !== "text" &&
        values?.position !== "inside" &&
        values?.type !== "image" &&
        values.type !== "ell"
      ) {
        const updatedCoordinates = resizedCoordinates(
          e.clientX,
          e.clientY,
          values?.position,
          values?.x1,
          values?.y1,
          values?.x2,
          values?.y2
        );
        updateElement(
          updatedCoordinates?.x1 as number,
          updatedCoordinates?.y1 as number,
          updatedCoordinates?.x2 as number,
          updatedCoordinates?.y2 as number,
          values?.type,
          values?.id,
          values?.strokeWidth,
          values?.fill,
          values?.fillStyle,
          values?.stroke
        );
      } else if (values?.type === "image" && values?.position !== "inside") {
        const updatedCoordinates = resizedCoordinates(
          e.clientX,
          e.clientY,
          values?.position,
          values?.x1,
          values?.y1,
          values?.x2,
          values?.y2
        );
        const bounds = canvas?.getBoundingClientRect();
        const sizedx1 =
          values?.position === "tl" || values?.position === "bl"
            ? (updatedCoordinates?.x1 as number) - values.offsetX
            : (values?.position === "tr" || values?.position === "br") &&
              updatedCoordinates?.x1;
        const sizedx2 =
          values?.position === "tl" || values?.position === "bl"
            ? updatedCoordinates?.x2
            : (values?.position === "tr" || values?.position === "br") &&
              (updatedCoordinates?.x2 as number) - bounds.left;
        const sizedy1 =
          values?.position === "tl"
            ? (updatedCoordinates?.y1 as number) - values.offsetY
            : values?.position === "tr"
            ? (updatedCoordinates?.y1 as number) - bounds.top
            : (values?.position === "bl" || values?.position === "br") &&
              updatedCoordinates?.y1;
        const sizedy2 =
          values?.position === "tl" || values?.position === "tr"
            ? updatedCoordinates?.y2
            : (values?.position === "bl" || values?.position === "br") &&
              (updatedCoordinates?.y2 as number) - bounds.top;
        updateElement(
          sizedx1 as number,
          sizedy1 as number,
          sizedx2 as number,
          sizedy2 as number,
          values?.type,
          values?.id,
          null,
          null,
          null,
          null,
          undefined,
          values?.image
        );
      } else if (values?.type === "ell" && values?.position !== "inside") {
        updateElement(
          values?.x1,
          values?.y1,
          e.clientX,
          e.clientY,
          values?.type,
          values?.id,
          values?.strokeWidth,
          values?.fill,
          values?.fillStyle,
          values?.stroke
        );
      }
    }
  };

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

  const handleBlur = (e: FormEvent) => {
    if ((e as any).key === "Enter") {
      const { id, x1, y1, x2, y2, type } = selectedElement;
      const bounds = canvas?.getBoundingClientRect();
      setAction("none");
      setSelectedElement(null);
      updateElement(
        x1 + bounds.left,
        y1 + bounds.top,
        x2,
        y2,
        type,
        id,
        brushWidth,
        hex,
        null,
        null,
        (e.target as HTMLFormElement)?.value
      );
    }
  };

  const handleMouseUp = (e: MouseEvent): void => {
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        e.clientX - selectedElement.offsetX === selectedElement.x1 &&
        e.clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
    }
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
  }, [tool, action, selectedElement]);

  const loadFont = async () => {
    const doR = await dosis.load();
    document.fonts.add(doR);
  };

  const handleClear = () => {
    setClear(true);
  };

  useLayoutEffect(() => {
    if (clear) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setElements([]);
      setClear(false);
    }
  }, [clear]);

  useEffect(() => {
    loadFont();
  }, []);

  useEffect(() => {
    if (action !== "none") {
      if (shapes) setShapes(false);
      if (thickness) setThickness(false);
      if (colorPicker) setColorPicker(false);
    }
  }, [action, thickness, shapes]);

  const getTransformedPoint = (x: number, y: number) => {
    const bounds = canvas.getBoundingClientRect();
    const originalPoint = new DOMPoint(x - bounds.left, y - bounds.top);
    return ctx?.getTransform().invertSelf().transformPoint(originalPoint);
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
    undo,
    redo,
    selectedElement,
    action,
    writingRef,
    handleBlur,
    handleMouseWheel,
    handleClear,
    handleCanvasPost,
    elements,
  };
};

export default useDraw;
