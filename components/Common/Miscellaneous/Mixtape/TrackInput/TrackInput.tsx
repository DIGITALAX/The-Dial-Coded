import Image from "next/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { TrackInputProps } from "../../../types/common.types";
import Arrow from "../../Arrow/Arrow";

const TrackInput: FunctionComponent<TrackInputProps> = ({
  index,
}): JSX.Element => {
  return (
    <div
      className={`grid grid-flow-col auto-cols-auto gap-2 relative w-full h-fit row-start-${
        index + 1
      }`}
    >
      <div className="relative w-fit h-fit col-start-1">
        <Arrow
          up={"Qmecvxs9tyMZ7NzgAcCqn4bnQ6oVp7s8TXvZB7hgEcMasD"}
          middle={"QmYoiFyV4tBP3dcqExDMepQcYogH6ZBMQCZQhxNHauEBGf"}
          down={"QmQKBsx54h5wQnErZaSza8oPC1XXa5FKnjuuK2ZTsWmJw2"}
          vertical={true}
        />
      </div>

      <div className="relative w-full h-full col-start-2 grid grid-flow-col auto-cols-auto gap-5 justify-self-end">
        <div className="relative w-[40vw] h-fit col-start-1 p-px bg-lB rounded-md">
          <input
            name={"trackName"}
            className="relative w-full h-full p-2 text-black font-digiR rounded-md row-start-1"
            placeholder="TRACK NAME | SOURCE (shortened)"
            defaultValue={"TRACK NAME | SOURCE (shortened)"}
          />
        </div>
        <div className="relative w-fit h-fit col-start-2 place-self-center cursor-pointer active:scale-95">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmTZmuX3ZiDXHTaFcB31yf6cFC98xPZSAciDC7GhmDgDYq`}
            alt="edit"
            width={20}
            height={20}
          />
        </div>
        <div className="relative w-fit h-fit col-start-3 place-self-center cursor-pointer active:scale-95">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcYatyHhVBravcfEyrLx4Cbjt5Pkicdnq7nJ88XeG7Dwt`}
            alt="cross"
            width={20}
            height={20}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackInput;
