import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { TurnerProps } from "./../types/scan.types";

const Turner: FunctionComponent<TurnerProps> = ({
  currentSetting,
  handleCount,
  canvasURIs,
}): JSX.Element => {

  return (
    <div className="relative w-full h-fit col-start-2 grid grid-flow-row auto-rows-auto self-center justify-end gap-10 pr-10">
      <div
        className="relative w-fit h-fit row-start-1 hover:rotate-3 active:rotate-6"
        onClick={() => handleCount(currentSetting)}
      >
        <Image
          src="https://thedial.infura-ipfs.io/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY"
          className="relative w-fit h-fit relative cursor-pointer"
          width={230}
          height={230}
          alt="dial"
        />
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-cols auto-cols-auto gap-6">
        <div className="relative w-full h-10 col-start-1 grid grid-flow-col auto-cols-auto rounded-lg border-2 border-white opacity-90 gap-3 pl-1 bg-bluey/30">
          <div className="relative col-start-1 w-fit h-fit place-self-center place-self-center grid grid-flow-col auto-cols-auto pl-2">
            <Image
              src="https://thedial.infura-ipfs.io/ipfs/QmZhr4Eo92GHQ3Qn3xpv8HSz7ArcjgSPsD3Upe9v8H5rge"
              alt="search"
              width={15}
              height={20}
              className="flex w-fit h-fit relative col-start-1 place-self-center cursor-pointer hover:opacity-80 active:scale-95"
            />
          </div>
          <div className="relative col-start-2 w-1 h-5/6 self-center justify-self-start border border-white rounded-lg"></div>
          <input
            className="relative col-start-3 w-full h-full caret-offBlue focus:caret-offBlue font-dosis pl-2 text-white rounded-lg bg-transparent"
            name="search"
            placeholder="search"
          />
        </div>
        <div className="relative w-10 h-full col-start-2">
          <Image
            src={`https://thedial.infura-ipfs.io/ipfs/${
              canvasURIs[currentSetting]
            }`}
            layout="fill"
            alt="canvas"
          />
        </div>
      </div>
    </div>
  );
};

export default Turner;
