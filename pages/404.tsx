import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../lib/lens/constants";

const Custom404: FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  return (
    <div className="relative w-full h-screen grid grid-flow-col auto-cols-auto bg-black/70">
      <div className="col-start-1 relative w-fit h-fit grid grid-flow-row auto-rows-auto place-self-center gap-10">
        <div className="relative w-fit h-fit place-self-center font-digiB text-offWhite text-2xl text-center row-start-1">
          Frequency out of range. <br />
          <br /> Scan your dial to try again.
        </div>
        <div
          className="relative place-self-center w-60 h-60 hover:rotate-3 active:rotate-6 row-start-2"
          onClick={() => router.replace("/")}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
            className="relative w-fit h-fit relative cursor-pointer"
            width={100}
            height={100}
            alt="dial"
          />
        </div>
      </div>
    </div>
  );
};

export default Custom404;
