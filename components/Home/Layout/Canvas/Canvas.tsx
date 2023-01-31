import { FunctionComponent } from "react";
import Interface from "../../../Common/Interface/Interface";

const Canvas: FunctionComponent = (): JSX.Element => {

  return (
    <div className="relative w-full h-full row-start-2 bg-shame grid grid-flow-col auto-cols-auto">
      <Interface />
    </div>
  );
};

export default Canvas;
