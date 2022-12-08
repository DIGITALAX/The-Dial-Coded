import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Marquee from "react-fast-marquee";

const Scan: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-screen row-start-1 grid grid-flow-row auto-cols-auto">
      <div className="absolute w-full h-full grid grid-flow-col auto-cols-auto">
        <Image
          src="https://thedial.infura-ipfs.io/ipfs/QmcDKJt29aMZeFpHtv61R4TZU1MbBXeb5RzfdoY6Ee2hsY"
          layout="fill"
          objectFit="cover"
          objectPosition={"top"}
          alt="mirrorMain"
          className="relative w-full h-full col-start-1 place-self-center mix-blend-lighten"
        />
      </div>
      <div className="relative w-full h-screen px-6 grid grid-flow-col auto-cols-auto row-start-1">
        <div className="relative col-start-1 w-fit h-fit self-center justify-self-start grid grid-flow-row auto-rows-auto">
          <div className="relative w-fit h-fit row-start-1 text-white font-dosis text-lg text-left">
            SOME TEXT ABOUT SITE GOES HERE
          </div>
          <div className="relative w-fit h-fit row-start-2 text-white font-dosis text-5xl uppercase text-left pb-3 pt-1">
            More text
          </div>
          <div className="relative w-fit h-fit row-start-3 text-white font-dosis text-xl text-left">
            And description sentence goes here continued on this line.
          </div>
        </div>
        <div className="relative w-full h-fit col-start-2 grid grid-flow-row auto-rows-auto self-center justify-end gap-10 pr-10">
          <div className="relative w-fit h-fit row-start-1">
            <Image
              src="https://thedial.infura-ipfs.io/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY"
              className="relative w-fit h-fit relative cursor-pointer"
              width={230}
              height={230}
              alt="dial"
            />
          </div>
          <div className="relative w-full h-fit row-start-2 grid grid-flow-cols auto-cols-auto gap-6">
            <div
              className="relative w-full h-10 col-start-1 grid grid-flow-col auto-cols-auto rounded-lg border-2 border-white opacity-90 gap-3 pl-1"
              id="inputbox"
            >
              <div className="relative col-start-1 w-fit h-fit place-self-center place-self-center grid grid-flow-col auto-cols-auto pl-2">
                <Image
                  src="https://thedial.infura-ipfs.io/ipfs/QmZhr4Eo92GHQ3Qn3xpv8HSz7ArcjgSPsD3Upe9v8H5rge"
                  alt="search"
                  width={15}
                  height={20}
                  className="flex w-fit h-fit relative col-start-1 place-self-center cursor-pointer hover:opacity-80 active:scale-95"
                />
              </div>
              <div className="relative col-start-2 w-1 h-5/6 self-center justify-self-start border border-white rounded-lg"></div>
              <input
                className="relative col-start-3 w-full h-full caret-offBlue focus:caret-offBlue font-dosis pl-2 text-white rounded-lg bg-transparent"
                name="search"
                placeholder="search"
              />
            </div>
            <div className="relative w-10 h-full col-start-2">
              <Image
                src="https://thedial.infura-ipfs.io/ipfs/QmQZAsmdnPUdGGhBVqWLLddLLWYF9v3oj1wjVe1S5sSm47"
                layout="fill"
                alt="canvas"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-full h-fit grid grid-flow-col auto-cols-auto row-start-2 self-end">
        <Marquee gradient={false} speed={30} direction={"right"}>
          <div className="relative w-full h-fit text-white font-dosis uppercase leading-30 text-[12vw]">
            {" "}
            some kind of big text some kind of big text{" "}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default Scan;
