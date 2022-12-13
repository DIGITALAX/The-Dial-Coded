import Image from "next/image";
import { FunctionComponent } from "react";
import { MixSaveProps } from "../../../types/common.types";

const MixSave: FunctionComponent<MixSaveProps> = ({ col }): JSX.Element => {
  return (
    <div className={`relative w-fit h-fit col-start-${col} place-self-center cursor-pointer active:scale-95`}>
      <Image
        src="${INFURA_GATEWAY}/ipfs/QmPU5DYzwecKxLdmuobR4LWwrLZRPvEB9qSo6u4gxD56zz"
        alt="save"
        width={30}
        height={30}
        priority
      />
    </div>
  );
};

export default MixSave;
