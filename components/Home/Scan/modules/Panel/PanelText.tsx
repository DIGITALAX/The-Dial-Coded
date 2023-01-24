import { FunctionComponent } from "react";
import { PanelTextProps } from "./types/search.types";

const PanelText: FunctionComponent<PanelTextProps> = ({ text }) => {
  return (
    <div className="relative w-fit h-fit row-start-2 md:row-start-1 col-start-1 md:col-start-2 grid grid-flow-col auto-cols-auto justify-self-start md:justify-self-end self-center text-black text-xl font-dosis text-right md:pr-10">
      {text}
    </div>
  );
};

export default PanelText;
