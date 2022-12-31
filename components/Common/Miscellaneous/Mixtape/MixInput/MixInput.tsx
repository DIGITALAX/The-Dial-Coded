import { FormEvent, FunctionComponent } from "react";
import { MixInputProps } from "../../../types/common.types";

const MixInput: FunctionComponent<MixInputProps> = ({
  col,
  name,
  title,
  handleChange,
  value,
  loader,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit gap-2 grid grid-flow-row auto-rows-auto col-start-${col}`}
    >
      <div className="relative w-fit h-fit row-start-1 font-digiB text-black text-xl">
        {title}
      </div>
      <div
        id="crt"
        className="relative w-7/8 h-full row-start-2 p-0.5 rounded-md grid grid-flow-col auto-cols-auto"
      >
        <div className="relative w-full h-full bg-white grid grid-flow-row auto-rows-auto rounded-md p-1 col-start-1">
          <input
            name={name}
            value={value}
            className="relative w-full h-full p-2 text-black font-dosis rounded-md row-start-1 caret-transparent"
            onChange={(e: FormEvent) => handleChange(e)}
            disabled={loader ? true : false}
          />
          <div className="relative h-1 w-full bg-offBlack/80 row-start-2 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default MixInput;
