import {
  useEffect,
  useLayoutEffect,
  useState,
  MouseEvent,
  WheelEvent,
  useRef,
  MutableRefObject,
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

const usePatterns = (): UsePatternsResult => {
  const dispatch = useDispatch();
  const promptImage = useSelector(
    (state: RootState) => state.app.addPromptImageReducer.value
  );
  const synthElementSelect = useSelector(
    (state: RootState) => state.app.selectSynthElementReducer.value
  );
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
  const [eraseElement, setEraseElement] = useState<SvgPatternType>();
  const [synthElementMove, setSynthElementMove] = useState<SvgPatternType>();
  const [showPatternDrawOptions, setShowPatternDrawOptions] =
    useState<boolean>(false);
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [thickness, setThickness] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [elements, setElements, undo, redo] = useElements([], true);

  console.log(tool)

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

  console.log({ elements });

  useEffect(() => {
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

      ctx.beginPath();
      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";
      elements?.forEach((element: SvgPatternType) => {
        drawPatternElement(
          element,
          ctx,
          zoom,
          pan,
          tool,
          synthElementMove,
          synthElementSelect
        );
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
    if (!action) return;
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
    } else if (action === "synth" || action === "none") {
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
        setSynthElementMove(undefined);
      }
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
    } else if (tool === "synth") {
      setAction("synth");
      if (synthElementMove) {
        dispatch(setSelectSynthElement(synthElementMove));
      }
    } else if (tool === "default") {
      setAction("none");
    } else if (tool === "erase") {
      const positionArray = onPatternElement(
        elements,
        zoom,
        pan,
        e,
        canvas,
        false
      );
      if (positionArray?.[0]) {
        setEraseElement(positionArray[0]);
      }
    }
  };

  const handleMouseUpPattern = (e: MouseEvent) => {
    setAction("none");
    if (tool === "erase") {
      if (eraseElement) {
        const filteredElements = lodash.filter(
          elements,
          (element) => element !== eraseElement
        );
        setElements(filteredElements);
      }
    }
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
        setElements([
          ...elements.slice(0, matchedIndex + 1),
          {
            clipElement: synthElementSelect,
            image: imageObject,
            type: "image",
          },
          ...elements.slice(matchedIndex + 1),
        ]);
        dispatch(setSelectSynthElement(undefined));
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
  };
};

export default usePatterns;
