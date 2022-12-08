import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const PostBox: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative row-start-1 w-full h-full rounded-xl grid grid-flow-col auto-cols-auto p-10">
      <div
        id="radialPinkBorder"
        className="relative w-full h-40 col-start-1 rounded-xl"
      >
        <Image
          src="https://thedial.infura-ipfs.io/ipfs/QmPTSfH2nh8S7H4yXWHn3wxBADoGfvj7aD8P4gkLmkKDpw"
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full p-2 rounded-xl"
        />
        <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto p-4">
          <div
            id="radialPinkBorder"
            className="relative col-start-1 w-full h-full grid grid-flow-col auto-cols-auto p-1 rounded-xl"
          >
            <div className="relative w-full h-full col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-pointer active:opacity-80">
              <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3 pl-4 pt-4">
                <div className="relative col-start-1 w-fit h-fit">
                  <Image
                    src="https://thedial.infura-ipfs.io/ipfs/QmPzrV58nvgNZW9zTkNpy5YBCZBEs6kTKhai4ZkEFeaWQj"
                    width={30}
                    height={30}
                  />
                </div>
                <div className="relative col-start-2 w-fit h-fit font-dosis text-offBlack place-self-center">
                  What's happening?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
