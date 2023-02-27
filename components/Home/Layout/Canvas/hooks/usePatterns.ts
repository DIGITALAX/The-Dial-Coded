import {
  useEffect,
  useLayoutEffect,
  useState,
  MouseEvent,
  WheelEvent,
  useRef,
  MutableRefObject,
  FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCanvasType } from "../../../../../redux/reducers/canvasTypeSlice";
import { UsePatternsResult, SvgPatternType } from "../types/canvas.types";
import base from "./../../../../../pages/api/constants/base.json";
import safe from "./../../../../../pages/api/constants/safe.json";
import temp from "./../../../../../pages/api/constants/temp.json";
import useElements from "./useElements";
import { RootState } from "../../../../../redux/store";
import lodash from "lodash";
import wheelLogic from "../../../../../lib/canvas/helpers/wheelLogic";
import { setAddPromptImage } from "../../../../../redux/reducers/addPromptImageSlice";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import drawPatternElement from "../../../../../lib/canvas/helpers/drawPatternElement";
import addRashToCanvas from "../../../../../lib/canvas/helpers/addRashToCanvas";
import { setSelectSynthElement } from "../../../../../redux/reducers/selectSynthElementSlice";
import onPatternElement from "../../../../../lib/canvas/helpers/onPatternElement";
import drawElement from "../../../../../lib/canvas/helpers/drawElement";
import createElement from "../../../../../lib/canvas/helpers/createElement";
import updateElement from "../../../../../lib/canvas/helpers/updateElement";
import { setInitImagePrompt } from "../../../../../redux/reducers/initImagePromptSlice";
import createCanvasInit from "../../../../../lib/canvas/helpers/getBoundingBox";

const usePatterns = (): UsePatternsResult => {
  const dispatch = useDispatch();
  const promptImage = useSelector(
    (state: RootState) => state.app.addPromptImageReducer.value
  );
  const synthElementSelect = useSelector(
    (state: RootState) => state.app.selectSynthElementReducer.value
  );
  const promptLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
  );
  const writingRef = useRef<HTMLTextAreaElement>(null);
  const canvasPatternRef = useRef<HTMLCanvasElement>(null);
  const canvas = (canvasPatternRef as MutableRefObject<HTMLCanvasElement>)
    ?.current;
  const ctx = canvas?.getContext("2d");
  const canvasType = useSelector(
    (state: RootState) => state.app.canvasTypeReducer.value
  );
  const [zoom, setZoom] = useState<number>(1);
  const [tool, setTool] = useState<string>("default");
  const [action, setAction] = useState<string>("none");
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
  const [patternType, setPatternType] = useState<string>("");
  const [template, setTemplate] = useState<string>("");
  const [switchType, setSwitchType] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<SvgPatternType | null>(
    null
  );
  const [synthElementMove, setSynthElementMove] =
    useState<SvgPatternType | null>();
  const [showPatternDrawOptions, setShowPatternDrawOptions] =
    useState<boolean>(false);
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [elements, setElements, undo, redo] = useElements([], true);

  const templateSwitch = async (template: string | undefined) => {
    if (patternType === "rash") {
      await addRashToCanvas(
        base[0],
        safe[0],
        temp[Number(template?.split("0x0")[1]) - 1],
        setElements
      );
    }
  };

  useEffect(() => {
    dispatch(setInitImagePrompt(undefined));
    dispatch(setCanvasType(switchType));
    if (switchType && template !== "") {
      setTool("synth");
      templateSwitch(template);
    } else if (!switchType) {
      setTool("default");
    } else if (ctx && switchType && template === "") {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [patternType, template, switchType]);

  useLayoutEffect(() => {
    if (ctx && canvasType) {
      canvas.width = canvas?.offsetWidth * devicePixelRatio;
      canvas.height = canvas?.offsetHeight * devicePixelRatio;
      ctx.clearRect(0, 0, canvas?.width, canvas?.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(zoom, zoom);
      ctx.translate(pan.xOffset * zoom, pan.yOffset * zoom);
      ctx.beginPath();
      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";
      elements?.forEach((element: SvgPatternType) => {
        if (action === "writing" && selectedElement?.id === element.id) {
          return;
        }
        if (
          element.type === "image" ||
          element.type === "0" ||
          element.type === "1" ||
          element.type === "2"
        ) {
          drawPatternElement(
            element,
            ctx,
            zoom,
            tool,
            synthElementMove!,
            synthElementSelect!,
            promptLoading
          );
        } else {
          drawElement(element, ctx, zoom, canvas);
        }
      });
    }
  }, [
    elements,
    synthElementMove,
    zoom,
    ctx,
    canvasType,
    pan,
    tool,
    action,
    synthElementSelect,
  ]);

  useEffect(() => {
    if (!showPatternDrawOptions) {
      setPatternType("");
    }
  }, [showPatternDrawOptions]);

  useEffect(() => {
    if (promptImage && canvasType) {
      addImageToCanvas(promptImage);
      dispatch(setAddPromptImage(undefined));
    }
  }, [promptImage]);

  const handleMouseMovePattern = (e: MouseEvent): void => {
    if (!action || action === "writing") return;
    const bounds = canvas?.getBoundingClientRect();
    if (action === "panning") {
      setPan({
        xInitial: pan.xInitial,
        yInitial: pan.yInitial,
        xOffset:
          pan.xOffset + 0.5 * ((e.clientX - bounds.left - pan.xInitial) / zoom),
        yOffset:
          pan.yOffset + 0.5 * ((e.clientY - bounds.top - pan.yInitial) / zoom),
      });
    } else if ((action === "synth" || action === "none") && !promptLoading) {
      const positionArray = onPatternElement(
        elements,
        zoom,
        pan,
        e,
        canvas,
        true
      );
      if (positionArray?.[0]) {
        setSynthElementMove(positionArray[0]);
      } else {
        setSynthElementMove(null);
      }
    } else if (action === "moving") {
      if (selectedElement?.type === "image") {
        const newElement = {
          clipElement: {
            ...selectedElement.clipElement,
            posX:
              selectedElement.clipElement?.posX! -
              (selectedElement.offsetX! -
                (e.clientX - bounds.left) * devicePixelRatio),
            posY:
              selectedElement.clipElement?.posY! -
              (selectedElement.offsetY! -
                (e.clientY - bounds.top) * devicePixelRatio),
          },
          width: selectedElement.width,
          height: selectedElement.height,
          image: selectedElement.image,
          id: selectedElement.id,
          type: selectedElement.type,
        };
        const updatedElements = elements?.map((element: SvgPatternType) =>
          element.id === selectedElement.id ? newElement : element
        );
        setElements(updatedElements, true);
      } else if (selectedElement?.type === "pencil") {
        const newPoints = selectedElement.points?.map(
          (_: any, index: number) => ({
            x:
              ((e.clientX - pan.xOffset * zoom * zoom * 0.5) / zoom) *
                devicePixelRatio -
              selectedElement?.offsetXs!?.[index],
            y:
              ((e.clientY - pan.yOffset * zoom * zoom * 0.5) / zoom) *
                devicePixelRatio -
              selectedElement?.offsetYs!?.[index],
          })
        );
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const textWidth = ctx?.measureText(selectedElement?.text!).width!;
        const newElement = {
          ...selectedElement,
          x1:
            ((e.clientX - bounds.left - pan.xOffset * 0.5 * zoom * zoom) *
              devicePixelRatio) /
            zoom,
          y1:
            ((e.clientY - bounds.top - pan.yOffset * 0.5 * zoom * zoom) *
              devicePixelRatio) /
            zoom,
          x2:
            ((e.clientX - bounds.left - pan.xOffset * 0.5 * zoom * zoom) *
              devicePixelRatio) /
              zoom +
            textWidth * zoom,
          y2:
            ((e.clientY - bounds.top - pan.yOffset * 0.5 * zoom * zoom) *
              devicePixelRatio) /
              zoom +
            selectedElement?.strokeWidth! * zoom,
        };
        const updatedElements = elements?.map((element: SvgPatternType) =>
          element.id === selectedElement?.id ? newElement : element
        );
        setElements(updatedElements, true);
      }
    } else if (action === "resizing" && selectedElement) {
      if (selectedElement.type === "image") {
        const newElement = {
          clipElement: selectedElement.clipElement,
          image: selectedElement.image,
          width:
            selectedElement.width! +
            (selectedElement.offsetX! -
              (e.clientX - bounds.left) * devicePixelRatio),
          height:
            selectedElement.height! +
            (selectedElement.width! / selectedElement.height!) *
              (selectedElement.offsetX! -
                (e.clientX - bounds.left) * devicePixelRatio),
          id: selectedElement.id,
          type: selectedElement.type,
        };
        const updatedElements = elements?.map((element: SvgPatternType) =>
          element.id === selectedElement.id ? newElement : element
        );
        setElements(updatedElements, true);
      }
    } else if (action === "drawing") {
      const index = elements?.length - 1;
      const values = elements?.[index];
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        elements,
        setElements,
        ctx!,
        values?.x1!,
        values?.y1!,
        e.clientX,
        e.clientY,
        tool,
        index,
        brushWidth,
        hex,
        null,
        hex
      );
    }
  };

  const handleMouseDownPattern = (e: MouseEvent): void => {
    const bounds = canvas?.getBoundingClientRect();
    if (tool === "pan") {
      setPan({
        xInitial: e.clientX - bounds.left,
        yInitial: e.clientY - bounds.top,
        xOffset: pan.xOffset,
        yOffset: pan.yOffset,
      });
      setAction("panning");
    } else if (tool === "synth" && !promptLoading) {
      setAction("synth");
      if (synthElementMove) {
        dispatch(setSelectSynthElement(synthElementMove));
        dispatch(
          setInitImagePrompt(
            createCanvasInit(synthElementMove, canvasPatternRef, canvas)
          )
        );
      }
    } else if (tool === "default") {
      setAction("none");
    } else if (tool === "erase" || tool === "selection" || tool == "resize") {
      const positionArray = onPatternElement(
        elements,
        zoom,
        pan,
        e,
        canvas,
        false
      );

      if (positionArray?.[0]) {
        const elementsCopy = [...elements];

        if (tool === "erase") {
          if (
            positionArray[0]?.type === "pencil" ||
            positionArray[0]?.type === "text"
          ) {
            elementsCopy[positionArray[0].id] = {
              ...elementsCopy[positionArray[0].id],
              fill: "#078FD6",
              stroke: "#078FD6",
            };
            setElements(elementsCopy);
          }
          setSelectedElement(positionArray[0]);
        } else {
          if (positionArray[0]?.type === "pencil") {
            const offsetXs = positionArray[0]?.points?.map(
              (point) =>
                ((e.clientX - pan.xOffset * zoom * zoom * 0.5) *
                  devicePixelRatio) /
                  zoom -
                point.x
            );
            const offsetYs = positionArray[0]?.points?.map(
              (point) =>
                ((e.clientY - pan.yOffset * zoom * zoom * 0.5) *
                  devicePixelRatio) /
                  zoom -
                point.y
            );
            setSelectedElement({
              ...positionArray[0],
              offsetXs: offsetXs!,
              offsetYs: offsetYs!,
            });
          } else {
            setSelectedElement({
              ...positionArray[0],
              offsetX: (e.clientX - bounds.left) * devicePixelRatio,
              offsetY: (e.clientY - bounds.top) * devicePixelRatio,
            });
          }

          if (tool === "selection") {
            setAction("moving");
          } else if (tool === "resize") {
            setAction("resizing");
          }
        }
      }
    } else if (tool === "pencil" || tool === "text") {
      const newElement = createElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        e.clientX,
        e.clientY,
        e.clientX,
        e.clientY,
        tool,
        elements.length,
        brushWidth,
        hex,
        hex
      );
      setAction(tool === "pencil" ? "drawing" : "writing");
      setSelectedElement(newElement!);
      setElements([...elements, newElement]);
    }
  };

  const handleMouseUpPattern = (e: MouseEvent) => {
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        e.clientX - selectedElement?.offsetX! === selectedElement.x1 &&
        e.clientY - selectedElement?.offsetY! === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
      if (tool === "erase") {
        const filteredElements = lodash.filter(
          elements,
          (element) => element.id !== selectedElement.id
        );
        const updatedElements = filteredElements.map((element, index) => ({
          ...element,
          id: index,
        }));
        setElements(updatedElements);
      }
    }
    if (action === "writing") return;
    setAction("none");
    setSelectedElement(null);
  };

  const handleWheelPattern = (e: WheelEvent) => {
    wheelLogic(e, zoom, setZoom, 7);
  };

  const addImageToCanvas = async (imgURL: string): Promise<void> => {
    try {
      const res: Response = await fetch(imgURL);
      const blob: Blob = await res.blob();
      const postImage = new File([blob], "thedial_drafts", {
        type: "image/png",
      });
      await handleImageAdd(postImage);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleImageAdd = async (e: any): Promise<void> => {
    const compressedImage = await compressImageFiles(e);
    const reader = new FileReader();
    reader?.readAsDataURL(compressedImage as File);

    reader.onloadend = (e) => {
      const imageObject = new Image();
      imageObject.src = e.target?.result as string;
      imageObject.onload = () => {
        const matchedIndex = elements.findIndex(
          (element: SvgPatternType) =>
            element.points === synthElementSelect?.points
        );

        setElements((prevElements: SvgPatternType[]) => {
          const newElement = {
            clipElement: synthElementSelect,
            image: imageObject,
            type: "image",
            width: imageObject.width,
            height: imageObject.height,
          };
          const newElements = [
            ...prevElements.slice(0, matchedIndex + 1),
            newElement,
            ...prevElements.slice(
              prevElements[matchedIndex + 1].type === "image"
                ? matchedIndex + 2
                : matchedIndex + 1
            ),
          ];
          return newElements.map((element, index) => ({
            ...element,
            id: index,
          }));
        });

        dispatch(setSelectSynthElement(undefined));
        setSynthElementMove(undefined);
      };
    };
  };

  const handlePatternClear = () => {
    setClear(true);
  };

  const handlePatternSave = () => {
    const img = canvas.toDataURL("image/png");
    let xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = "pattern_aop_template.png";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open("GET", img);
    xhr.send();
  };

  useEffect(() => {
    const textAreaElement = writingRef.current;
    if (action === "writing") {
      textAreaElement?.focus();
      (textAreaElement as HTMLTextAreaElement).value = selectedElement?.text!;
    }
  }, [tool, action, selectedElement]);

  useLayoutEffect(() => {
    if (clear) {
      const newElements = lodash.filter(elements, (element: SvgPatternType) => {
        if (
          element.type === "0" ||
          element.type === "1" ||
          element.type === "2"
        ) {
          return true;
        }
      });
      setElements(newElements);
      setClear(false);
    }
  }, [clear]);

  const handleBlur = (e: FormEvent) => {
    if ((e as any).key === "Enter") {
      const bounds = canvas?.getBoundingClientRect();
      setAction("none");
      setSelectedElement(null);
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        elements,
        setElements,
        ctx!,
        (selectedElement?.x1! * devicePixelRatio +
          bounds.left * zoom -
          pan.xOffset * zoom * zoom) /
          zoom,
        (selectedElement?.y1! * devicePixelRatio +
          bounds.top * zoom -
          pan.yOffset * zoom * zoom) /
          zoom,
        selectedElement?.x2!,
        selectedElement?.y2!,
        tool,
        selectedElement?.id!,
        brushWidth,
        hex,
        null,
        null,
        (e.target as HTMLFormElement)?.value
      );
    }
  };

  return {
    template,
    patternType,
    setPatternType,
    setTemplate,
    setShowPatternDrawOptions,
    showPatternDrawOptions,
    setSwitchType,
    switchType,
    handleMouseDownPattern,
    handleMouseMovePattern,
    handleWheelPattern,
    canvasPatternRef,
    zoom,
    setZoom,
    setPan,
    action,
    tool,
    setTool,
    handleMouseUpPattern,
    handlePatternClear,
    handlePatternSave,
    hex,
    setHex,
    colorPicker,
    setColorPicker,
    thickness,
    setThickness,
    brushWidth,
    setBrushWidth,
    undo,
    redo,
    writingRef,
    handleBlur,
    selectedElement,
    addImageToCanvas,
  };
};

export default usePatterns;
