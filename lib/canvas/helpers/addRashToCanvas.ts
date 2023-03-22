import {
  SafeImage,
  SvgPatternType,
  TemplateTypes,
} from "../../../components/Home/Layout/Canvas/types/canvas.types";
import convertSvgToPath from "./convertSvgToPath";

const addRashToCanvas = async (
  setElements: (e: any) => void,
  local: SvgPatternType[],
  imageBase?: SafeImage[],
  imageSafe?: SafeImage[],
  imageTemp?: SafeImage[]
) => {
  try {
    let elementsArray: SvgPatternType[] = [];
    if (imageBase) {
      for (const image in imageBase) {
        const newElement = await convertSvgToPath(
          imageBase[image].image,
          imageBase[image].scale
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
          imageSafe[image].scale
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
          imageTemp[image].scale
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

    if (local.length > 0) {
      const images = local.filter((elem: any) => elem.type === "image")
      .sort((a: any, b: any) => a.id - b.id)
      .map((elem: any) => {
        const img = new Image();
        img.src = elem.image;
        return img;
      });

      const newElementsArray = local.reduce((acc: any[], elem: any) => {
        if (elem.type === "image") {
          const imageIndex = images.findIndex((img: HTMLImageElement) => img.src === elem.image);
          acc.splice(elem.id, 0, { ...elem, image: images[imageIndex] });
        } else {
          acc.push(elem);
        }
        return acc;
      }, elementsArray);
    
      const updatedElementsArray = newElementsArray.map((elem: any, index: number) => ({
        ...elem,
        id: index,
        index
      }));
      setElements(updatedElementsArray);
    } else {
      setElements([...elementsArray]);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default addRashToCanvas;
