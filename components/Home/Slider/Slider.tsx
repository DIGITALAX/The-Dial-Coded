import Image from "next/image";
import { FunctionComponent } from "react";
import VisualViewer from "./VisualViewer";

const Slider: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white p-10 gap-10">
      <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto">
        <div className="relative w-fit h-fit col-start-1 grid grid-flow-row auto-rows-auto gap-8">
          <div className="relative w-fit h-fit row-start-1 place-self-center cursor-pointer hover:opacity-80 active:scale-95">
            <Image
              width={40}
              height={40}
              src="https://thedial.infura-ipfs.io/ipfs/QmeEDch97j4u2fKzsSTZk5WxE4CWDppqngEXHmTJ9hne5T"
              alt="forward"
            />
          </div>
          <div className="relative w-fit h-fit row-start-2 place-self-center cursor-pointer hover:opacity-80 active:scale-95">
            <Image
              width={40}
              height={40}
              src="https://thedial.infura-ipfs.io/ipfs/QmeEDch97j4u2fKzsSTZk5WxE4CWDppqngEXHmTJ9hne5T"
              alt="back"
            />
          </div>
        </div>
        <VisualViewer />
      </div>
     
    </div>
  );
};

export default Slider;
