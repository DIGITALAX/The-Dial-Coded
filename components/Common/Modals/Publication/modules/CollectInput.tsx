import { FormEvent, FunctionComponent } from "react";
import { CollectInputProps } from "../../../types/common.types";

const CollectInput: FunctionComponent<CollectInputProps> = ({
  id,
  name,
  step,
  min,
  max,
  placeholder,
  defaultValue,
  col,
  row,
  label,
  valueChange,
  handleValueChange,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit grid grid-flow-row auto-rows-auto row-start-${row} col-start-${col} text-black font-dosis text-xs justify-self-start gap-3 self-start`}
    >
      <div className="relative w-fit h-fit row-start-1 font-dosis text-black text-sm whitespace-nowrap justify-self-start self-center text-left">
        {label}
      </div>
      <input
        type="number"
        id={id}
        name={name}
        min={min}
        required
        step={step}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="relative w-20 h-10 bg-offBlue row-start-2 rounded-md p-1.5 text-white font-dosis justify-self-start self-center"
        onChange={(e: FormEvent) =>
          handleValueChange((e.target as HTMLFormElement)?.value)
        }
      />
    </div>
  );
};

export default CollectInput;
