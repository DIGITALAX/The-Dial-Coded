import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { BackgroundImageProps } from "./../types/scan.types";

const BackgroundImage: FunctionComponent<BackgroundImageProps> = ({
  mainImage,
  currentSetting,
}): JSX.Element => {
  return (
    <div className="absolute w-full h-full grid grid-flow-col auto-cols-auto">
      <Image
        src={`https://thedial.infura-ipfs.io/ipfs/${mainImage[currentSetting-1]}`}
        layout="fill"
        objectFit="cover"
        objectPosition={"top"}
        alt="mirrorMain"
        className="relative w-full h-full col-start-1 place-self-center opacity-80"
      />
    </div>
  );
};

export default BackgroundImage;
