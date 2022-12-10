import { FunctionComponent } from "react";
import useParameters from "./hooks/useParameters";
import { BsFillEyeFill } from "react-icons/bs";

const Parameters: FunctionComponent = (): JSX.Element => {
  const { feedOrder, feedType, feedPriority } = useParameters();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-col auto-cols-auto ">
      <div className="relative w-full h-fit col-start-1 grid grid-flow-col auto-cols-auto">
        {feedOrder?.map((item: string, index: number) => {
          return (
            <div
              id="record6"
              key={index}
              className={`relative w-28 h-fit px-3 py-1 ${
                index === 0 ? "rounded-t-lg" : "rounded-b-lg"
              } col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer active:scale-95 hover:opacity-80`}
            >
              <div className="relative w-fit h-fit col-start-1 place-self-center">
                <BsFillEyeFill color="white" size={15} />
              </div>
              <div className="relative w-fit h-fit col-start-2 text-white font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto">
                <div className="relative col-start-1 place-self-center w-fit h-fit">
                  {item}
                </div>
              </div>
              <div className="relative w-fit h-fit col-start-3 place-self-center"></div>
            </div>
          );
        })}
        {feedType?.map((item: string, index: number) => {
          return (
            <div
              key={index}
              className="relative w-20 h-fit px-3 py-1 rounded-lg col-start-2 grid grid-flow-col auto-cols-auto"
            >
              <div
                id="record6"
                className="relative w-fit h-fit col-start-1"
              ></div>
              <div className="relative w-fit h-fit col-start-2"></div>
              <div className="relative w-fit h-fit col-start-3"></div>
            </div>
          );
        })}
        {feedPriority?.map((item: string, index: number) => {
          return (
            <div
              key={index}
              className="relative w-20 h-fit px-3 py-1 rounded-lg col-start-3 grid grid-flow-col auto-cols-auto"
            >
              <div
                id="record6"
                className="relative w-fit h-fit col-start-1"
              ></div>
              <div className="relative w-fit h-fit col-start-2"></div>
              <div className="relative w-fit h-fit col-start-3"></div>
            </div>
          );
        })}
      </div>
      <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto"></div>
    </div>
  );
};

export default Parameters;
