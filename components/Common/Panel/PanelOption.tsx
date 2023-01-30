import Image from "next/legacy/image";
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
      className={`relative w-16 md:w-fit h-fit col-start-${
        index + 1
      } grid grid-flow-col auto-cols-auto gap-2 cursor-pointer hover:opacity-80 active:scale-95 p-1.5 rounded-md border border-4 border-offBlue/60 shadow-md bg-deep`}
      key={index}
      id="panel"
      onClick={() => {
        router.push(`/#${layoutType[index]}`);
        dispatch(setLayout(layoutType[index]));
        layoutType[index] === "Mixtape" &&
          dispatch(setMixtapePage("Add New Mixtape"));
      }}
    >
      {/* <Image
        src={`${INFURA_GATEWAY}/ipfs/QmQDQhA2Wxydyf1Lf3BVPCzN5fySYbdTyYp5eSz1x2bReA`}
        layout="fill"
        objectFit="cover"
        className="absolute w-full h-full"
      /> */}
      <div className="relative w-fit h-fit col-start-1 place-self-center flex">
        <Image
          alt="files"
          src={`${INFURA_GATEWAY}/ipfs/${uri}`}
          width={25}
          height={25}
          draggable={false}
        />
      </div>
      <div className="relative w-fit h-full gap-1 col-start-2 grid grid-flow-row auto-rows-auto place-self-center">
        <div className="relative row-start-1 h-2 w-2 rounded-full border border-offBlack self-center"></div>
        <div className="relative row-start-2 h-2 w-2 rounded-full border border-offBlack self-center"></div>
        <div className="relative row-start-3 h-2 w-2 rounded-full border border-offBlack self-center"></div>
      </div>
    </div>
  );
};

export default PanelOption;
