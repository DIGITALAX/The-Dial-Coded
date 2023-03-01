import {
  SafeImage,
  SvgPatternType,
  TemplateTypes,
} from "../../../components/Home/Layout/Canvas/types/canvas.types";
import convertSvgToPath from "./convertSvgToPath";

const addRashToCanvas = async (
  setElements: (e: any) => void,
  imageBase?: SafeImage[],
  imageSafe?: SafeImage[],
  imageTemp?: SafeImage[]
) => {
  try {
    let elementsArray: SvgPatternType[] = [];
    console.log(imageBase);
    if (imageBase) {
      for (const image in imageBase) {
        const newElement = await convertSvgToPath(
          imageBase[image].image,
          imageBase[image].scale,
        );
        elementsArray.push({
          id: elementsArray?.length,
          points: newElement.map((point) => ({
            x: (point.x + imageBase[image].x) * devicePixelRatio,
            y: (point.y + imageBase[image].y) * devicePixelRatio,
          })),
          type: String(TemplateTypes.Base),
          posX: imageBase[image].x,
          posY: imageBase[image].y,
          stroke: imageBase[image].stroke,
        });
      }
    }

    if (imageSafe) {
      for (const image in imageSafe) {
        const newElement = await convertSvgToPath(
          imageSafe[image].image,
          imageSafe[image].scale,
        );
        elementsArray.push({
          id: elementsArray?.length,
          points: newElement.map((point) => ({
            x: (point.x + imageSafe[image].x) * devicePixelRatio,
            y: (point.y + imageSafe[image].y) * devicePixelRatio,
          })),
          type: String(TemplateTypes.Safe),
          posX: imageSafe[image].x,
          posY: imageSafe[image].y,
          stroke: imageSafe[image].stroke,
        });
      }
    }

    if (imageTemp) {
      for (const image in imageTemp) {
        const newElement = await convertSvgToPath(
          imageTemp[image].image,
          imageTemp[image].scale,
        );
        elementsArray.push({
          id: elementsArray?.length,
          points: newElement.map((point) => ({
            x: (point.x + imageTemp[image].x) * devicePixelRatio,
            y: (point.y + imageTemp[image].y) * devicePixelRatio,
          })),
          type: String(TemplateTypes.Temp),
          posX: imageTemp[image].x,
          posY: imageTemp[image].y,
          stroke: imageTemp[image].stroke,
        });
      }
    }

    setElements(elementsArray);
  } catch (err: any) {
    console.error(err.message);
  }
};

export default addRashToCanvas;
