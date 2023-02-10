import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import SearchBar from "../../../../Common/Search/SearchBar";
import { LexicaImages } from "../../../Scan/types/scan.types";
import { BaseProps } from "../types/canvas.types";

const Base: FunctionComponent<BaseProps> = ({
  searchTarget,
  handleChangeSearch,
  handleKeyEnter,
  searchLoading,
  quickSearchResults,
  fillImages,
  addImageToCanvas,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-row">
      <div className="relative w-fit h-fit hidden sm:grid grid-flow-row auto-rows-auto gap-6 self-end px-3">
        <div className="relative w-6 h-16 place-self-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmWnPmA26exdN8FG5didQk2DsYzDrjBfn7yhLRAgvDEFsT`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="relative w-12 h-8 place-self-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmVLBNJAC6MQmB3Z35sd17T9hbrK9zksRk4o7GRdfYiV89`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
      <div className="relative w-full h-72 grid grid-flow-col auto-cols-auto justify-self-center self-end gap-3 p-3">
        <div className="relative w-full h-fit flex flex-row gap-3 col-span-3 row-start-1 col-start-1 justify-self-start self-center">
          <div className="relative w-10 h-10">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/Qmf5avkPdJSs3yqUjvc7o61HNWfBbnsWAfJ66J8qnij1uS`}
              layout="fill"
              draggable={false}
              className="flex w-full h-full"
            />
          </div>
          <div className="relative w-full h-fit justify-self-start self-center">
            <SearchBar
              bg="black"
              borderColor="black"
              textColor="white"
              handleKeyDown={handleKeyEnter}
              handleOnChange={handleChangeSearch}
              searchTarget={searchTarget}
              searchLoading={searchLoading}
              height={"10"}
              textSize={"sm"}
              loaderSize={20}
              width={"72"}
              text={"latent search"}
            />
          </div>
        </div>
        <div
          className="relative w-80 h-3/5 col-start-1 row-start-2 rounded-md hidden sm:grid grid-flow-col auto-cols-auto justify-self-start self-center p-1"
          id="infinite"
        >
          <div className="relative w-full h-full place-self-center grid grid-flow-row auto-rows-auto gap-3 p-2 bg-black rounded-md">
            <div className="relative w-fit h-fit text-white font-digiB place-self-center row-start-1 text-2xl text-dialY">
              THE INFINITE CANVAS
            </div>
            <div className="relative w-fit h-fit text-white font-digiR place-self-center row-start-2 text-lg text-center text-dialG">
              a new editor format to pre-process messages & prompts
            </div>
          </div>
        </div>
        <div className="relative w-full h-4/5 col-start-1 sm:col-start-2 row-start-2 grid grid-flow-row auto-rows-auto self-end col-span-3 gap-3">
          <div className="relative w-full h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto self-end gap-2">
            {(quickSearchResults?.length > 0
              ? quickSearchResults
              : fillImages
            )?.map((result: LexicaImages | string, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-40 h-44 bg-offBlue rounded-md flex cursor-pointer"
                  onClick={() =>
                    addImageToCanvas(
                      quickSearchResults?.length > 0
                        ? (result as LexicaImages)?.srcSmall
                        : `${INFURA_GATEWAY}/ipfs/${result as string}`
                    )
                  }
                >
                  <Image
                    src={
                      quickSearchResults?.length > 0
                        ? (result as LexicaImages)?.srcSmall
                        : `${INFURA_GATEWAY}/ipfs/${result as string}`
                    }
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit hidden sm:grid grid-flow-row auto-rows-auto gap-6 self-end px-3">
        <div className="relative w-10 h-10 place-self-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/Qmdf4iGgMMrj4gAQy7DDaaDZEKet3DdxQrXwJkXYoSePK7`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="relative w-10 h-10 place-self-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmdBxkJrAmEbn3dFTubcdaRToXnjwnz8ZqHp27p9mz1cDm`}
            layout="fill"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Base;
