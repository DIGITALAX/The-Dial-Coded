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
import {
  SafeImage,
  UsePatternsResult,
  SvgPatternType,
  TemplateTypes,
} from "../types/canvas.types";
import base from "./../../../../../pages/api/constants/base.json";
import safe from "./../../../../../pages/api/constants/safe.json";
import temp from "./../../../../../pages/api/constants/temp.json";
import useElements from "./useElements";
import { RootState } from "../../../../../redux/store";
import convertSvgToPath from "../../../../../lib/canvas/helpers/convertSvgToPath";
import onLine from "../../../../../lib/canvas/helpers/onLine";
import lodash from "lodash";
import wheelLogic from "../../../../../lib/canvas/helpers/wheelLogic";

const usePatterns = (): UsePatternsResult => {
  const dispatch = useDispatch();
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
        temp[Number(template?.split("0x0")[1]) - 1]
      );
    }
  };

  const addRashToCanvas = async (
    imageBase: SafeImage[],
    imageSafe: SafeImage[],
    imageTemp: SafeImage[]
  ) => {
    try {
      let elementsArray: {}[] = [];
      for (const image in imageBase) {
        const newElement = await convertSvgToPath(
          imageBase[image].image,
          imageBase[image].scale
        );
        elementsArray.push({
          points: newElement,
          type: TemplateTypes.Base,
          posX: imageBase[image].x,
          posY: imageBase[image].y,
          stroke: imageBase[image].stroke,
        });
      }

      for (const image in imageSafe) {
        const newElement = await convertSvgToPath(
          imageSafe[image].image,
          imageSafe[image].scale
        );
        elementsArray.push({
          points: newElement,
          type: TemplateTypes.Safe,
          posX: imageSafe[image].x,
          posY: imageSafe[image].y,
          stroke: imageSafe[image].stroke,
        });
      }

      for (const image in imageTemp) {
        const newElement = await convertSvgToPath(
          imageTemp[image].image,
          imageTemp[image].scale
        );
        elementsArray.push({
          points: newElement,
          type: TemplateTypes.Temp,
          posX: imageTemp[image].x,
          posY: imageTemp[image].y,
          stroke: imageTemp[image].stroke,
        });
      }
      setElements(elementsArray);
    } catch (err: any) {
      console.error(err.message);
    }
  };

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
        ctx?.setLineDash(element?.type !== 0 ? [5, 5] : [0]);
        ctx.lineWidth = 3 * zoom;

        if (element.points === synthElementMove?.points) {
          ctx.strokeStyle = "#f1d2ef";
        } else if (element.points === synthElementSelect?.points) {
          ctx.strokeStyle = "#aeeccf";
        } else {
          ctx.strokeStyle = element.stroke;
        }

        ctx.beginPath();
        ctx.moveTo(
          (element.points[0].x + element.posX - pan.xOffset * 0.5 * zoom) *
            zoom *
            devicePixelRatio,
          (element.points[0].y + element.posY - pan.yOffset * 0.5 * zoom) *
            zoom *
            devicePixelRatio
        );
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(
            (element.points[i].x + element.posX - pan.xOffset * 0.5 * zoom) *
              zoom *
              devicePixelRatio,
            (element.points[i].y + element.posY - pan.yOffset * 0.5 * zoom) *
              zoom *
              devicePixelRatio
          );
        }
        ctx.stroke();
        ctx.closePath();
      });
      ctx.save();
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
              (point.x + element.posX) * devicePixelRatio * zoom,
              (point.y + element.posY) * devicePixelRatio * zoom,
              (nextPoint.x + element.posX) * devicePixelRatio * zoom,
              (nextPoint.y + element.posY) * devicePixelRatio * zoom,
              (e.clientX - bounds?.left) * devicePixelRatio / zoom,
              (e.clientY - bounds?.top) * devicePixelRatio / zoom,
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
  };
};

export default usePatterns;
