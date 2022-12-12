import Image from "next/image";
import { FunctionComponent } from "react";
import { setMixtapePage } from "../../../redux/reducers/mixtapePageSlice";
import { PanelOptionProps } from "../types/common.types";

const PanelOption: FunctionComponent<PanelOptionProps> = ({
  index,
  dispatch,
  layoutType,
  setLayout,
  uri,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-12 col-start-${
        index + 1
      } grid grid-flow-col auto-cols-auto gap-2 cursor-pointer hover:opacity-80 active:scale-95`}
      key={index}
      onClick={() => {dispatch(setLayout(layoutType[index]))
      layoutType[index] === "Mixtape" && dispatch(setMixtapePage("Create"))}}
    >
      <div className="relative w-fit h-fit col-start-1 place-self-center">
        <Image
          alt="files"
          src={`https://thedial.infura-ipfs.io/ipfs/${uri}`}
          width={30}
          height={30}
        />
      </div>
      <div className="relative w-fit h-fit gap-1 col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
        <div className="relative row-start-1 h-2 w-2 rounded-full border border-offBlack self-center"></div>
        <div className="relative row-start-2 h-2 w-2 rounded-full border border-offBlack self-center"></div>
        <div className="relative row-start-3 h-2 w-2 rounded-full border border-offBlack self-center"></div>
      </div>
    </div>
  );
};

export default PanelOption;
