import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { TfiSearch } from "react-icons/tfi";
import SearchBar from "../../../../../Common/SearchBar/SearchBar";
import { SliderSearchProps } from "./types/slidersearch.types";

const SliderSearch: FunctionComponent<SliderSearchProps> = ({
  handleChangeSearch,
  handleKeyEnter,
  searchTarget,
  searchLoading,
  dropDown,
  publicationsSearchNotDispatch,
  handleChosenSearch,
  prompts,
}): JSX.Element => {
  return (
    <div
      id="sliderSearch"
      className="relative w-11/12 h-fit grid grid-flow-row auto-rows-auto"
    >
      <div className="relative w-full h-fit row-start-1">
        <SearchBar
          bg="grayBlue"
          borderColor="black"
          textColor="black"
          handleKeyDown={handleKeyEnter}
          handleOnChange={handleChangeSearch}
          searchTarget={searchTarget}
          searchLoading={searchLoading}
          height={"16"}
          textSize={"lg"}
          loaderSize={20}
        />
      </div>
      {dropDown && (
        <div className="absolute w-full h-96 row-start-2 z-10 overflow-y-scroll">
          {
            <div
              className={`relative grid grid-flow-row auto-rows-auto w-full h-fit`}
            >
              {searchLoading ? (
                <div className="relative w-full h-10 px-3 py-2 col-start-1 grid grid-flow-col auto-cols-auto bg-white">
                  <div className="relative w-fit h-fit place-self-center animate-spin col-start-1">
                    <AiOutlineLoading color="black" size={15} />
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto">
                  {publicationsSearchNotDispatch?.length > 0 && (
                    <div
                      className="rounded-md relative w-full h-fit px-3 py-2 col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border border-black font-dosis hover:bg-offBlue row-start-1 text-black bg-offWhite"
                      onClick={() => handleChosenSearch()}
                    >
                      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto place-self-center gap-2">
                        <div className="relative w-fit h-fit col-start-1 place-self-center">
                          <TfiSearch color="black" size={15} />
                        </div>
                        <div className="relative w-fit h-fit col-start-2 place-self-center">
                          {publicationsSearchNotDispatch?.length}
                        </div>
                        <div className="relative col-start-3 place-self-center text-sm">
                          On this Topic
                        </div>
                      </div>
                    </div>
                  )}
                  {prompts?.length > 0 &&
                    prompts?.map((prompt: string, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`rounded-md relative w-full h-fit px-3 py-2 col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border border-black hover:bg-offBlue bg-white text-center`}
                          onClick={() => {
                            handleChosenSearch(prompt);
                          }}
                        >
                          <div className="relative w-fit h-fit col-start-1 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto gap-2 py-2">
                            {prompt}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default SliderSearch;
