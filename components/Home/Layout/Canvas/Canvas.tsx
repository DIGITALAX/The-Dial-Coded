import { FunctionComponent } from "react";

const Canvas: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white pt-10">
      <div className="relative col-start-1 w-[95%] h-[80vw] bg-gradient-to-r from-offBlack via-black/70 to-offBlack rounded-lg grid grid-flow-col auto-cols-auto p-24 row-start-1 place-self-center">
        <div id="canvas" className="relative w-full h-full col-start-1 rounded-lg grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full bg-white/90">

          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
