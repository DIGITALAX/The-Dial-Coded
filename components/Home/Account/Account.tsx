import { FunctionComponent } from "react";

const Account: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white p-10">
      <div className="relative col-start-1 w-full h-[80vw] bg-gradient-to-r from-offBlack via-black/70 to-offBlack rounded-lg grid grid-flow-col auto-cols-auto pt-4 px-4 pb-10">
        <div className="relative w-24 h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 justify-self-start self-center col-span-1">
          <div className="relative row-start-1 place-self-start w-fit h-fit grid grid-flow-row auto-rows-auto gap-6">
            <div className="relative row-start-1 place-self-start h-8 w-8 rounded-md border-black border-2 bg-white"></div>
            <div className="relative row-start-2 place-self-start h-8 w-8 rounded-md border-black border-2 bg-white"></div>
          </div>
          <div className="relative row-start-2 justify-self-start self-end h-8 w-8 rounded-md border-black border-2 bg-white"></div>
        </div>
        <div className="relative w-full h-full col-start-2 rounded-md grid grid-flow-row auto-rows-auto place-self-center">
          <div className="relative row-start-1 w-full h-24 grid grid-flow-col auto-cols-auto self-start justify-self-center"></div>
          <div className="relative row-start-2 bg-white w-full h-full rounded-lg p-1">
            <div className="relative w-full h-full bg-comp p-4 grid grid-flow-row auto-rows-auto">
              <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto">
                <div className="relative w-fit h-fit ">

                </div>

              </div>
              <div className="relative w-full h-full row-start-2">

              </div>

            </div>
          </div>
          <div className="relative row-start-3 w-full h-24 grid grid-flow-col auto-cols-auto self-end justify-self-center"></div>
        </div>
        <div className="relative w-24 h-full col-start-3 grid grid-flow-row auto-rows-auto gap-8 justify-self-end self-center col-span-1">
          <div className="relative row-start-1 justify-self-end self-start h-8 w-8 rounded-md border-black border-2 bg-white"></div>
          <div className="relative row-start-2 place-self-end w-fit h-fit grid grid-flow-row auto-rows-auto gap-6">
            <div className="relative row-start-1 place-self-start h-8 w-8 rounded-md border-black border-2 bg-white"></div>
            <div className="relative row-start-2 place-self-start h-8 w-8 rounded-md border-black border-2 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
