import { FunctionComponent } from "react";
import useConnect from "../hooks/useConnect";

const Connect: FunctionComponent = (): JSX.Element => {
  const { handleConnect } = useConnect();
  return (
    <div
      id={"connect"}
      className="relative w-fit h-fit col-start-1 place-self-center cursor-pointer active:scale-95 hover:opacity-60 font-dosis p-2 border-2 border-white text-white bg-offBlue/40"
      onClick={() => handleConnect()}
    >
      Connect
    </div>
  );
};

export default Connect;
