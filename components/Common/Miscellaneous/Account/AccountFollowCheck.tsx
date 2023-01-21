import { current } from "@reduxjs/toolkit";
import { FunctionComponent } from "react";
import { AccountFollowCheckProps } from "../../types/common.types";

const AccountFollowCheck: FunctionComponent<AccountFollowCheckProps> = ({
  handleClicked,
  valueClicked,
  label,
  row,
  col,
  currentValue,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-1 row-start-${row} col-start-${col}`}
    >
      <div className="relative row-start-1 w-fit h-fit text-sm text-offBlack font-dosis self-center justify-self-start">
        {label}
      </div>
      <div
        onClick={() => handleClicked(valueClicked)}
        id="crt"
        className="relative w-8 h-8 p-0.5 rounded-md grid grid-flow-col auto-cols-auto cursor-pointer row-start-2 justify-self-start self-center"
      >
        <div
          className={`relative w-full h-full grid grid-flow-row auto-rows-auto rounded-md p-1 col-start-1 ${
            valueClicked === currentValue ? "bg-offBlue" : "bg-white"
          }`}
        >
          <div className="relative h-px w-full bg-offBlack/80 row-start-2 rounded-md justify-self-center self-end"></div>
        </div>
      </div>
    </div>
  );
};

export default AccountFollowCheck;
