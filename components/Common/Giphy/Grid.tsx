import Image from "next/legacy/image";
import { FormEvent, FunctionComponent } from "react";
import { GridProps } from "../types/common.types";

const Grid: FunctionComponent<GridProps> = ({
  handleGif,
  handleGifSubmit,
  results,
  handleSetGif,
  width,
  background,
}): JSX.Element => {
  return (
    <div
      className={`relative ${
        width ? "w-full" : "w-fit"
      } h-fit grid grid-flow-row auto-rows-auto gap-2`}
    >
      <input
        className={`relative row-start-1 col-start-1 h-10 bg-white font-dosis text-offBlack p-2 rounded-md caret-transparent ${
          width ? "w-full" : "w-full sm:w-96"
        }`}
        name="gif"
        onChange={(e: FormEvent) => handleGif(e)}
      />
      <div
        className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto row-start-1 col-start-2 font-dosis text-white cursor-pointer active:scale-95"
        onClick={(e: FormEvent) => handleGifSubmit(e)}
      >
        <div className="relative w-fit h-fit col-start-1 place-self-center">
          Search
        </div>
      </div>
      {results?.length !== 0 && (
        <div
          className={`relative w-full h-40 row-start-3 col-span-2 col-start-1 grid grid-cols-2 sm:grid-cols-3 overflow-y-scroll pb-3 gap-2 ${
            background && `bg-${background}`
          }`}
        >
          {results?.map((result: any, index: number) => {
            return (
              <div
                key={index}
                className="relative w-32 h-20 bg-offBlue cursor-pointer active:scale-95 place-self-center"
                onClick={() => handleSetGif(result?.media_formats?.gif?.url)}
              >
                <Image
                  layout="fill"
                  objectFit="cover"
                  src={result?.media_formats?.gif?.url}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Grid;
