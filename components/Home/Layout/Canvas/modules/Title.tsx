import { FormEvent, FunctionComponent } from "react";
import { TitleProps } from "../types/canvas.types";

const Title: FunctionComponent<TitleProps> = ({
  title,
  handleTitle,
}): JSX.Element => {
  return (
    <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto self-start justify-self-center z-10">
      <input
        className="relative w-fit h-fit col-start-1 place-self-center bg-transparent p-1.5 text-white text-base font-dosis"
        value={title}
        type="text"
        onChange={(e: FormEvent) => handleTitle(e)}
      />
    </div>
  );
};

export default Title;
