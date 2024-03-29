import {
  useRef,
  useState,
  useLayoutEffect,
  MouseEvent,
  FormEvent,
  useEffect,
  WheelEvent,
  useCallback,
} from "react";
import { ElementInterface } from "../types/canvas.types";
import lodash, { after } from "lodash";
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
import getCanvas from "../../../../../lib/canvas/helpers/getCanvas";
import updateElement from "../../../../../lib/canvas/helpers/updateElement";
import resizedCoordinates from "../../../../../lib/canvas/helpers/resizedCoordinates";
import getElementPosition from "../../../../../lib/canvas/helpers/getElementPosition";
import removeMarquee from "../../../../../lib/canvas/helpers/removeMarquee";
import dispatchPostCanvas from "../../../../../lib/canvas/helpers/dispatchPostCanvas";
import createElement from "../../../../../lib/canvas/helpers/createElement";
import wheelLogic from "../../../../../lib/canvas/helpers/wheelLogic";
import { setAddPromptImage } from "../../../../../redux/reducers/addPromptImageSlice";
import { setInitImagePrompt } from "../../../../../redux/reducers/initImagePromptSlice";
import {
  getCanvasStorage,
  setCanvasStorage,
} from "../../../../../lib/replicate/utils";
import { resetCanvas } from "../../../../../lib/canvas/helpers/resetCanvas";

const useDraw = () => {
  const [canvasState, setCanvasState] = useState<any>(null);
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    setCanvasState(canvas);
  }, []);
  const ctx = canvasState?.getContext("2d") as any;
  const [elements, setElements, undo, redo] = useElements(
    JSON.parse(getCanvasStorage() || "{}").draw || [],
    false
  );
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
    (state: RootState) => state.app.addPromptImageReducer
  );
  const writingRef = useRef<HTMLTextAreaElement>(null);
  const [showSideDrawOptions, setShowSideDrawOptions] =
    useState<boolean>(false);
  const [showBottomDrawOptions, setShowBottomDrawOptions] =
    useState<boolean>(false);
  const [saveImagesLocal, setSaveImagesLocal] = useState<boolean>(false);
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
  const [pan, setPan] = useState<{
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  }>({
    xInitial: 0,
    yInitial: 0,
    xOffset: 0,
    yOffset: 0,
  });
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const dosis = new FontFace("dosis", "url(fonts/DosisRegular.ttf)");

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
      const imgURL = getCanvas(canvasState, elements);
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
      // dispatch(setInsufficientFunds("Draft Saved."));
    } catch (err: any) {
      // dispatch(setInsufficientFunds("Could Not Save Draft, Try Again."));
      console.error(err.message);
    }
    setSaveLoading(false);
  };

  const handleSave = async (): Promise<void> => {
    const img = getCanvas(canvasState, elements);
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
    try {
      setPostLoading(true);
      await dispatchPostCanvas(
        canvasState,
        elements,
        uploadImage,
        setPostLoading
      );
      dispatch(
        setPublication({
          actionOpen: true,
          actionCanvas: true,
        })
      );
      setPostLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleImageAdd = async (
    e: any,
    url?: boolean,
    local?: boolean
  ): Promise<void> => {
    if (!url) {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (fileLimitAlert((e as any).target.files[0])) {
        return;
      }
    }
    try {
      if (!local) {
        let image: File;
        if (url) {
          image = e;
        } else {
          image = (e.target as HTMLFormElement).files[0];
        }
        const compressedImage = await compressImageFiles(image);
        const reader = new FileReader();
        reader?.readAsDataURL(compressedImage!);
        reader.onloadend = (e) => {
          const imageObject = new Image();
          imageObject.src = e.target?.result as string;
          imageObject.onload = () => {
            const newElement = createElement(
              {
                xOffset: pan.xOffset * 0.5,
                yOffset: pan.yOffset * 0.5,
              },
              canvasState,
              zoom,
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
      } else {
        const imageObject = new Image();
        imageObject.src = e;
        imageObject.onload = () => {
          const newElement = createElement(
            {
              xOffset: pan.xOffset * 0.5,
              yOffset: pan.yOffset * 0.5,
            },
            canvasState,
            zoom,
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
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const addImageToCanvas = async (
    imgURL: any,
    local?: boolean,
    lexica?: boolean
  ): Promise<void> => {
    try {
      let postImage;
      let blob: Blob;
      if (local) {
        postImage = "data:image/png;base64," + imgURL;
      } else {
        const res: Response = await fetch(imgURL);
        blob = await res.blob();
        postImage = new File([blob], "thedial_drafts", {
          type: "image/png",
        });
      }
      if (saveImagesLocal && !lexica) {
        if (local) {
          const binary = window.atob(imgURL);
          const buffer = new ArrayBuffer(binary.length);
          const view = new Uint8Array(buffer);
          for (let i = 0; i < binary.length; i++) {
            view[i] = binary.charCodeAt(i);
          }
          blob = new Blob([buffer], { type: "image/png" });
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob!);
        link.download = "the_dial_synth";
        link.click();
        URL.revokeObjectURL(link.href);
      }
      await handleImageAdd(postImage, true, local);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useLayoutEffect(() => {
    if (ctx && !canvasType) {
      canvasState.width = canvasState?.offsetWidth * devicePixelRatio;
      canvasState.height = canvasState?.offsetHeight * devicePixelRatio;
      ctx.clearRect(0, 0, canvasState?.width, canvasState?.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(pan.xOffset, pan.yOffset);
      ctx.scale(zoom, zoom);

      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";

      elements?.forEach((element: ElementInterface) => {
        if (action === "writing" && selectedElement?.id === element?.id) {
          return;
        }
        if (element?.type === "image" && typeof element?.image === "string") {
          const img = new Image();
          img.src = element.image;
          element.image = img;
        }
        drawElement(element, ctx, zoom, canvasState);
      });

      ctx.save();
      const canvasStorage = JSON.parse(getCanvasStorage() || "{}");
      setCanvasStorage(
        JSON.stringify({
          ...canvasStorage,
          draw: elements?.map((elem: any) => {
            if (
              elem?.type === "image" &&
              elem?.image instanceof HTMLImageElement
            ) {
              return { ...elem, image: elem.image.src };
            } else {
              return elem;
            }
          }),
        })
      );
    }
  }, [
    elements,
    action,
    selectedElement,
    tool,
    zoom,
    canvasType,
    pan,
    ctx,
    canvasState,
  ]);

  const handleWheel = (e: WheelEvent) => {
    wheelLogic(e, zoom, setZoom, canvasState, pan, setPan, 8);
  };

  const handleReset = () => {
    const { zoom, xOffset, yOffset } = resetCanvas(elements, canvasState);
    setZoom(zoom <= 0.03 ? 0.03 : zoom);
    setPan({
      xInitial: pan.xInitial,
      yInitial: pan.yInitial,
      xOffset,
      yOffset,
    });
  };

  const handleMouseDown = (e: MouseEvent): void => {
    const bounds = canvasState?.getBoundingClientRect();
    if (tool === "selection" || tool === "resize") {
      const element = getElementPosition(
        e.clientX,
        e.clientY,
        elements,
        canvasState,
        zoom,
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        }
      );
      if (element?.length > 0) {
        if (element[element?.length - 1].type === "pencil") {
          const offsetXs = element[element?.length - 1].points?.map(
            (point) =>
              ((e.clientX - pan.xOffset * 0.5) * devicePixelRatio) / zoom -
              point.x
          );
          const offsetYs = element[element?.length - 1].points?.map(
            (point) =>
              ((e.clientY - pan.yOffset * 0.5) * devicePixelRatio) / zoom -
              point.y
          );
          setSelectedElement({
            ...element[element?.length - 1],
            offsetXs,
            offsetYs,
          });
        } else {
          const offsetX =
            ((e.clientX - bounds.left - pan.xOffset * 0.5) * devicePixelRatio) /
              zoom -
            (element[element?.length - 1]?.x1 as number);
          const offsetY =
            ((e.clientY - bounds.top - pan.yOffset * 0.5) * devicePixelRatio) /
              zoom -
            (element[element?.length - 1]?.y1 as number);
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
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvasState,
        zoom,
        tool === "pencil" || tool === "text"
          ? e.clientX
          : (e.clientX - bounds.left - pan.xOffset * 0.5) *
              (devicePixelRatio / zoom),
        tool === "pencil" || tool === "text"
          ? e.clientY
          : (e.clientY - bounds.top - pan.yOffset * 0.5) *
              (devicePixelRatio / zoom),
        tool === "pencil" || tool === "text"
          ? e.clientX
          : (e.clientX - bounds.left - pan.xOffset * 0.5) *
              (devicePixelRatio / zoom),
        tool === "pencil" || tool === "text"
          ? e.clientY
          : (e.clientY - bounds.top - pan.yOffset * 0.5) *
              (devicePixelRatio / zoom),
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
      setPan({
        xInitial: e.clientX - bounds.left,
        yInitial: e.clientY - bounds.top,
        xOffset: pan.xOffset,
        yOffset: pan.yOffset,
      });
      setAction("panning");
    } else if (tool === "marquee") {
      // remove any previous marquee
      const filteredMarqueeElements = removeMarquee(elements);
      const bounds = canvasState?.getBoundingClientRect();
      const id = filteredMarqueeElements?.length;
      const newElement = createElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvasState,
        zoom,

        (e.clientX - bounds.left - pan.xOffset * 0.5) *
          (devicePixelRatio / zoom),
        (e.clientY - bounds.top - pan.yOffset * 0.5) *
          (devicePixelRatio / zoom),
        (e.clientX - bounds.left - pan.xOffset * 0.5) *
          (devicePixelRatio / zoom),
        (e.clientY - bounds.top - pan.yOffset * 0.5) *
          (devicePixelRatio / zoom),
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
        canvasState,
        zoom,
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        }
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
          }
          setSelectedElement(elementsCopy[index]);
          setElements(elementsCopy);
        }
      }
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    const bounds = canvasState?.getBoundingClientRect();
    if (!action || action === "writing") return;
    if (action === "drawing") {
      const index = elements?.length - 1;
      const values = elements?.[index];
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvasState,
        zoom,
        elements,
        setElements,
        ctx as CanvasRenderingContext2D,
        values?.x1 as number,
        values?.y1 as number,
        tool === "pencil"
          ? e.clientX
          : (e.clientX - bounds.left - pan.xOffset * 0.5) *
              (devicePixelRatio / zoom),

        tool === "pencil"
          ? e.clientY
          : (e.clientY - bounds.top - pan.yOffset * 0.5) *
              (devicePixelRatio / zoom),
        tool,
        index,
        brushWidth,
        hex,
        shapeFillType,
        hex
      );
    } else if (action === "moving") {
      if (selectedElement?.type === "pencil") {
        const newPoints = selectedElement.points?.map(
          (_: ElementInterface, index: number) => ({
            x:
              ((e.clientX - pan.xOffset * 0.5) / zoom) * devicePixelRatio -
              selectedElement?.offsetXs[index],
            y:
              ((e.clientY - pan.yOffset * 0.5) / zoom) * devicePixelRatio -
              selectedElement?.offsetYs[index],
          })
        );
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else if (selectedElement?.type === "image") {
        const { x2, x1, y2, y1, id, type, offsetX, offsetY, image } =
          selectedElement;
        const afterOffsetX =
          e.clientX -
          bounds?.left -
          pan.xOffset * 0.5 -
          (offsetX * zoom - pan.xOffset) / devicePixelRatio;
        const afterOffsetY =
          e.clientY -
          bounds?.top -
          pan.yOffset * 0.5 -
          (offsetY * zoom - pan.yOffset) / devicePixelRatio;
        updateElement(
          {
            xOffset: pan.xOffset * 0.5,
            yOffset: pan.yOffset * 0.5,
          },
          canvasState,
          zoom,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
          afterOffsetX,
          afterOffsetY,
          afterOffsetX + ((x2 - x1) * zoom) / devicePixelRatio,
          afterOffsetY + ((y2 - y1) * zoom) / devicePixelRatio,
          type,
          id,
          null,
          null,
          null,
          null,
          undefined,
          image
        );
      } else if (selectedElement?.type === "text") {
        const textWidth = ctx?.measureText(selectedElement?.text!).width!;
        const textHeight = ctx?.measureText("M").width! / 2;
        const newElement = {
          ...selectedElement,
          x1:
            ((e.clientX - bounds.left - pan.xOffset * 0.5) * devicePixelRatio) /
            zoom,
          y1:
            ((e.clientY - bounds.top - pan.yOffset * 0.5) * devicePixelRatio) /
            zoom,
          x2:
            ((e.clientX - bounds.left - pan.xOffset * 0.5) * devicePixelRatio) /
              zoom +
            textWidth * zoom,
          y2:
            ((e.clientY - bounds.top - pan.yOffset * 0.5) * devicePixelRatio) /
              zoom +
            textHeight * zoom,
        };
        const updatedElements = elements?.map((element: ElementInterface) =>
          element.id === selectedElement?.id ? newElement : element
        );
        setElements(updatedElements, true);
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
        const afterOffsetX =
          ((e.clientX - bounds?.left - pan.xOffset * 0.5) / zoom) *
            devicePixelRatio -
          offsetX;
        const afterOffsetY =
          ((e.clientY - bounds?.top - pan.yOffset * 0.5) / zoom) *
            devicePixelRatio -
          offsetY;
        updateElement(
          {
            xOffset: pan.xOffset * 0.5,
            yOffset: pan.yOffset * 0.5,
          },
          canvasState,
          zoom,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
          afterOffsetX,
          afterOffsetY,
          afterOffsetX + x2,
          afterOffsetY + x2,
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
      const bounds = canvasState?.getBoundingClientRect();
      const xDiff = (e.clientX - bounds.left - pan.xInitial) / zoom;
      const yDiff = (e.clientY - bounds.top - pan.yInitial) / zoom;

      setPan((prevPan) => ({
        ...prevPan,
        xOffset: prevPan.xOffset + xDiff * 0.5,
        yOffset: prevPan.yOffset + yDiff * 0.5,
      }));
    } else if (action === "marquee") {
      const index = elements?.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvasState,
        zoom,
        elements,
        setElements,
        ctx as CanvasRenderingContext2D,
        x1 as number,
        y1 as number,
        (e.clientX - bounds.left - pan.xOffset * 0.5) *
          (devicePixelRatio / zoom),
        (e.clientY - bounds.top - pan.yOffset * 0.5) *
          (devicePixelRatio / zoom),
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
        let updatedX2: number,
          updatedY2: number,
          updatedX1: number,
          updatedY1: number;
        if ((values?.x2 as number) < 1 && values?.type !== "line") {
          updatedX1 = (values?.x2 as number) + (values?.x1 as number);
          updatedX2 = values?.x1 as number;
        } else {
          updatedX1 = values?.x1 as number;
          updatedX2 = (values?.x2 as number) + (values?.x1 as number);
        }
        if ((values?.y2 as number) < 1 && values?.type !== "line") {
          updatedY1 = (values?.y2 as number) + (values?.y1 as number);
          updatedY2 = values?.y1 as number;
        } else {
          updatedY1 = values?.y1 as number;
          updatedY2 = (values?.y2 as number) + (values?.y1 as number);
        }
        const updatedCoordinates = resizedCoordinates(
          ((e.clientX - bounds.left - pan.xOffset * 0.5) * devicePixelRatio) /
            zoom,
          ((e.clientY - bounds.top - pan.yOffset * 0.5) * devicePixelRatio) /
            zoom,
          values?.position,
          updatedX1,
          updatedY1,
          updatedX2,
          updatedY2
        );
        updateElement(
          {
            xOffset: pan.xOffset * 0.5,
            yOffset: pan.yOffset * 0.5,
          },
          canvasState,
          zoom,
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
          e.clientX - bounds?.left,
          e.clientY - bounds?.top,
          values?.position,
          (values?.x1 * zoom + pan.xOffset) / devicePixelRatio,
          (values?.y1 * zoom + pan.yOffset) / devicePixelRatio,
          (values?.x2 * zoom + pan.xOffset) / devicePixelRatio,
          (values?.y2 * zoom + pan.yOffset) / devicePixelRatio
        );
        updateElement(
          {
            xOffset: pan.xOffset * 0.5,
            yOffset: pan.yOffset * 0.5,
          },
          canvasState,
          zoom,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
          updatedCoordinates?.x1 as number,
          updatedCoordinates?.y1 as number,
          updatedCoordinates?.x2 as number,
          updatedCoordinates?.y2 as number,
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
          {
            xOffset: pan.xOffset * 0.5,
            yOffset: pan.yOffset * 0.5,
          },
          canvasState,
          zoom,
          elements,
          setElements,
          ctx as CanvasRenderingContext2D,
          values?.x1,
          values?.y1,
          (e.clientX - bounds.left - pan.xOffset * 0.5) *
            (devicePixelRatio / zoom),
          (e.clientY - bounds.top - pan.yOffset * 0.5) *
            (devicePixelRatio / zoom),
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
      const bounds = canvasState?.getBoundingClientRect();
      setAction("none");
      setSelectedElement(null);
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvasState,
        zoom,
        elements,
        setElements,
        ctx as CanvasRenderingContext2D,
        (x1 * devicePixelRatio + bounds.left * zoom - pan.xOffset) / zoom,
        (y1 * devicePixelRatio + bounds.top * zoom - pan.yOffset) / zoom,
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
        selectedElement?.type === "text" &&
        e.clientX - selectedElement.offsetX === selectedElement.x1 &&
        e.clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
      if (tool === "erase") {
        const filteredElements = lodash.filter(
          elements,
          (element) => element.id !== selectedElement.id
        );
        setElements(filteredElements);
      }
    }
    if (action === "marquee") {
      // send marquee for img2img
      dispatch(setInitImagePrompt(getCanvas(canvasState, elements)));
    }
    if (action === "writing") return;
    setAction("none");
    setSelectedElement(null);
  };

  useEffect(() => {
    if (promptImage.url && !canvasType) {
      addImageToCanvas(promptImage.url, promptImage.local);

      dispatch(
        setAddPromptImage({
          actionURL: undefined,
          actionLocal: false,
          actionBatch: undefined,
        })
      );
    }
  }, [promptImage.url, promptImage.local]);

  useEffect(() => {
    const textAreaElement = writingRef.current;
    if (action === "writing") {
      textAreaElement?.focus();
      (textAreaElement as HTMLTextAreaElement).value = selectedElement?.text;
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

  useLayoutEffect(() => {
    if (clear) {
      ctx?.clearRect(0, 0, canvasState?.width, canvasState?.height);
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
    setPan,
    setSaveImagesLocal,
    saveImagesLocal,
    handleReset,
  };
};

export default useDraw;
