import { FunctionComponent } from "react";
import { PanelProps } from "../types/common.types";

const Panel: FunctionComponent<PanelProps> = ({col}): JSX.Element => {
  return (
    <div className={`relative w-full h-16 col-start-${col} border-4 border-black bg-comp grid grid-flow-col auto-cols-auto grow`}>
      <div className="relative col-start-1 w-full h-2 bg-white"></div>
    </div>
  );
};

export default Panel;
