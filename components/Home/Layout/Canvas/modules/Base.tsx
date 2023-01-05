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
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto justify-self-center self-end gap-3">
      <div className="relative w-80 h-4/5 col-start-1 border border-white bg-black rounded-md grid grid-flow-col auto-cols-auto justify-self-start self-end">
        <div className="relative w-fit h-fit place-self-center grid grid-flow-row auto-rows-auto gap-3 p-2">
          <div className="relative w-fit h-fit text-white font-digiB place-self-center row-start-1 text-2xl text-dialY">
            THE INFINITE CANVAS
          </div>
          <div className="relative w-fit h-fit text-white font-digiR place-self-center row-start-2 text-lg text-center text-dialG">
            a new editor format to pre-process messages & prompts
          </div>
        </div>
      </div>
      <div className="relative w-full h-full col-start-2 grid grid-flow-row auto-rows-auto place-self-center col-span-3 gap-4">
        <div className="relative w-full h-fit justify-self-start self-center">
          <SearchBar
            bg="grayBlue"
            borderColor="white"
            textColor="white"
            handleKeyDown={handleKeyEnter}
            handleOnChange={handleChangeSearch}
            searchTarget={searchTarget}
            searchLoading={searchLoading}
            height={"8"}
            textSize={"sm"}
            loaderSize={20}
            width={"72"}
          />
        </div>
        <div className="relative w-full h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto self-end gap-2">
          {(quickSearchResults?.length > 0
            ? quickSearchResults
            : fillImages
          )?.map((result: LexicaImages | string, index: number) => {
            return (
              <div
                key={index}
                className="relative w-40 h-44 bg-offBlue rounded-md flex"
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
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Base;
