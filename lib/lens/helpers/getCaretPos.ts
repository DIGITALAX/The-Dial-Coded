import { RefObject } from "react";
import getCaretCoordinates from "textarea-caret";

const getCaretPos = (
  e: any,
  textElement: RefObject<HTMLTextAreaElement>
): { x: number; y: number } => {
  const caret = getCaretCoordinates(e.target, e.target.selectionEnd);
  return {
    x:
      caret.left > (2 / 3) * (textElement.current?.clientWidth as number)
        ? caret.left - 150
        : caret.left,
    y:
      (textElement.current?.scrollHeight as number) >
      (textElement.current?.clientHeight as number)
        ? -30
        : caret.top,
  };
};

export default getCaretPos;
