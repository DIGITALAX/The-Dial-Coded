import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { BadgeProps } from "../types/common.types";

const Badge: FunctionComponent<BadgeProps> = ({
  index,
  badgeInfo,
}): JSX.Element => {
  return (
    <div
      className="relative w-20 h-20 rounded-lg border-2 border-offBlack grid grid-flow-col auto-cols-auto cursor-pointer"
      key={index}
    >
      <Image
        src={`${INFURA_GATEWAY}/ipfs/${badgeInfo.image}`}
        layout="fill"
        objectFit="cover"
      />
      <div
        id={badgeInfo.color}
        className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto rounded-md p-1"
      >
        <div className="relative col-start-1 place-self-center w-full h-full grid grid-flow-col auto-cols-auto rounded-full border-2 border-offBlack">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmVxMmLejwVJrDAfV1vgYVwJyxP29i2K51LiqxK62adPbg`}
            layout="fill"
            objectFit="cover"
            className="hover:rotate-12"
          />
          <div className="relative w-fit h-fit place-self-center capitalize font-dosis text-black text-xs text-center">
            {badgeInfo.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badge;
