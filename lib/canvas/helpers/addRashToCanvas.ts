import {
  SafeImage,
  TemplateTypes,
} from "../../../components/Home/Layout/Canvas/types/canvas.types";
import convertSvgToPath from "./convertSvgToPath";

const addRashToCanvas = async (
  imageBase: SafeImage[],
  imageSafe: SafeImage[],
  imageTemp: SafeImage[],
  setElements: (e: any) => void
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
        type: String(TemplateTypes.Base),
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
        type: String(TemplateTypes.Safe),
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
        type: String(TemplateTypes.Temp),
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

export default addRashToCanvas;
