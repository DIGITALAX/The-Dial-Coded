import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import SearchBar from "../../../../Common/Search/SearchBar";
import { LexicaImages } from "../../../Scan/types/scan.types";
import { BaseProps } from "../types/canvas.types";

const Base: FunctionComponent<BaseProps> = ({
  searchTarget,
  handleChangeSearch,
  handleKeyEnter,
  searchLoading,
  quickSearchResults,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto justify-self-center self-end gap-3">
      <div className="relative w-80 h-4/5 col-start-1 border border-white bg-black rounded-md grid grid-flow-col auto-cols-auto justify-self-start self-end">
        <div className="relative w-fit h-fit text-white font-dosis place-self-center">
          Some cool text
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
          {quickSearchResults?.map((result: LexicaImages, index: number) => {
            return (
              <div
                key={index}
                className="relative w-40 h-44 bg-offBlue rounded-md flex"
              >
                <Image
                  src={result?.srcSmall}
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
