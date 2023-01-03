import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { setMixtapePage } from "../../../redux/reducers/mixtapePageSlice";
import { PanelOptionProps } from "../types/common.types";

const PanelOption: FunctionComponent<PanelOptionProps> = ({
  index,
  dispatch,
  layoutType,
  setLayout,
  uri,
}): JSX.Element => {
  const router = useRouter();
  return (
    <div
      className={`relative w-fit h-12 col-start-${
        index + 1
      } grid grid-flow-col auto-cols-auto gap-2 cursor-pointer hover:opacity-80 active:scale-95`}
      key={index}
      onClick={() => {
        router.push(`/#${layoutType[index]}`);
        dispatch(setLayout(layoutType[index]));
        layoutType[index] === "Mixtape" &&
          dispatch(setMixtapePage("Add New Mixtape"));
      }}
    >
      <div className="relative w-fit h-fit col-start-1 place-self-center">
        <Image
          alt="files"
          src={`${INFURA_GATEWAY}/ipfs/${uri}`}
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
