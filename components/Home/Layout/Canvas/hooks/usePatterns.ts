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
import onLine from "../../../../../lib/canvas/helpers/onLine";
import lodash from "lodash";
import wheelLogic from "../../../../../lib/canvas/helpers/wheelLogic";
import { setAddPromptImage } from "../../../../../redux/reducers/addPromptImageSlice";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import drawPatternElement from "../../../../../lib/canvas/helpers/drawPatternElement";
import addRashToCanvas from "../../../../../lib/canvas/helpers/addRashToCanvas";

const usePatterns = (): UsePatternsResult => {
  const dispatch = useDispatch();
  const promptImage = useSelector(
    (state: RootState) => state.app.addPromptImageReducer.value
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
  const [synthElementMove, setSynthElementMove] = useState<SvgPatternType>();
  const [synthElementSelect, setSynthElementSelect] =
    useState<SvgPatternType>();
  const [showPatternDrawOptions, setShowPatternDrawOptions] =
    useState<boolean>(false);
  const [elements, setElements, undo, redo] = useElements([]);

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
      elements?.forEach((element: any) => {
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

  const promptImageResize = (element: any) => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    synthElementSelect?.points.forEach((point: any) => {
      if (point.x < minX) {
        minX = point.x;
      }
      if (point.x > maxX) {
        maxX = point.x;
      }
      if (point.y < minY) {
        minY = point.y;
      }
      if (point.y > maxY) {
        maxY = point.y;
      }
    });

    const width = maxX - minX;
    const height = maxY - minY;

    const imageAspectRatio = element.image.width / element.image.height;
    const pathAspectRatio = width / height;
    let destWidth, destHeight, destX, destY;

    if (imageAspectRatio >= pathAspectRatio) {
      // image is wider than path
      destWidth = width;
      destHeight = width / imageAspectRatio;
      destX = minX;
      destY = minY + (height - destHeight) / 2;
    } else {
      // path is taller than image
      destWidth = height * imageAspectRatio;
      destHeight = height;
      destX = minX + (width - destWidth) / 2;
      destY = minY;
    }

    return { destX, destY, destWidth, destHeight };
  };

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
      let positionArray: SvgPatternType[] = [];
      lodash.filter(elements, (element: SvgPatternType) => {
        const returned = element.points?.some((point, index) => {
          const nextPoint: any = (
            element.points as {
              x: number;
              y: number;
            }[]
          )[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(
              (point.x + element.posX - pan.xOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
              (point.y + element.posY - pan.yOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
              (nextPoint.x + element.posX - pan.xOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
              (nextPoint.y + element.posY - pan.yOffset * 0.5 * zoom) *
                devicePixelRatio *
                zoom,
              ((e.clientX - bounds?.left) * devicePixelRatio) / zoom,
              ((e.clientY - bounds?.top) * devicePixelRatio) / zoom,
              2
            ) != null
          );
        });
        if (returned) {
          positionArray.push({ ...element });
        }
      });
      if (positionArray[0]) {
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
        setSynthElementSelect(synthElementMove);
      }
    } else if (tool === "default") {
      setAction("none");
    }
  };

  const handleMouseUpPattern = (e: MouseEvent) => {
    setAction("none");
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
        setElements([
          ...elements,
          {
            clipElement: synthElementSelect,
            image: imageObject,
            type: "image",
          },
        ]);
      };
    };
  };

  const handlePatternClear = () => {};

  const handlePatternSave = () => {};

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
  };
};

export default usePatterns;
