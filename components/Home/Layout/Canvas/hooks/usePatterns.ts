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
  const [patternType, setPatternType] = useState<string>("");
  const [template, setTemplate] = useState<string>("");
  const [switchType, setSwitchType] = useState<boolean>(false);
  const [synthElement, setSynthElement] = useState<SvgPatternType>();
  const [showPatternDrawOptions, setShowPatternDrawOptions] =
    useState<boolean>(false);
  const [synthArea, setSynthArea] = useState<boolean>(false);
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
      setSynthArea(true);
      templateSwitch(template);
    } else if (!switchType) {
      setSynthArea(false);
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

        if (element.points === synthElement?.points) {
          ctx.strokeStyle = "red";
        } else {
          ctx.strokeStyle = element.stroke;
        }
        ctx.beginPath();
        ctx.moveTo(
          (element.points[0].x + element.posX) * zoom * devicePixelRatio,
          (element.points[0].y + element.posY) * zoom * devicePixelRatio
        );
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(
            (element.points[i].x + element.posX) * zoom * devicePixelRatio,
            (element.points[i].y + element.posY) * zoom * devicePixelRatio
          );
        }
        ctx.stroke();
        ctx.closePath();
      });
      ctx.save();
    }
  }, [elements, synthElement, zoom, ctx, canvasType]);

  useEffect(() => {
    if (!showPatternDrawOptions) {
      setPatternType("");
    }
  }, [showPatternDrawOptions]);

  const handleMouseMovePattern = (e: MouseEvent): void => {
    // if (synthArea) {
    //   const bounds = canvas?.getBoundingClientRect();
    //   let positionArray: SvgPatternType[] = [];
    //   lodash.filter(elements, (element: SvgPatternType) => {
    //     const returned = element.points?.some((point, index) => {
    //       const nextPoint: any = (
    //         element.points as {
    //           x: number;
    //           y: number;
    //         }[]
    //       )[index + 1];
    //       if (!nextPoint) return false;
    //       return (
    //         onLine(
    //           point.x,
    //           point.y,
    //           nextPoint.x,
    //           nextPoint.y,
    //           e.clientX - bounds?.left,
    //           e.clientY - bounds?.top,
    //           2
    //         ) != null
    //       );
    //     });
    //     if (returned) {
    //       positionArray.push({ ...element });
    //     }
    //   });
    //   if (positionArray[0]) {
    //     setSynthElement(positionArray[0]);
    //   } else {
    //     setSynthElement(undefined);
    //   }
    // }
  };

  const handleMouseDownPattern = (e: MouseEvent): void => {
    const bounds = canvas.getBoundingClientRect();
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
    setSynthArea,
    synthArea,
    handleMouseDownPattern,
    handleMouseMovePattern,
    handleWheelPattern,
    canvasPatternRef,
    zoom,
    setZoom,
  };
};

export default usePatterns;
