import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { NotificationSliderProps } from "./../../types/common.types";

const NotificationSlider: FunctionComponent<NotificationSliderProps> = ({
  images,
}): JSX.Element => {
  return (
    <div className="relative w-full max-w-[60vw] f5:max-w-[43vw] col-start-2 h-full justify-self-end grid grid-flow-col auto-cols-auto gap-8 overflow-x-scroll">
      {images?.map((image: string, index: number) => {
        return (
          <div
            id="crt"
            key={index}
            className={`relative w-44 h-full col-start-${
              index + 1
            } justify-self-end self-center cursor-pointer active:opacity-70`}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${image}`}
              alt={image}
              layout="fill"
              className="p-0.5"
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSlider;
