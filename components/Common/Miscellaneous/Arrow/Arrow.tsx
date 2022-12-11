import Image from "next/image";
import { FunctionComponent } from "react";
import { ArrowProps } from "../../types/common.types";

const Arrow: FunctionComponent<ArrowProps> = ({
  handleValue,
  value,
}): JSX.Element => {
  return (
    <div
      className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto hover:opacity-80 active:scale-95 cursor-pointer place-self-center pl-6"
      onClick={() => handleValue(!value)}
    >
      <div className="relative w-fit h-fit col-start-1">
        <Image
          width={12}
          height={12}
          alt="leftArrow"
          src="https://thedial.infura-ipfs.io/ipfs/QmeeHhyUcz1SM8KJB2SrY7b7r9uhYFEWuMx45b2a2VgoLB"
        />
      </div>
      <div className="relative w-fit h-fit col-start-2 place-self-center">
        <Image
          width={12}
          height={12}
          alt="centerDot"
          src="https://thedial.infura-ipfs.io/ipfs/QmZSpwDjU9YYru6g44RVPaeeoLAu5YnCkXTCaNfEULzZ3i"
        />
      </div>
      <div className="relative w-fit h-fit col-start-3">
        <Image
          width={12}
          height={12}
          alt="rightArrow"
          src="https://thedial.infura-ipfs.io/ipfs/QmXfG8mpaHad7rVnbqUtGrnCsm9vkXZT3zNa8mugndUS72"
        />
      </div>
    </div>
  );
};

export default Arrow;
