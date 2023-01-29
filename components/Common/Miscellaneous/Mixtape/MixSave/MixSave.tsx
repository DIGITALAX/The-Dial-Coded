import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { MixSaveProps } from "../../../types/common.types";

const MixSave: FunctionComponent<MixSaveProps> = ({ col }): JSX.Element => {
  return (
    <div
      className={`relative w-6 h-6 fo:w-8 fo:h-8 col-start-${col} place-self-center cursor-pointer active:scale-95`}
    >
      <Image
        src={`${INFURA_GATEWAY}/ipfs/QmPU5DYzwecKxLdmuobR4LWwrLZRPvEB9qSo6u4gxD56zz`}
        alt="save"
        layout="fill"
        // width={!queryWindowSize500 ? 30 : 18}
        // height={!queryWindowSize500 ? 30 : 18}
        priority
      />
    </div>
  );
};

export default MixSave;
