import {
  useRef,
  useState,
  MutableRefObject,
  useLayoutEffect,
  MouseEvent,
  FormEvent,
  useEffect,
  WheelEvent,
} from "react";
import rough from "roughjs/bundled/rough.cjs";
import { ElementInterface } from "../types/canvas.types";
import lodash from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setPublication } from "../../../../../redux/reducers/publicationSlice";
import fileLimitAlert from "../../../../../lib/misc/helpers/fileLimitAlert";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import useImageUpload from "../../../../Common/Modals/Publications/hooks/useImageUpload";
import useDrafts from "./useDrafts";
import { RootState } from "../../../../../redux/store";
import { setDraftTitle } from "../../../../../redux/reducers/draftTitleSlice";
import { setDraftElements } from "../../../../../redux/reducers/draftElementsSlice";
import handleUploadImage from "../../../../../lib/misc/helpers/handleUploadImage";
import useElements from "./useElements";
import drawElement from "../../../../../lib/canvas/helpers/drawElement";
import getCanvas from "../../../../../lib/canvas/helpers/hiddenCanvas";
import updateElement from "../../../../../lib/canvas/helpers/updateElement";
import resizedCoordinates from "../../../../../lib/canvas/helpers/resizedCoordinates";
import getElementPosition from "../../../../../lib/canvas/helpers/getElementPosition";
import removeMarquee from "../../../../../lib/canvas/helpers/removeMarquee";
import dispatchPostCanvas from "../../../../../lib/canvas/helpers/dispatchPostCanvas";
import createElement from "../../../../../lib/canvas/helpers/createElement";
import wheelLogic from "../../../../../lib/canvas/helpers/wheelLogic";

const useDraw = () => {
  const { saveCanvasNetwork } = useDrafts();
  const { uploadImage } = useImageUpload();
  const dispatch = useDispatch();
  const title = useSelector(
    (state: RootState) => state.app.draftTitleReducer.value
  );
  const canvasType = useSelector(
    (state: RootState) => state.app.canvasTypeReducer.value
  );
  const promptImage = useSelector(
    (state: RootState) => state.app.addPromptImageReducer.value
  );
  const writingRef = useRef<HTMLTextAreaElement>(null);
  const [showSideDrawOptions, setShowSideDrawOptions] =
    useState<boolean>(false);
  const [showBottomDrawOptions, setShowBottomDrawOptions] =
    useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [shapeFillType, setShapeFillType] = useState<string>("solid");
  const [text, setText] = useState<boolean>(false);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = (canvasRef as MutableRefObject<HTMLCanvasElement>)?.current;
  const ctx = canvas?.getContext("2d");
  const dosis = new FontFace("dosis", "url(fonts/DosisRegular.ttf)");
  const [elements, setElements, undo, redo] = useElements([]);

  const handleTitle = (e: any) => {
    dispatch(setDraftTitle(e.target.value));
  };

  const handleCanvasSave = async (): Promise<void> => {
    if (title === "untitled draft" || title === "" || !title) {
      alert("Please Choose A Title");
      return;
    }
    setSaveLoading(true);
    try {
      const imgURL = getCanvas(canvas, elements);
      const res: Response = await fetch(imgURL);
      const blob: Blob = await res.blob();
      const postImage = new File([blob], "thedial_drafts", {
        type: "image/png",
      });
      let stringElements = [];
      const copyElements = [...elements];
      for (const elem in elements) {
        if (elements[elem].type === "image") {
          const res = await fetch(elements[elem].image.src);
          const blob = await res.blob();
          const file = new File([blob], "draftDial", { type: "image/png" });
          const cid = await handleUploadImage(file, false);
          const newImage = {
            ...copyElements[elem as any],
            cid: cid?.split("ipfs://")[1],
          };
          stringElements.push(JSON.stringify(newImage));
        } else {
          stringElements.push(JSON.stringify(elements[elem]));
        }
      }
      await saveCanvasNetwork(postImage, stringElements);
      // dispatch(setInsufficientFunds("saved"));
    } catch (err: any) {
      // dispatch(setInsufficientFunds("unsaved"));
      console.error(err.message);
    }
    setSaveLoading(false);
  };

  const handleSave = async (): Promise<void> => {
    const img = getCanvas(canvas, elements);
    let xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
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

  const handleCanvasPost = async (): Promise<void> => {
    setPostLoading(true);
    await dispatchPostCanvas(canvas, elements, uploadImage);
    dispatch(
      setPublication({
        actionOpen: true,
        actionCanvas: true,
      })
    );
    setPostLoading(false);
  };

  const handleImageAdd = async (e: any, url?: boolean): Promise<void> => {
    if (!url) {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (fileLimitAlert((e as any).target.files[0])) {
        return;
      }
    }
    let image: File;
    if (url) {
      image = e;
    } else {
      image = (e.target as HTMLFormElement).files[0];
    }
    const compressedImage = await compressImageFiles(image);
    const reader = new FileReader();
    reader?.readAsDataURL(compressedImage as File);

    reader.onloadend = (e) => {
      const imageObject = new Image();
      imageObject.src = e.target?.result as string;
      imageObject.onload = () => {
        const newElement = createElement(
          canvas,
          zoom,
          generator,
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

  const addImageToCanvas = async (imgURL: string): Promise<void> => {
    try {
      const res: Response = await fetch(imgURL);
      const blob: Blob = await res.blob();
      const postImage = new File([blob], "thedial_drafts", {
        type: "image/png",
      });
      await handleImageAdd(postImage, true);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useLayoutEffect(() => {
    if (ctx && !canvasType) {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(zoom, zoom);
      const roughCanvas = rough?.canvas(canvas);
      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";
      elements?.forEach((element: any) => {
        if (action === "writing" && selectedElement.id === element.id) {
          return;
        }
        drawElement(element, roughCanvas, ctx, zoom, canvas);
      });
      ctx.save();
    }
  }, [elements, action, selectedElement, tool, ctx, zoom, canvasType]);

  const handleMouseDown = (e: MouseEvent): void => {
    if (tool === "selection" || tool === "resize") {
      const element = getElementPosition(
        e.clientX,
        e.clientY,
        elements,
        canvas,
        zoom
      );
      if (element?.length > 0) {
        if (element[element?.length - 1].type === "pencil") {
          const offsetXs = element[element?.length - 1].points?.map(
            (point) => e.clientX - point.x
          );
          const offsetYs = element[element?.length - 1].points?.map(
            (point) => e.clientY - point.y
          );
          setSelectedElement({
            ...element[element?.length - 1],
            offsetXs,
            offsetYs,
          });
        } else {
          const offsetX =
            e.clientX - (element[element?.length - 1]?.x1 as number);
          const offsetY =
            e.clientY - (element[element?.length - 1]?.y1 as number);
          setSelectedElement({
            ...element[element?.length - 1],
            offsetX,
            offsetY,
          });
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
      const filteredMarqueeElements = removeMarquee(elements);
      const id = filteredMarqueeElements?.length;
      const newElement = createElement(
        canvas,
        zoom,
        generator,
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
    } else if (tool === "pan") {
      setAction("panning");
    } else if (tool === "marquee") {
      // remove any previous marquee
      const filteredMarqueeElements = removeMarquee(elements);
      const bounds = canvas?.getBoundingClientRect();
      const id = filteredMarqueeElements?.length;
      const newElement = createElement(
        canvas,
        zoom,
        generator,
        (e.clientX - bounds.left) * (devicePixelRatio / zoom),
        (e.clientY - bounds.top) * (devicePixelRatio / zoom),
        (e.clientX - bounds.left) * (devicePixelRatio / zoom),
        (e.clientY - bounds.top) * (devicePixelRatio / zoom),
        tool,
        id
      );
      setAction("marquee");
      setElements([...filteredMarqueeElements, newElement]);
      setSelectedElement(newElement);
    } else if (tool === "erase") {
      const eraseElement = getElementPosition(
        e.clientX,
        e.clientY,
        elements,
        canvas,
        zoom
      );
      if (eraseElement?.length > 0) {
        const elementsCopy = [...elements];
        const index = lodash.findIndex(elementsCopy, (elem) => {
          if (elem.id === eraseElement[eraseElement?.length - 1].id) {
            return true;
          }
        });
        if (eraseElement[eraseElement?.length - 1].type !== "marquee") {
          if (
            eraseElement[eraseElement?.length - 1].type === "pencil" ||
            eraseElement[eraseElement?.length - 1].type === "text" ||
            eraseElement[eraseElement?.length - 1].type === "image"
          ) {
            elementsCopy[index] = {
              ...elementsCopy[index],
              fill: "#078FD6",
              stroke: "#078FD6",
            };
          } else {
            elementsCopy[index].fill = "#078FD6";
            elementsCopy[index].stroke = "#078FD6";
            elementsCopy[index].roughElement.options.stroke = "#078FD6";
            elementsCopy[index].roughElement.options.fill = "#078FD6";
          }
          setSelectedElement(elementsCopy[index]);
          setElements(elementsCopy);
        }
      }
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (!action || action === "writing") return;
    if (action === "drawing") {
      const index = elements?.length - 1;
      const values = elements?.[index];
      updateElement(
        canvas,
        zoom,
        generator,
        elements,
        setElements,
        ctx as CanvasRenderingContext2D,
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
          canvas,
          zoom,
          generator,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
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
          canvas,
          zoom,
          generator,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
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
    } else if (action === "panning") {
    } else if (action === "marquee") {
      const index = elements?.length - 1;
      const { x1, y1 } = elements[index];
      const bounds = canvas?.getBoundingClientRect();
      updateElement(
        canvas,
        zoom,
        generator,
        elements,
        setElements,
        ctx as CanvasRenderingContext2D,
        x1 as number,
        y1 as number,
        (e.clientX - bounds.left) * (devicePixelRatio / zoom),
        (e.clientY - bounds.top) * (devicePixelRatio / zoom),
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
          canvas,
          zoom,
          generator,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
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
          canvas,
          zoom,
          generator,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
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
          canvas,
          zoom,
          generator,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
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

  const handleBlur = (e: FormEvent) => {
    if ((e as any).key === "Enter") {
      const { id, x1, y1, x2, y2, type } = selectedElement;
      const bounds = canvas?.getBoundingClientRect();
      setAction("none");
      setSelectedElement(null);
      updateElement(
        canvas,
        zoom,
        generator,
        elements,
        setElements,
        ctx as CanvasRenderingContext2D,
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
      if (tool === "erase") {
        if (selectedElement) {
          const filteredElements = lodash.filter(
            elements,
            (element) => element.id !== selectedElement.id
          );
          setElements(filteredElements);
        }
      } else {
      }
    }
    if (action === "writing") return;
    setAction("none");
    setSelectedElement(null);
  };

  useEffect(() => {
    if (promptImage) {
      addImageToCanvas(promptImage);
    }
  }, [promptImage]);

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

  const setNewCanvas = () => {
    dispatch(setDraftElements([]));
    setClear(true);
    dispatch(setDraftTitle("untitled draft"));
  };

  const handleWheel = (e: WheelEvent) => {
    wheelLogic(e, canvas, zoom, setZoom, ctx as CanvasRenderingContext2D, 5);
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

  return {
    hex,
    setHex,
    showSideDrawOptions,
    setShowSideDrawOptions,
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
    handleClear,
    handleCanvasPost,
    elements,
    postLoading,
    title,
    handleTitle,
    handleCanvasSave,
    saveLoading,
    zoom,
    setZoom,
    setElements,
    addImageToCanvas,
    setNewCanvas,
    handleWheel,
    canvasRef,
  };
};

export default useDraw;
