import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";

const FetchMoreLoading: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto py-3">
      <div className="relative place-self-center w-6 h-6 animate-spin">
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
        />
      </div>
    </div>
  );
};

export default FetchMoreLoading;
