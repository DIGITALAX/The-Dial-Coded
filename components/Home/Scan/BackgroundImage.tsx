import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const BackgroundImage: FunctionComponent = (): JSX.Element => {
  return (
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
  );
};

export default BackgroundImage;
