import { FunctionComponent } from "react";
import { LineProps } from "../types/common.types";

const Line: FunctionComponent<LineProps> = ({ col, width }): JSX.Element => {
  return (
    <div
      className={`relative w-${width} h-full col-start-${col} grid grid-flow-row auto-rows-auto gap-2 place-self-center`}
    >
      <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-1 place-self-center"></div>
      <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-2 place-self-center"></div>
      <div className="relative w-full h-2 bg-white border-b-2 border-dcomp row-start-3 place-self-center"></div>
    </div>
  );
};

export default Line;
