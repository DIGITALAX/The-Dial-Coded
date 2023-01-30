import Image from "next/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";

const RouterChange: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-screen h-screen grid grid-flow-col auto-cols-auto bg-white/80">
      <div className="relative animate-spin w-20 h-20 place-self-center col-start-1">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
          className="relative w-fit h-fit relative cursor-pointer"
          width={100}
          height={100}
          alt="dial"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default RouterChange;
