import { FunctionComponent } from "react";

const Canvas: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white p-10">
      <div className="relative col-start-1 w-full h-[80vw] bg-gradient-to-r from-offBlack via-black/70 to-offBlack rounded-lg grid grid-flow-col auto-cols-auto p-24">
        <div className="relative w-full h-full bg-white col-start-1 rounded-lg grid grid-flow-col auto-cols-auto">
          <div className="relative w-fit h-fit place-self-center col-start-1 font-dosis tex-black text-lg">
            Canvas coming soon.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
