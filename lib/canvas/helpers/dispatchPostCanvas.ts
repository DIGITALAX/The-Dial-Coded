import { FormEvent } from "react";
import getCanvas from "./getCanvas";

const dispatchPostCanvas = async (
  canvas: HTMLCanvasElement,
  elements: any,
  uploadImage: (e: FormEvent | File, canvas?: boolean) => Promise<void>
): Promise<void> => {
  const imgURL = getCanvas(canvas, elements);
  const res: Response = await fetch(imgURL);
  const blob: Blob = await res.blob();
  const postImage = new File([blob], "thedial_drafts", { type: "image/png" });
  await uploadImage(postImage, true);
};

export default dispatchPostCanvas;
