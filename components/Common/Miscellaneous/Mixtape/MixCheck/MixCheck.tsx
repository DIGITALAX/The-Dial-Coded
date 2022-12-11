import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { MixCheckProps } from "../../../types/common.types";

const MixCheck: FunctionComponent<MixCheckProps> = ({
  value,
  handleClicked,
  valueClicked,
}): JSX.Element => {
  const checkedValue = useSelector(
    (state: RootState) => state.app.mixtapeCheckReducer.value
  );
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto gap-1 pl-3 pb-3">
      <div className="relative w-fit h-fit font-digiR text-black col-start-1 justify-self-end self-center">
        {value}
      </div>
      <div
        onClick={() => handleClicked(valueClicked, value)}
        id="crt"
        className="relative w-8 h-8 p-0.5 rounded-md grid grid-flow-col auto-cols-auto cursor-pointer col-start-2 justify-self-end"
      >
        <div
          className={`relative w-full h-full grid grid-flow-row auto-rows-auto rounded-md p-1 col-start-1 ${
            value === checkedValue ? "bg-offBlue" : "bg-white"
          }`}
        >
          <div className="relative h-px w-full bg-offBlack/80 row-start-2 rounded-md justify-self-center self-end"></div>
        </div>
      </div>
    </div>
  );
};

export default MixCheck;
