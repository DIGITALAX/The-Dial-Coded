import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { TurnerProps } from "./../types/scan.types";

const Turner: FunctionComponent<TurnerProps> = ({
  currentSetting,
  handleCount,
  canvasURIs,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit col-start-1 row-start-2 md:row-start-1 md:col-start-2 grid grid-flow-row auto-rows-auto self-center sm:self-start md:self-center justify-center md:justify-end gap-10 pr-10 pt-8 sm:pt-16 top-24 lg:top-0 lg:pt-0">
      <div
        className="relative w-fit h-fit row-start-1 hover:rotate-3 active:rotate-6"
        onClick={() => handleCount(currentSetting)}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
          className="relative w-fit h-fit relative cursor-pointer"
          width={230}
          height={230}
          alt="dial"
        />
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto gap-6">
        <div className="relative w-full h-10 col-start-1 grid grid-flow-col auto-cols-auto rounded-lg border-2 border-white opacity-90 gap-3 pl-1 bg-bluey/30">
          <div className="relative col-start-1 w-fit h-fit place-self-center place-self-center grid grid-flow-col auto-cols-auto pl-2">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmZhr4Eo92GHQ3Qn3xpv8HSz7ArcjgSPsD3Upe9v8H5rge`}
              alt="search"
              width={15}
              height={20}
              className="flex w-fit h-fit relative col-start-1 place-self-center cursor-pointer hover:opacity-80 active:scale-95"
            />
          </div>
          <div className="relative col-start-2 w-1 h-5/6 self-center justify-self-start border border-white rounded-lg"></div>
          <input
            className="relative col-start-3 w-full h-full caret-offBlue focus:caret-offBlue font-dosis pl-2 text-white rounded-lg bg-transparent caret-transparent"
            name="search"
            placeholder="search"
          />
        </div>
        <div className="relative w-10 h-full col-start-2">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
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
