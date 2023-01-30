import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { RootState } from "../../../../redux/store";
import { BackgroundImageProps } from "./../types/scan.types";
import { useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";

const BackgroundImage: FunctionComponent<BackgroundImageProps> = ({
  mainImage,
}): JSX.Element => {
  const backgroundNumber = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );
  return (
    <div className="absolute w-full h-full grid grid-flow-col auto-cols-auto">
      <Image
        src={`${INFURA_GATEWAY}/ipfs/${mainImage[backgroundNumber]}`}
        layout="fill"
        objectFit="cover"
        objectPosition={"top"}
        alt="mirrorMain"
        priority
        className="relative w-full h-full col-start-1 place-self-center opacity-80"
        draggable={false}
      />
    </div>
  );
};

export default BackgroundImage;
