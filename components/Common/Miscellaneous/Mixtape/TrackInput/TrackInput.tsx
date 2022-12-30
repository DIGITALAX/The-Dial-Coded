import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoMdImages } from "react-icons/io";
import { RiCloseCircleFill } from "react-icons/ri";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { TrackInputProps } from "../../../types/common.types";
import Arrow from "../../Arrow/Arrow";

const TrackInput: FunctionComponent<TrackInputProps> = ({
  index,
  mixtapeLoading,
  uploadImage,
  handleRemoveImage,
  imageLoading,
  titleArray,
  imageArray,
  handleTrackTitle,
  handleRemoveTrack,
}): JSX.Element => {
  return (
    <div
      className={`grid grid-flow-row auto-rows-auto gap-2 relative w-full h-fit row-start-${
        index + 1
      }`}
    >
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto row-start-1 gap-2">
        <div className="relative w-fit h-fit col-start-1">
          <Arrow
            up={"Qmecvxs9tyMZ7NzgAcCqn4bnQ6oVp7s8TXvZB7hgEcMasD"}
            middle={"QmYoiFyV4tBP3dcqExDMepQcYogH6ZBMQCZQhxNHauEBGf"}
            down={"QmQKBsx54h5wQnErZaSza8oPC1XXa5FKnjuuK2ZTsWmJw2"}
            vertical={true}
          />
        </div>
        <div className="relative w-full h-full col-start-2 grid grid-flow-col auto-cols-auto gap-5 justify-self-end">
          <div className="relative w-[33vw] h-fit col-start-1 p-px bg-lB rounded-md">
            <input
              name={"trackName"}
              className="relative w-full h-full p-2 text-black font-digiR rounded-md row-start-1 caret-transparent"
              value={titleArray[index]}
              onChange={(e: FormEvent) => handleTrackTitle(e, index)}
            />
          </div>
          {imageArray[index] && (
            <div className="relative w-full h-full grid grid-flow-col auto-cols-auto col-start-2 gap-2">
              <div
                key={index}
                className={`relative w-10 h-full border-2 border-black rounded-lg bg-black grid grid-flow-col auto-cols-auto col-start-1`}
              >
                <div className="relative w-full h-full flex col-start-1 grid grid-flow-col auto-cols-auto">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${imageArray[index]}`}
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"center"}
                    className="rounded-md absolute"
                  />
                  <div
                    className={`relative w-fit h-fit col-start-1 justify-self-end self-start p-px ${
                      !mixtapeLoading && "cursor-pointer active:scale-95"
                    }`}
                    onClick={() => {
                      !mixtapeLoading ? handleRemoveImage(index) : {};
                    }}
                  >
                    <RiCloseCircleFill />
                  </div>
                </div>
              </div>
            </div>
          )}
          <label
            className={`relative w-fit h-fit ${
              imageArray[index] ? "col-start-3" : "col-start-2"
            } place-self-center ${
              !mixtapeLoading && "cursor-pointer active:scale-95"
            } ${imageLoading && imageLoading[index] && "animate-spin"}`}
            onChange={(e: FormEvent) => uploadImage(e, index)}
          >
            {imageLoading && imageLoading[index] ? (
              <AiOutlineLoading color="#81A8F8" size={20} />
            ) : (
              <IoMdImages color="#81A8F8" size={20} />
            )}
            <input
              type="file"
              accept="image/png"
              hidden
              required
              id="files"
              multiple={false}
              name="images"
              className="caret-transparent"
              disabled={
                mixtapeLoading || (imageLoading && imageLoading[index])
                  ? true
                  : false
              }
            />
          </label>
          <div
            className={`relative w-fit h-fit ${
              imageArray[index] ? "col-start-4" : "col-start-3"
            } place-self-center ${
              !mixtapeLoading && "cursor-pointer active:scale-95"
            } grid grid-flow-col auto-cols-auto`}
            onClick={mixtapeLoading ? () => {} : () => handleRemoveTrack(index)}
          >
            <div className="relative w-fit h-fit col-start-1 place-self-center flex">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmcYatyHhVBravcfEyrLx4Cbjt5Pkicdnq7nJ88XeG7Dwt`}
                alt="cross"
                width={20}
                height={20}
                className="relative w-fit h-fit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackInput;
